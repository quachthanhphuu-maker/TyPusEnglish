export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): boolean {
  const normalized = normalizeUsername(username);
  return (
    normalized.length >= USERNAME_MIN_LENGTH &&
    normalized.length <= USERNAME_MAX_LENGTH &&
    /^[a-z0-9][a-z0-9._-]*$/.test(normalized)
  );
}

export function validatePassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}
import { normalizeEmail } from './email';


export function resolveLoginIdentifier(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = normalizeUsername(value);
  if (validateUsername(normalized)) return normalized;
  return normalizeEmail(value);
}
