import { describe, expect, it } from 'vitest';
import {
  MAGIC_LINK_TTL_SECONDS,
  getCappedSessionExpiry,
  getSessionDates,
  getSessionExpiryReason,
  SESSION_ABSOLUTE_MS,
  SESSION_INACTIVITY_MS,
  SESSION_REFRESH_INTERVAL_SECONDS,
} from '../../src/modules/accounts/lib/session-policy';

const now = new Date('2026-11-24T00:00:00.000Z');

describe('database session lifetime policy', () => {
  it('uses the documented magic-link and database-session time limits', () => {
    expect(MAGIC_LINK_TTL_SECONDS).toBe(15 * 60);
    expect(SESSION_INACTIVITY_MS / 1000).toBe(7 * 24 * 60 * 60);
    expect(SESSION_ABSOLUTE_MS / 1000).toBe(30 * 24 * 60 * 60);
  });

  it('refreshes browser sessions hourly while the user remains active', () => {
    expect(SESSION_REFRESH_INTERVAL_SECONDS).toBe(60 * 60);
  });

  it('sets seven-day inactivity and thirty-day absolute deadlines', () => {
    expect(getSessionDates(now)).toEqual({
      createdAt: now,
      lastActivityAt: now,
      expires: new Date(now.getTime() + SESSION_INACTIVITY_MS),
      absoluteExpiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS),
    });
  });

  it('expires at the seven-day inactivity boundary', () => {
    const session = getSessionDates(now);
    expect(
      getSessionExpiryReason(
        session,
        new Date(now.getTime() + SESSION_INACTIVITY_MS),
      ),
    ).toBe('inactive');
  });

  it('expires at the thirty-day absolute boundary despite recent activity', () => {
    const session = {
      ...getSessionDates(now),
      lastActivityAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS - 1),
    };
    expect(
      getSessionExpiryReason(
        session,
        new Date(now.getTime() + SESSION_ABSOLUTE_MS),
      ),
    ).toBe('absolute');
  });

  it('caps rolling renewal at the absolute deadline', () => {
    const capped = getCappedSessionExpiry(
      now,
      new Date(now.getTime() + SESSION_INACTIVITY_MS),
    );
    expect(capped).toEqual(new Date(now.getTime() + SESSION_INACTIVITY_MS));
    expect(
      getCappedSessionExpiry(now, new Date(now.getTime() + SESSION_ABSOLUTE_MS * 2)),
    ).toEqual(new Date(now.getTime() + SESSION_ABSOLUTE_MS));
  });
});
