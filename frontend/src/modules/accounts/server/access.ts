import 'server-only';

import { redirect } from 'next/navigation';
import type { UserRole } from '../contracts/auth-contract';
import { getRoleLandingPath } from '../contracts/auth-contract';
import { getAuthStatus } from '../auth';

const rolePaths: Record<UserRole, string> = {
  tutor: 'tutor',
  student: 'student',
  parent: 'parent',
  independent_learner: 'self-study',
};

export async function requireWorkspaceAccess(
  role: UserRole,
  locale: 'vi' | 'en',
) {
  const result = await getAuthStatus();
  if (result.status === 'unauthenticated') {
    const callbackUrl = encodeURIComponent(`/${locale}/${rolePaths[role]}`);
    redirect(`/${locale}/login?callbackUrl=${callbackUrl}`);
  }

  const user = result.session.user;
  if (!user.roles.includes(role)) {
    redirect(
      getRoleLandingPath(
        user.roles,
        user.onboardingStatus,
        user.activeWorkspace,
        locale,
      ),
    );
  }

  return user;
}
