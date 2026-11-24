import 'server-only';

import type { Prisma, AccountRole as DatabaseRole } from '@prisma/client';
import type { UserDTO, UserRole } from '../contracts/auth-contract';
import { isSelfServiceRole, toUserDTO } from '../contracts/auth-contract';
import { prisma } from '@/lib/db/prisma';
import { can } from '../lib/authorization';

const toDatabaseRole: Record<UserRole, DatabaseRole> = {
  tutor: 'TUTOR',
  student: 'STUDENT',
  parent: 'PARENT',
  independent_learner: 'INDEPENDENT_LEARNER',
};

export type InvitationRole = 'STUDENT' | 'PARENT';

export async function getAccountUser(userId: string): Promise<UserDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true, preference: true },
  });
  return user ? toUserDTO(user) : null;
}

export async function grantSelfServiceRole(
  actor: UserDTO,
  role: UserRole,
): Promise<UserDTO> {
  if (
    !isSelfServiceRole(role) ||
    !can(actor, 'role:acquire:self-service', { ownerId: actor.id, role })
  ) {
    throw new Error('FORBIDDEN');
  }
  const userId = actor.id;
  const databaseRole = toDatabaseRole[role];

  await prisma.$transaction(async (tx) => {
    await tx.userRole.upsert({
      where: { userId_role: { userId, role: databaseRole } },
      create: { userId, role: databaseRole },
      update: {},
    });
    await tx.user.update({
      where: { id: userId },
      data: { onboardingStatus: 'COMPLETE' },
    });
    await tx.userPreference.upsert({
      where: { userId },
      create: { userId, activeWorkspaceRole: databaseRole },
      update: { activeWorkspaceRole: databaseRole },
    });
  });

  const user = await getAccountUser(userId);
  if (!user) throw new Error('ACCOUNT_NOT_FOUND');
  return user;
}

/**
 * Call from the Classes-owned invitation redemption transaction only, after it
 * validates the recipient and scope, links the existing profile/parent link,
 * and marks its own invitation redeemed.
 */
export async function grantVerifiedInvitationRole(
  tx: Prisma.TransactionClient,
  userId: string,
  role: InvitationRole,
): Promise<void> {
  const databaseRole: DatabaseRole = role;
  await tx.userRole.upsert({
    where: { userId_role: { userId, role: databaseRole } },
    create: { userId, role: databaseRole },
    update: {},
  });
  await tx.user.update({
    where: { id: userId },
    data: { onboardingStatus: 'COMPLETE' },
  });
}

export async function selectAuthorizedWorkspace(
  userId: string,
  role: UserRole,
): Promise<boolean> {
  const roleRecord = await prisma.userRole.findUnique({
    where: { userId_role: { userId, role: toDatabaseRole[role] } },
    select: { id: true },
  });
  if (!roleRecord) return false;

  await prisma.userPreference.upsert({
    where: { userId },
    create: { userId, activeWorkspaceRole: toDatabaseRole[role] },
    update: { activeWorkspaceRole: toDatabaseRole[role] },
  });
  return true;
}
