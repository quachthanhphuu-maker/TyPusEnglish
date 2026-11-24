import 'server-only';

import { getServerSession } from 'next-auth/next';
import { decode } from 'next-auth/jwt';
import type { NextAuthOptions } from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers/oauth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import { type AuthStatus, type UserRole, getRoleLandingPath, toUserDTO } from './contracts/auth-contract';
import { authenticateCredentials, createJwtSession, touchJwtSession } from './services/credential-service';
import { getSafeReturnTo } from './lib/redirect';
import { getAuthRequestContext } from './lib/request-context';
import { mapZaloProfile } from './lib/oauth-profile';

interface ZaloProfile extends Record<string, unknown> {
  id: string;
  name: string;
  picture?: { data?: { url?: string } };
}

function ZaloProvider(): OAuthConfig<ZaloProfile> {
  return {
    id: 'zalo', name: 'Zalo', type: 'oauth',
    clientId: process.env.ZALO_APP_ID ?? '', clientSecret: process.env.ZALO_APP_SECRET ?? '',
    authorization: { url: 'https://oauth.zaloapp.com/v4/permission', params: { response_type: 'code' } },
    token: {
      async request({ params, checks }) {
        const verifier = (checks as { pkce?: { code_verifier?: string } }).pkce?.code_verifier;
        const response = await fetch('https://oauth.zaloapp.com/v4/access_token', {
          method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', secret_key: process.env.ZALO_APP_SECRET ?? '' },
          body: new URLSearchParams({ app_id: process.env.ZALO_APP_ID ?? '', code: String(params.code ?? ''), grant_type: 'authorization_code', ...(verifier ? { code_verifier: verifier } : {}) }),
        });
        if (!response.ok) throw new Error('ZALO_TOKEN_EXCHANGE_FAILED');
        return { tokens: await response.json() };
      },
    },
    userinfo: {
      async request({ tokens }) {
        const response = await fetch('https://graph.zalo.me/v2.0/me?fields=id,name,picture', { headers: { access_token: String(tokens.access_token ?? '') } });
        if (!response.ok) throw new Error('ZALO_PROFILE_FAILED');
        return await response.json() as ZaloProfile;
      },
    },
    checks: ['state', 'pkce'],
    profile: mapZaloProfile,
  };
}

const secureCookies = process.env.NODE_ENV === 'production';
export const authSessionCookieName = `${secureCookies ? '__Secure-' : ''}next-auth.session-token`;
const baseAdapter = PrismaAdapter(prisma);
const adapter = {
  ...baseAdapter,
  async linkAccount(account: { userId: string; provider: string; providerAccountId: string; type: string }) {
    // No provider access or refresh tokens are needed after profile retrieval.
    return prisma.account.create({ data: { userId: account.userId, provider: account.provider, providerAccountId: account.providerAccountId, type: account.type } });
  },
};

export const authOptions: NextAuthOptions = {
  adapter,
  secret: process.env.AUTH_SECRET,
  useSecureCookies: secureCookies,
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  jwt: { maxAge: 7 * 24 * 60 * 60 },
  cookies: { sessionToken: { name: authSessionCookieName, options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies } } },
  pages: { signIn: '/login', error: '/auth/error' },
  providers: [
    CredentialsProvider({
      name: 'Username and password',
      credentials: { identifier: { label: 'Email or username', type: 'text' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) { return authenticateCredentials(credentials?.identifier, credentials?.password); },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, checks: ['pkce', 'state'], allowDangerousEmailAccountLinking: false })] : []),
    ...(process.env.ZALO_APP_ID && process.env.ZALO_APP_SECRET ? [ZaloProvider()] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.id) return false;
      // Never auto-link identities by a matching email address.
      if (account.provider === 'google' && account.type === 'oauth') {
        const existing = await prisma.account.findUnique({ where: { provider_providerAccountId: { provider: 'google', providerAccountId: account.providerAccountId } }, select: { userId: true } });
        if (existing && existing.userId !== user.id) return false;
      }
      if (account.provider === 'zalo') {
        const existing = await prisma.account.findUnique({ where: { provider_providerAccountId: { provider: 'zalo', providerAccountId: account.providerAccountId } }, select: { userId: true } });
        if (existing && existing.userId !== user.id) return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      const mutable = token as typeof token & { sid?: string };
      if (user?.id) {
        if (mutable.sid) await prisma.session.deleteMany({ where: { sessionToken: mutable.sid } });
        mutable.sub = user.id;
        mutable.sid = await createJwtSession(user.id);
      } else if (mutable.sid) {
        if (!(await touchJwtSession(mutable.sid))) return {};
      } else {
        return {};
      }
      return mutable;
    },
    async session({ session, token }) {
      if (!token.sub) return { ...session, user: undefined };
      const profile = await prisma.user.findUnique({ where: { id: token.sub }, include: { roles: true, preference: true, accounts: { select: { provider: true } } } });
      if (!profile) return { ...session, user: undefined };
      return { ...session, user: toUserDTO(profile) };
    },
    async redirect({ url, baseUrl }) {
      const base = new URL(baseUrl);
      const destination = new URL(url, baseUrl);
      if (destination.origin !== base.origin) return baseUrl;
      if (destination.pathname === '/login' || destination.pathname === '/auth/error') return destination.toString();
      const locale = destination.pathname.split('/')[1] === 'en' ? 'en' : 'vi';
      const safePath = getSafeReturnTo(`${destination.pathname}${destination.search}${destination.hash}`, locale);
      return safePath ? new URL(safePath, baseUrl).toString() : `${baseUrl}/${locale}`;
    },
  },
  events: {
    async signOut(message) {
      const token = 'token' in message ? message.token as ({ sid?: string } | null) : null;
      if (token?.sid) await prisma.session.deleteMany({ where: { sessionToken: token.sid } });
    },
  },
};

export async function getAuthStatus(): Promise<AuthStatus> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { status: 'unauthenticated' };
  return { status: 'authenticated', session: { user: session.user, expiresAt: session.expires } };
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function logoutCurrentSession(): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  const token = cookieStore.get(authSessionCookieName)?.value;
  if (token) {
    // The cookie is an encrypted Auth.js JWT. The server-side sid is revoked by the Auth.js signOut event.
    cookieStore.delete(authSessionCookieName);
  }
  const decoded = token && process.env.AUTH_SECRET
    ? await decode({ token, secret: process.env.AUTH_SECRET }) as ({ sid?: string } | null)
    : null;
  if (decoded?.sid) await prisma.session.deleteMany({ where: { sessionToken: decoded.sid } });
}

export function getDestinationForUser(user: { roles: UserRole[]; onboardingStatus: 'NOT_STARTED' | 'COMPLETE'; activeWorkspace: UserRole | null }, locale: 'vi' | 'en'): string {
  return getRoleLandingPath(user.roles, user.onboardingStatus, user.activeWorkspace, locale);
}
