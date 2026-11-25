import type { UserDTO, UserRole } from '../contracts/auth-contract';
import { isSelfServiceRole } from '../contracts/auth-contract';

export interface AccountResource {
  ownerId?: string;
  role?: string;
}

export function can(
  actor: UserDTO | null | undefined,
  action: string,
  resource: AccountResource,
): boolean {
  if (!actor) return false;

  if (action === 'account:read:self' || action === 'account:update:self') {
    return resource.ownerId === actor.id;
  }

  if (action === 'workspace:select') {
    return isUserRole(resource.role) && actor.roles.includes(resource.role);
  }

  if (action === 'role:acquire:self-service') {
    return (
      resource.ownerId === actor.id &&
      isUserRole(resource.role) &&
      isSelfServiceRole(resource.role)
    );
  }

  return false;
}

function isUserRole(value: string | undefined): value is UserRole {
  return (
    value === 'tutor' ||
    value === 'student' ||
    value === 'parent' ||
    value === 'independent_learner'
  );
}
