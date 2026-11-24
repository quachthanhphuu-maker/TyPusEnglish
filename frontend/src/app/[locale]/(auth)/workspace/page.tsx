import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addWorkspaceAction, logoutAction, selectWorkspaceAction } from '@/modules/accounts/actions';
import { getRoleLandingPath, type UserRole } from '@/modules/accounts/contracts/auth-contract';
import { getAuthStatus } from '@/modules/accounts/auth';

const selfServiceRoles: UserRole[] = ['tutor', 'independent_learner'];

export default async function WorkspacePage({
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

  const user = status.session.user;
  if (user.roles.length === 0) redirect(`/${locale}/onboarding`);
  if (user.roles.length === 1) {
    redirect(getRoleLandingPath(user.roles, user.onboardingStatus, null, locale));
  }

  const missingSelfServiceRoles = selfServiceRoles.filter((role) => !user.roles.includes(role));
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('workspaceTitle')}</CardTitle>
          <CardDescription>{t('workspaceDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {searchParams.error === 'FORBIDDEN' && (
            <p className="text-sm text-destructive" role="alert">
              {t('errors.forbidden')}
            </p>
          )}
          {user.roles.map((role) => (
            <form action={selectWorkspaceAction} key={role}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="role" value={role} />
              <Button className="w-full justify-start" type="submit" variant="outline">
                {t(`registerRoles.${role}`)}
                {user.activeWorkspace === role && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {t('activeWorkspace')}
                  </span>
                )}
              </Button>
            </form>
          ))}
          {missingSelfServiceRoles.map((role) => (
            <form action={addWorkspaceAction} key={role}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="role" value={role} />
              <Button className="w-full justify-start" type="submit" variant="ghost">
                {t('addWorkspace', { role: t(`registerRoles.${role}`) })}
              </Button>
            </form>
          ))}
          <form action={logoutAction}>
            <input type="hidden" name="locale" value={locale} />
            <Button className="w-full" type="submit" variant="ghost">
              {t('signOut')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
