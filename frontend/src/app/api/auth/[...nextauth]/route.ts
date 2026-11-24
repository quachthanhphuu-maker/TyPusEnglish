import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authOptions } from '@/modules/accounts/auth';
import {
  createAuthRequestContext,
  runWithAuthRequestContext,
} from '@/modules/accounts/lib/request-context';

export const runtime = 'nodejs';

async function authHandler(
  request: NextRequest,
  context: { params: { nextauth: string[] } },
) {
  const requestContext = createAuthRequestContext(request.headers);
  return runWithAuthRequestContext(requestContext, () =>
    NextAuth(request, context, authOptions),
  );
}

export { authHandler as GET, authHandler as POST };
