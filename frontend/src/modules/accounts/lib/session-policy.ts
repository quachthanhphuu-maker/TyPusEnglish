export const SESSION_INACTIVITY_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_REFRESH_INTERVAL_SECONDS = 60 * 60;
export const MAGIC_LINK_TTL_SECONDS = 15 * 60;

export interface SessionLifetime {
  createdAt: Date;
  lastActivityAt: Date;
  expires: Date;
  absoluteExpiresAt: Date;
}

export type SessionExpiryReason = 'inactive' | 'absolute' | 'rolling';

export function getSessionExpiryReason(
  session: SessionLifetime,
  now: Date,
): SessionExpiryReason | null {
  if (session.absoluteExpiresAt.getTime() <= now.getTime()) return 'absolute';
  if (session.lastActivityAt.getTime() + SESSION_INACTIVITY_MS <= now.getTime()) {
    return 'inactive';
  }
  if (session.expires.getTime() <= now.getTime()) return 'rolling';

  return null;
}

export function getSessionDates(now: Date) {
  return {
    createdAt: now,
    lastActivityAt: now,
    expires: new Date(now.getTime() + SESSION_INACTIVITY_MS),
    absoluteExpiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS),
  };
}

export function getCappedSessionExpiry(createdAt: Date, proposedExpiry: Date): Date {
  const absoluteExpiry = new Date(createdAt.getTime() + SESSION_ABSOLUTE_MS);
  return proposedExpiry.getTime() < absoluteExpiry.getTime()
    ? proposedExpiry
    : absoluteExpiry;
}
