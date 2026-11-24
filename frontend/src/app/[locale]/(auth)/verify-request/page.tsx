import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthStatus } from '@/modules/accounts/auth';
import { getRoleLandingPath } from '@/modules/accounts/contracts/auth-contract';

export default async function VerifyRequestPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const status = await getAuthStatus();
  if (status.status === 'authenticated') {
    redirect(
      getRoleLandingPath(
        status.session.user.roles,
        status.session.user.onboardingStatus,
        status.session.user.activeWorkspace,
        locale,
      ),
    );
  }

  const t = await getTranslations('auth');
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('verifyRequestTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('verifyRequestDescription')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
