'use server';

import { redirect } from 'next/navigation';
import { logoutCurrentSession } from './auth';
import type { UserRole } from './contracts/auth-contract';
import { getRoleLandingPath } from './contracts/auth-contract';
import { getAuthStatus } from './auth';
import { grantSelfServiceRole, selectAuthorizedWorkspace } from './services/account-service';
import { registerCredentials, consumeAccountToken, requestPasswordReset, requestAdditionalEmailVerification } from './services/credential-service';
import { prisma } from '@/lib/db/prisma';
import { canRemoveAuthMethod } from './contracts/auth-contract';

type Locale = 'vi' | 'en';

export async function registerCredentialsAction(formData: FormData): Promise<'accepted' | 'invalid'> {
  const locale = getLocale(formData.get('locale'));
  return registerCredentials({
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
    locale,
  });
}

export async function verifyEmailAction(token: string): Promise<boolean> {
  return consumeAccountToken(token, 'VERIFY_EMAIL');
}

export async function resetPasswordAction(token: string, password: string): Promise<boolean> {
  return consumeAccountToken(token, 'RESET_PASSWORD', password);
}

export async function requestPasswordResetAction(formData: FormData): Promise<void> {
  await requestPasswordReset(formData.get('email'), getLocale(formData.get('locale')));
}

export async function unlinkOAuthAction(providerValue: string): Promise<boolean> {
  if (providerValue !== 'google' && providerValue !== 'zalo') return false;
  const status = await getAuthStatus();
  if (status.status !== 'authenticated') return false;
  try {
    return await prisma.$transaction(async (tx) => {
      const profile = await tx.user.findUnique({
        where: { id: status.session.user.id },
        select: { passwordHash: true, accounts: { select: { provider: true } } },
      });
      if (!profile) return false;
      const methods = [
        ...(profile.passwordHash ? ['password' as const] : []),
        ...profile.accounts
          .map(({ provider }) => provider)
          .filter((method): method is 'google' | 'zalo' => method === 'google' || method === 'zalo'),
      ];
      if (!canRemoveAuthMethod(methods, providerValue)) return false;
      const removed = await tx.account.deleteMany({ where: { userId: status.session.user.id, provider: providerValue } });
      if (removed.count !== 1) return false;
      await tx.session.deleteMany({ where: { userId: status.session.user.id } });
      return true;
    }, { isolationLevel: 'Serializable' });
  } catch {
    // A concurrent unlink can invalidate the serializable transaction; fail closed.
    return false;
  }
}

export async function addVerifiedEmailAction(email: string, localeValue: string): Promise<boolean> {
  const status = await getAuthStatus();
  if (status.status !== 'authenticated') return false;
  return requestAdditionalEmailVerification(status.session.user.id, email, localeValue === 'en' ? 'en' : 'vi');
}

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
