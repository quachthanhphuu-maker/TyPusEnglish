import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from 'next-auth/adapters';
import {
  getCappedSessionExpiry,
  getSessionDates,
  getSessionExpiryReason,
  SESSION_INACTIVITY_MS,
  type SessionLifetime,
} from './session-policy';

type StoredSession = AdapterSession & SessionLifetime;

export interface SessionLifecycleStore {
  create(input: {
    sessionToken: string;
    userId: string;
    createdAt: Date;
    lastActivityAt: Date;
    expires: Date;
    absoluteExpiresAt: Date;
  }): Promise<StoredSession>;
  getWithUser(
    sessionToken: string,
  ): Promise<{ session: StoredSession; user: AdapterUser } | null>;
  touch(
    sessionToken: string,
    activityAt: Date,
    expires: Date,
  ): Promise<StoredSession | null>;
  remove(sessionToken: string): Promise<void>;
  update(sessionToken: string, expires: Date): Promise<AdapterSession | null>;
}

export function withSessionLifecycle(
  adapter: Adapter,
  store: SessionLifecycleStore,
  clock: () => Date = () => new Date(),
): Adapter {
  return {
    ...adapter,
    async createSession({ sessionToken, userId }) {
      return store.create({
        sessionToken,
        userId,
        ...getSessionDates(clock()),
      });
    },
    async getSessionAndUser(sessionToken) {
      const record = await store.getWithUser(sessionToken);
      if (!record) return null;

      const now = clock();
      if (getSessionExpiryReason(record.session, now)) {
        await store.remove(sessionToken);
        return null;
      }

      const updatedSession = await store.touch(
        sessionToken,
        now,
        getCappedSessionExpiry(
          record.session.createdAt,
          new Date(now.getTime() + SESSION_INACTIVITY_MS),
        ),
      );
      if (!updatedSession) return null;

      return {
        session: updatedSession,
        user: record.user,
      };
    },
    async updateSession(session) {
      const record = await store.getWithUser(session.sessionToken);
      if (!record) return null;

      if (getSessionExpiryReason(record.session, clock())) {
        await store.remove(session.sessionToken);
        return null;
      }

      const expires = session.expires
        ? getCappedSessionExpiry(record.session.createdAt, session.expires)
        : record.session.expires;
      return store.update(session.sessionToken, expires);
    },
    async deleteSession(sessionToken) {
      await store.remove(sessionToken);
    },
  };
}
