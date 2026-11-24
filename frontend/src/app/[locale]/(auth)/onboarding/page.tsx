import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { completeOnboardingAction } from '@/modules/accounts/actions';
import { getRoleLandingPath } from '@/modules/accounts/contracts/auth-contract';
import { getAuthStatus } from '@/modules/accounts/auth';

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { error?: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('auth');
  const status = await getAuthStatus();
  if (status.status === 'unauthenticated') redirect(`/${locale}/login`);
  if (status.session.user.roles.length > 0) {
    redirect(
      getRoleLandingPath(
        status.session.user.roles,
        status.session.user.onboardingStatus,
        status.session.user.activeWorkspace,
        locale,
      ),
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('onboardingTitle')}</CardTitle>
          <CardDescription>{t('onboardingDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {searchParams.error === 'FORBIDDEN' && (
            <p className="text-sm text-destructive" role="alert">
              {t('errors.forbidden')}
            </p>
          )}
          {(['tutor', 'independent_learner'] as const).map((role) => (
            <form action={completeOnboardingAction} key={role}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="role" value={role} />
              <Button className="w-full" type="submit" variant="outline">
                {t(`registerRoles.${role}`)}
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
