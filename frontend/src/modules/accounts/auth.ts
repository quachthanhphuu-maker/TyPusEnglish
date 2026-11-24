import 'server-only';

import { createTransport } from 'nodemailer';
import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider, { type SendVerificationRequestParams } from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import { type AuthStatus, type UserRole, getRoleLandingPath, toUserDTO } from './contracts/auth-contract';
import { normalizeEmail } from './lib/email';
import { getSafeReturnTo } from './lib/redirect';
import { consumePersistentRateLimit } from './lib/rate-limit';
import { getAuthRequestContext } from './lib/request-context';
import { prismaSessionStore } from './lib/prisma-session-store';
import { withSessionLifecycle } from './lib/session-adapter';
import {
  MAGIC_LINK_TTL_SECONDS,
  SESSION_INACTIVITY_MS,
  SESSION_REFRESH_INTERVAL_SECONDS,
} from './lib/session-policy';

const fifteenMinutes = MAGIC_LINK_TTL_SECONDS * 1000;
const secureCookies = process.env.NODE_ENV === 'production';
export const authSessionCookieName = `${secureCookies ? '__Secure-' : ''}next-auth.session-token`;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

async function sendMagicLink({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams) {
  const email = normalizeEmail(identifier);
  const secret = process.env.AUTH_SECRET;
  if (!email || !secret) throw new Error('Authentication is not configured');
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.AUTH_EMAIL_SERVER || !process.env.AUTH_EMAIL_FROM)
  ) {
    throw new Error('Email delivery is not configured');
  }

  const windowMs = fifteenMinutes;
  const allowedByEmail = await consumePersistentRateLimit(
    prisma,
    `email:${email}`,
    secret,
    5,
    windowMs,
  );
  const allowedByIp = allowedByEmail
    ? await consumePersistentRateLimit(
        prisma,
        `ip:${getAuthRequestContext()?.clientIp ?? 'unknown'}`,
        secret,
        20,
        windowMs,
      )
    : false;

  // A blocked request has the same externally visible result as a sent link.
  if (!allowedByEmail || !allowedByIp) return;
  if (!provider.server) throw new Error('Email delivery is not configured');

  const locale = getAuthRequestContext()?.locale ?? 'vi';
  const host = new URL(url).host;
  const safeUrl = escapeHtml(url);
  const transport = createTransport(provider.server);
  await transport.sendMail({
    to: email,
    from: provider.from,
    subject:
      locale === 'vi'
        ? 'Liên kết đăng nhập TyPusEnglish'
        : 'Your TyPusEnglish sign-in link',
    text:
      locale === 'vi'
        ? `Mở liên kết này để đăng nhập: ${url}\nLiên kết hết hạn sau 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.`
        : `Open this link to sign in: ${url}\nThis link expires in 15 minutes. Ignore this email if you did not request it.`,
    html:
      locale === 'vi'
        ? `<p>Đăng nhập TyPusEnglish tại <a href="${safeUrl}">${host}</a>.</p><p>Liên kết hết hạn sau 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`
        : `<p>Sign in to TyPusEnglish at <a href="${safeUrl}">${host}</a>.</p><p>This link expires in 15 minutes. Ignore this email if you did not request it.</p>`,
  });
}

const adapter = withSessionLifecycle(PrismaAdapter(prisma), prismaSessionStore);

export const authOptions: NextAuthOptions = {
  adapter,
  secret: process.env.AUTH_SECRET,
  useSecureCookies: secureCookies,
  session: {
    strategy: 'database',
    maxAge: SESSION_INACTIVITY_MS / 1000,
    updateAge: SESSION_REFRESH_INTERVAL_SECONDS,
  },
  cookies: {
    sessionToken: {
      name: authSessionCookieName,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: secureCookies,
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers: [
    EmailProvider({
      server: process.env.AUTH_EMAIL_SERVER ?? 'smtp://127.0.0.1:1025',
      from: process.env.AUTH_EMAIL_FROM ?? 'TyPusEnglish <no-reply@example.test>',
      maxAge: MAGIC_LINK_TTL_SECONDS,
      normalizeIdentifier(identifier) {
        const email = normalizeEmail(identifier);
        if (!email) throw new Error('Invalid email address');
        return email;
      },
      sendVerificationRequest: sendMagicLink,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        include: { roles: true, preference: true },
      });
      if (!profile) return session;
      return { ...session, user: toUserDTO(profile) };
    },
    async redirect({ url, baseUrl }) {
      const base = new URL(baseUrl);
      const destination = new URL(url, baseUrl);
      if (destination.origin !== base.origin) return baseUrl;
      if (destination.pathname === '/login' || destination.pathname === '/auth/error') {
        return destination.toString();
      }
      const locale = destination.pathname.split('/')[1] === 'en' ? 'en' : 'vi';
      const safePath = getSafeReturnTo(
        `${destination.pathname}${destination.search}${destination.hash}`,
        locale,
      );
      return safePath ? new URL(safePath, baseUrl).toString() : `${baseUrl}/${locale}`;
    },
  },
};

export async function getAuthStatus(): Promise<AuthStatus> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return { status: 'unauthenticated' };
  return {
    status: 'authenticated',
    session: { user: session.user, expiresAt: session.expires },
  };
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function logoutCurrentSession(): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  const token = cookieStore.get(authSessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { sessionToken: token } });
  }
  cookieStore.delete(authSessionCookieName);
}

export function getDestinationForUser(
  user: { roles: UserRole[]; onboardingStatus: 'NOT_STARTED' | 'COMPLETE'; activeWorkspace: UserRole | null },
  locale: 'vi' | 'en',
): string {
  return getRoleLandingPath(
    user.roles,
    user.onboardingStatus,
    user.activeWorkspace,
    locale,
  );
}
