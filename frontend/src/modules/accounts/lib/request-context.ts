import { AsyncLocalStorage } from 'node:async_hooks';
import { isIP } from 'node:net';

export interface AuthRequestContext {
  clientIp: string;
  locale: 'vi' | 'en';
}

const storage = new AsyncLocalStorage<AuthRequestContext>();

export function getAuthRequestContext(): AuthRequestContext | undefined {
  return storage.getStore();
}

export function runWithAuthRequestContext<T>(
  context: AuthRequestContext,
  operation: () => T,
): T {
  return storage.run(context, operation);
}

export function createAuthRequestContext(headers: Headers): AuthRequestContext {
  const candidates = [
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for')?.split(',')[0],
  ];
  const clientIp = candidates
    .map((candidate) => candidate?.trim())
    .find((candidate): candidate is string => Boolean(candidate && isIP(candidate))) ?? 'unknown';

  let locale: 'vi' | 'en' = 'vi';
  const referer = headers.get('referer');
  if (referer) {
    try {
      locale = new URL(referer).pathname.split('/')[1] === 'en' ? 'en' : 'vi';
    } catch {
      locale = 'vi';
    }
  }

  return { clientIp, locale };
}
