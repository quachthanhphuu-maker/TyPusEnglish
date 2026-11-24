'use server';

import { redirect } from 'next/navigation';
import { logoutCurrentSession } from './auth';
import type { UserRole } from './contracts/auth-contract';
import { getRoleLandingPath } from './contracts/auth-contract';
import { getAuthStatus } from './auth';
import { grantSelfServiceRole, selectAuthorizedWorkspace } from './services/account-service';

type Locale = 'vi' | 'en';

function getLocale(value: FormDataEntryValue | null): Locale {
  return value === 'en' ? 'en' : 'vi';
}

function getRole(value: FormDataEntryValue | null): UserRole | null {
  if (
    value === 'tutor' ||
    value === 'student' ||
    value === 'parent' ||
    value === 'independent_learner'
  ) {
    return value;
  }
  return null;
}

export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const locale = getLocale(formData.get('locale'));
  const role = getRole(formData.get('role'));
  const result = await getAuthStatus();
  if (result.status === 'unauthenticated') {
    redirect(`/${locale}/login`);
  }
  if (!role || (role !== 'tutor' && role !== 'independent_learner')) {
    redirect(`/${locale}/onboarding?error=FORBIDDEN`);
  }

  const user = await grantSelfServiceRole(result.session.user, role);
  redirect(getRoleLandingPath(user.roles, user.onboardingStatus, user.activeWorkspace, locale));
}

export async function addWorkspaceAction(formData: FormData): Promise<void> {
  const locale = getLocale(formData.get('locale'));
  const role = getRole(formData.get('role'));
  const result = await getAuthStatus();
  if (result.status === 'unauthenticated') redirect(`/${locale}/login`);
  if (role !== 'tutor' && role !== 'independent_learner') {
    redirect(`/${locale}/workspace?error=FORBIDDEN`);
  }

  await grantSelfServiceRole(result.session.user, role);
  redirect(`/${locale}/workspace`);
}

export async function selectWorkspaceAction(formData: FormData): Promise<void> {
  const locale = getLocale(formData.get('locale'));
  const role = getRole(formData.get('role'));
  const result = await getAuthStatus();
  if (result.status === 'unauthenticated') redirect(`/${locale}/login`);
  if (!role) redirect(`/${locale}/workspace?error=FORBIDDEN`);

  const selected = await selectAuthorizedWorkspace(result.session.user.id, role);
  if (!selected) redirect(`/${locale}/workspace?error=FORBIDDEN`);
  redirect(getRoleLandingPath(result.session.user.roles, 'COMPLETE', role, locale));
}

export async function logoutAction(formData: FormData): Promise<void> {
  const locale = getLocale(formData.get('locale'));
  await logoutCurrentSession();
  redirect(`/${locale}/login`);
}
