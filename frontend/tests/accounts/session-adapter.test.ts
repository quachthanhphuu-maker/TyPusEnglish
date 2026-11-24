import type { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters';
import { describe, expect, it } from 'vitest';
import { withSessionLifecycle, type SessionLifecycleStore } from '../../src/modules/accounts/lib/session-adapter';
import { getSessionDates } from '../../src/modules/accounts/lib/session-policy';

const epoch = new Date('2026-11-24T00:00:00.000Z');
const user: AdapterUser = {
  id: 'user_1',
  email: 'tutor@example.com',
  emailVerified: epoch,
  name: 'Tutor',
};

function createHarness(start = epoch) {
  let now = start;
  const dates = getSessionDates(start);
  const session = {
    sessionToken: 'secret-session-token',
    userId: user.id,
    ...dates,
  };
  let deleted = false;
  let touchedAt: Date | null = null;
  let savedExpiry = session.expires;

  const store: SessionLifecycleStore = {
    async create(input) {
      return { ...input } as AdapterSession & typeof dates;
    },
    async getWithUser() {
      return deleted ? null : { session: { ...session, expires: savedExpiry }, user };
    },
    async touch(_token, activityAt, expires) {
      if (deleted) return null;
      touchedAt = activityAt;
      savedExpiry = expires;
      session.lastActivityAt = activityAt;
      session.expires = expires;
      return { ...session };
    },
    async remove() {
      deleted = true;
    },
    async update(_token, expires) {
      savedExpiry = expires;
      return { ...session, expires } as AdapterSession;
    },
  };

  const adapter = withSessionLifecycle({} as Adapter, store, () => now);
  return {
    adapter,
    store,
    setNow(value: Date) {
      now = value;
    },
    getDeleted: () => deleted,
    getTouchedAt: () => touchedAt,
    getSavedExpiry: () => savedExpiry,
  };
}

describe('Auth.js database adapter session lifecycle', () => {
  it('stores rolling and absolute deadlines when creating a session', async () => {
    const harness = createHarness();
    const created = await harness.adapter.createSession?.({
      sessionToken: 'new-token',
      userId: user.id,
      expires: new Date(epoch.getTime() + 60_000),
    });
    const expected = getSessionDates(epoch);
    expect(created).toMatchObject(expected);
  });

  it('touches activity for valid sessions', async () => {
    const harness = createHarness();
    harness.setNow(new Date(epoch.getTime() + 60_000));
    const result = await harness.adapter.getSessionAndUser?.('secret-session-token');
    expect(result?.session).not.toBeNull();
    expect(harness.getTouchedAt()).toEqual(new Date(epoch.getTime() + 60_000));
    expect(harness.getSavedExpiry()).toEqual(
      new Date(epoch.getTime() + 60_000 + 7 * 24 * 60 * 60 * 1000),
    );
  });

  it('revokes inactive and absolutely expired sessions', async () => {
    const inactive = createHarness();
    inactive.setNow(new Date(epoch.getTime() + 7 * 24 * 60 * 60 * 1000));
    expect(await inactive.adapter.getSessionAndUser?.('secret-session-token')).toBeNull();
    expect(inactive.getDeleted()).toBe(true);

    const absolute = createHarness();
    absolute.setNow(new Date(epoch.getTime() + 30 * 24 * 60 * 60 * 1000));
    expect(await absolute.adapter.getSessionAndUser?.('secret-session-token')).toBeNull();
    expect(absolute.getDeleted()).toBe(true);
  });

  it('caps Auth.js rolling session updates at the absolute lifetime', async () => {
    const harness = createHarness();
    const proposed = new Date(epoch.getTime() + 40 * 24 * 60 * 60 * 1000);
    await harness.adapter.updateSession?.({
      sessionToken: 'secret-session-token',
      expires: proposed,
    });
    expect(harness.getSavedExpiry()).toEqual(
      new Date(epoch.getTime() + 30 * 24 * 60 * 60 * 1000),
    );
  });
});
