import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { sendGmailApiMessage } from '../lib/gmail-api';
import { prisma } from '@/lib/db/prisma';
import { normalizeEmail } from '../lib/email';
import { normalizeUsername, resolveLoginIdentifier, validatePassword, validateUsername } from '../lib/credential-input';
import { hashPassword, verifyPassword } from '../lib/password-hash';
import { consumePersistentRateLimit } from '../lib/rate-limit';
import { SESSION_ABSOLUTE_MS, SESSION_INACTIVITY_MS } from '../lib/session-policy';

const TOKEN_TTL_MS = 15 * 60 * 1000;
const secret = () => process.env.AUTH_SECRET ?? '';
const tokenDigest = (token: string) => createHash('sha256').update(token).digest('hex');

export type CredentialResult = { id: string; email: string | null; name: string | null };

export async function authenticateCredentials(identifier: unknown, password: unknown): Promise<CredentialResult | null> {
  if (typeof identifier !== 'string' || typeof password !== 'string' || !secret()) return null;
  const normalized = resolveLoginIdentifier(identifier);
  if (!normalized) return null;
  const [byIdentifier, byIp] = await Promise.all([
    consumePersistentRateLimit(prisma, `login:${normalized}`, secret(), 10, 15 * 60_000),
    consumePersistentRateLimit(prisma, `login-ip:${(await import('../lib/request-context')).getAuthRequestContext()?.clientIp ?? 'unknown'}`, secret(), 30, 15 * 60_000),
  ]);
  if (!byIdentifier || !byIp) return null;
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: normalized }, { email: normalized }] },
  });
  if (!user?.passwordHash || !user.emailVerified) return null;
  if (!(await verifyPassword(user.passwordHash, password))) return null;
  return { id: user.id, email: user.email, name: user.name };
}

async function sendActionEmail(email: string, token: string, purpose: 'verify' | 'reset', locale: 'vi' | 'en') {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new Error('EMAIL_APP_URL_NOT_CONFIGURED');
  const path = purpose === 'verify' ? 'verify-email' : 'reset-password';
  const url = new URL(`/${locale}/${path}`, baseUrl);
  url.searchParams.set('token', token);
  const vi = locale === 'vi';
  await sendGmailApiMessage({
    to: email,
    subject: purpose === 'verify' ? (vi ? 'Xác minh email TyPusEnglish' : 'Verify your TyPusEnglish email') : (vi ? 'Đặt lại mật khẩu TyPusEnglish' : 'Reset your TyPusEnglish password'),
    text: `${vi ? 'Mở liên kết này' : 'Open this link'}: ${url.toString()}\n${vi ? 'Liên kết hết hạn sau 15 phút.' : 'This link expires in 15 minutes.'}`,
  });
}

async function issueActionToken(userId: string, purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD', email: string, locale: 'vi' | 'en', pendingEmail?: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await prisma.$transaction([
    prisma.accountToken.deleteMany({ where: { userId, purpose } }),
    prisma.accountToken.create({ data: { userId, purpose, email: pendingEmail, tokenHash: tokenDigest(token), expiresAt } }),
  ]);
  await sendActionEmail(email, token, purpose === 'VERIFY_EMAIL' ? 'verify' : 'reset', locale);
}

export async function registerCredentials(input: { email: unknown; username: unknown; password: unknown; locale: 'vi' | 'en' }): Promise<'accepted' | 'invalid'> {
  const email = normalizeEmail(input.email);
  const username = typeof input.username === 'string' ? normalizeUsername(input.username) : null;
  const password = typeof input.password === 'string' ? input.password : '';
  if (!email || !username || !validateUsername(username) || !validatePassword(password)) return 'invalid';
  if (!secret()) throw new Error('AUTH_NOT_CONFIGURED');
  const context = (await import('../lib/request-context')).getAuthRequestContext();
  const [byEmail, byIp] = await Promise.all([
    consumePersistentRateLimit(prisma, `register:${email}`, secret(), 5, 60 * 60_000),
    consumePersistentRateLimit(prisma, `register-ip:${context?.clientIp ?? 'unknown'}`, secret(), 15, 60 * 60_000),
  ]);
  if (!byEmail || !byIp) return 'accepted';
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] }, select: { id: true } });
  if (exists) return 'accepted';
  const user = await prisma.user.create({ data: { email, username, passwordHash: await hashPassword(password) } });
  await issueActionToken(user.id, 'VERIFY_EMAIL', email, input.locale);
  return 'accepted';
}

export async function requestEmailVerification(emailValue: unknown, locale: 'vi' | 'en'): Promise<void> {
  const email = normalizeEmail(emailValue);
  const limitSecret = secret();
  if (!email || !limitSecret) return;

  const clientIp = (await import('../lib/request-context')).getAuthRequestContext()?.clientIp ?? 'unknown';
  const [allowedEmail, allowedIp] = await Promise.all([
    consumePersistentRateLimit(prisma, `resend-verification:${email}`, limitSecret, 5, 60 * 60_000),
    consumePersistentRateLimit(prisma, `resend-verification-ip:${clientIp}`, limitSecret, 15, 60 * 60_000),
  ]);
  if (!allowedEmail || !allowedIp) return;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, passwordHash: true },
  });
  if (!user?.passwordHash || user.emailVerified) return;

  try {
    await issueActionToken(user.id, 'VERIFY_EMAIL', email, locale);
  } catch (error) {
    if (error instanceof Error && (/^GMAIL_/.test(error.message) || error.message === 'EMAIL_APP_URL_NOT_CONFIGURED')) {
      // Keep the public response generic; logs contain only a fixed provider error code.
      console.error('Verification email delivery failed:', error.message);
      return;
    }
    throw error;
  }
}

export async function consumeAccountToken(rawToken: string, purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD', password?: string): Promise<boolean> {
  if (!rawToken || rawToken.length > 128) return false;
  const limitSecret = secret();
  if (!limitSecret) return false;
  const clientIp = (await import('../lib/request-context')).getAuthRequestContext()?.clientIp ?? 'unknown';
  const [allowedToken, allowedIp] = await Promise.all([
    consumePersistentRateLimit(prisma, `consume-token:${tokenDigest(rawToken)}`, limitSecret, 10, TOKEN_TTL_MS),
    consumePersistentRateLimit(prisma, `consume-token-ip:${clientIp}`, limitSecret, 30, TOKEN_TTL_MS),
  ]);
  if (!allowedToken || !allowedIp) return false;
  const entry = await prisma.accountToken.findUnique({ where: { tokenHash: tokenDigest(rawToken) }, include: { user: true } });
  if (!entry || entry.purpose !== purpose || entry.consumedAt || entry.expiresAt <= new Date()) return false;
  if (purpose === 'RESET_PASSWORD' && (!password || !validatePassword(password))) return false;
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const used = await tx.accountToken.updateMany({ where: { id: entry.id, consumedAt: null, expiresAt: { gt: now } }, data: { consumedAt: now } });
    if (used.count !== 1) return false;
    if (purpose === 'VERIFY_EMAIL') await tx.user.update({ where: { id: entry.userId }, data: { email: entry.email ?? entry.user.email, emailVerified: now } });
    else {
      await tx.user.update({ where: { id: entry.userId }, data: { passwordHash: await hashPassword(password!) } });
      await tx.session.deleteMany({ where: { userId: entry.userId } });
    }
    return true;
  });
}

export async function requestAdditionalEmailVerification(userId: string, emailValue: unknown, locale: 'vi' | 'en'): Promise<boolean> {
  const email = normalizeEmail(emailValue);
  if (!email || !secret()) return false;
  const context = (await import('../lib/request-context')).getAuthRequestContext();
  const [allowedEmail, allowedIp] = await Promise.all([
    consumePersistentRateLimit(prisma, `verify-email:${email}`, secret(), 5, 60 * 60_000),
    consumePersistentRateLimit(prisma, `verify-email-ip:${context?.clientIp ?? 'unknown'}`, secret(), 15, 60 * 60_000),
  ]);
  if (!allowedEmail || !allowedIp) return false;
  const [user, owner] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
  ]);
  if (!user || user.email || (owner && owner.id !== userId)) return false;
  await issueActionToken(userId, 'VERIFY_EMAIL', email, locale, email);
  return true;
}

export async function requestPasswordReset(emailValue: unknown, locale: 'vi' | 'en'): Promise<void> {
  const email = normalizeEmail(emailValue);
  if (!email || !secret()) return;
  const allowed = await consumePersistentRateLimit(prisma, `reset:${email}`, secret(), 5, 60 * 60_000);
  if (!allowed) return;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.passwordHash) await issueActionToken(user.id, 'RESET_PASSWORD', email, locale);
}

export async function createJwtSession(userId: string, now = new Date()): Promise<string> {
  const sessionToken = randomBytes(32).toString('base64url');
  await prisma.session.create({ data: { sessionToken, userId, createdAt: now, lastActivityAt: now, expires: new Date(now.getTime() + SESSION_INACTIVITY_MS), absoluteExpiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS) } });
  return sessionToken;
}

export async function touchJwtSession(sessionToken: string): Promise<string | null> {
  const now = new Date();
  const result = await prisma.session.updateMany({ where: { sessionToken, expires: { gt: now }, absoluteExpiresAt: { gt: now }, lastActivityAt: { gt: new Date(now.getTime() - SESSION_INACTIVITY_MS) } }, data: { lastActivityAt: now, expires: new Date(Math.min(now.getTime() + SESSION_INACTIVITY_MS, now.getTime() + SESSION_ABSOLUTE_MS)) } });
  return result.count === 1 ? sessionToken : null;
}
