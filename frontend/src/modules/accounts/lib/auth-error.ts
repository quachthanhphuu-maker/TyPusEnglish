import type { AuthErrorCode } from '../contracts/auth-contract';

export function mapAuthJsError(value: string | null | undefined): AuthErrorCode {
  if (value === 'Verification') return 'LINK_INVALID';
  if (value === 'AccessDenied') return 'FORBIDDEN';
  if (value === 'SessionRequired') return 'UNAUTHENTICATED';
  return 'INTERNAL_ERROR';
}
