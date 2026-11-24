import 'server-only';

import type { AdapterSession, AdapterUser } from 'next-auth/adapters';
import { prisma } from '@/lib/db/prisma';
import type { SessionLifecycleStore } from './session-adapter';
import { SESSION_INACTIVITY_MS, type SessionLifetime } from './session-policy';

type StoredSession = AdapterSession & SessionLifetime;

export const prismaSessionStore: SessionLifecycleStore = {
  async create(input) {
    return (await prisma.session.create({ data: input })) as StoredSession;
  },

  async getWithUser(sessionToken) {
    const record = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!record) return null;

    const { user, ...session } = record;
    return { session: session as StoredSession, user: user as AdapterUser };
  },

  async touch(sessionToken, activityAt, expires) {
    const result = await prisma.session.updateMany({
      where: {
        sessionToken,
        expires: { gt: activityAt },
        absoluteExpiresAt: { gt: activityAt },
        lastActivityAt: {
          gt: new Date(activityAt.getTime() - SESSION_INACTIVITY_MS),
        },
      },
      data: { lastActivityAt: activityAt, expires },
    });
    if (result.count !== 1) return null;
    return prisma.session.findUnique({ where: { sessionToken } });
  },

  async remove(sessionToken) {
    await prisma.session.deleteMany({ where: { sessionToken } });
  },

  async update(sessionToken, expires) {
    const result = await prisma.session.updateMany({
      where: { sessionToken },
      data: { expires },
    });
    if (result.count !== 1) return null;
    return prisma.session.findUnique({ where: { sessionToken } });
  },
};
