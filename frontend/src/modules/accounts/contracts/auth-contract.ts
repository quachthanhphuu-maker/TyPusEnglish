export const USER_ROLES = [
  'tutor',
  'student',
  'parent',
  'independent_learner',
] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type OnboardingStatus = 'NOT_STARTED' | 'COMPLETE';

export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'RATE_LIMITED'
  | 'LINK_INVALID'
  | 'LINK_EXPIRED'
  | 'INVITATION_INVALID'
  | 'SESSION_EXPIRED'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR';

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  roles: UserRole[];
  onboardingStatus: OnboardingStatus;
  activeWorkspace: UserRole | null;
}

export interface SessionDTO {
  user: UserDTO;
  expiresAt: string;
}

export type AuthStatus =
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; session: SessionDTO };

export interface AuthProfileRecord {
  id: string;
  email: string | null;
  name: string | null;
  onboardingStatus: OnboardingStatus;
  roles: Array<{ role: string }>;
  preference?: { activeWorkspaceRole: string | null } | null;
}

const databaseRoleToPublicRole: Record<string, UserRole> = {
  TUTOR: 'tutor',
  STUDENT: 'student',
  PARENT: 'parent',
  INDEPENDENT_LEARNER: 'independent_learner',
};

const publicRoleToPath: Record<UserRole, string> = {
  tutor: 'tutor',
  student: 'student',
  parent: 'parent',
  independent_learner: 'self-study',
};

export function toUserDTO(profile: AuthProfileRecord): UserDTO {
  const roles = Array.from(new Set(
    profile.roles
      .map(({ role }) => databaseRoleToPublicRole[role])
      .filter((role): role is UserRole => role !== undefined),
  ));
  const preferredRole = profile.preference?.activeWorkspaceRole
    ? databaseRoleToPublicRole[profile.preference.activeWorkspaceRole] ?? null
    : null;

  return {
    id: profile.id,
    email: profile.email ?? '',
    name: profile.name,
    roles,
    onboardingStatus: profile.onboardingStatus,
    activeWorkspace: preferredRole && roles.includes(preferredRole) ? preferredRole : null,
  };
}

export function getRoleLandingPath(
  roles: UserRole[],
  onboardingStatus: OnboardingStatus,
  activeWorkspace: UserRole | null,
  locale: 'vi' | 'en',
): string {
  if (roles.length === 0 || onboardingStatus === 'NOT_STARTED') {
    return `/${locale}/onboarding`;
  }
  if (roles.length > 1) {
    if (!activeWorkspace || !roles.includes(activeWorkspace)) {
      return `/${locale}/workspace`;
    }
    return `/${locale}/${publicRoleToPath[activeWorkspace]}`;
  }

  return `/${locale}/${publicRoleToPath[roles[0]]}`;
}

export function isSelfServiceRole(role: UserRole): boolean {
  return role === 'tutor' || role === 'independent_learner';
}
