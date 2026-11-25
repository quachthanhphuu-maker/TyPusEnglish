import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mapAuthJsError } from '@/modules/accounts/lib/auth-error';

export default async function AuthErrorPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { error?: string };
}) {
  const t = await getTranslations('auth');
  const code = mapAuthJsError(searchParams.error);
  const translationKey = {
    LINK_INVALID: 'linkInvalid',
    LINK_EXPIRED: 'linkExpired',
    FORBIDDEN: 'forbidden',
    UNAUTHENTICATED: 'unauthenticated',
    INVALID_EMAIL: 'invalidEmail',
    RATE_LIMITED: 'rateLimited',
    INVITATION_INVALID: 'invitationInvalid',
    SESSION_EXPIRED: 'sessionExpired',
    INTERNAL_ERROR: 'internal',
    AUTH_METHOD_CONFLICT: 'authMethodConflict',
    AUTH_METHOD_REQUIRED: 'authMethodRequired',
    EMAIL_NOT_VERIFIED: 'emailNotVerified',
    INVALID_CREDENTIALS: 'invalidCredentials',
    INVALID_PASSWORD: 'invalidPassword',
    INVALID_USERNAME: 'invalidUsername',
    TOKEN_EXPIRED: 'tokenExpired',
    TOKEN_INVALID: 'tokenInvalid',
    USERNAME_UNAVAILABLE: 'usernameUnavailable',
  }[code];

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('errorTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground" role="alert">
            {t(`errors.${translationKey}`)}
          </p>
          <a className="mt-4 inline-block text-sm text-primary underline" href={`/${params.locale}/login`}>
            {t('backToLogin')}
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
