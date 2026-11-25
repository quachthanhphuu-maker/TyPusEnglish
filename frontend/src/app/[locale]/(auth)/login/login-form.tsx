'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { AuthSplitLayout } from '@/components/auth/ui/auth-split-layout';
import { LoginPresentation } from '@/components/auth/ui/login-presentation';
import type { PenguinState } from '@/components/auth/ui/auth-types';
import { getSafeReturnTo } from '@/modules/accounts/lib/redirect';

export default function LoginForm({
  googleEnabled,
  zaloEnabled,
}: {
  googleEnabled: boolean;
  zaloEnabled: boolean;
}) {
  const t = useTranslations('auth');
  const locale = useLocale() as 'vi' | 'en';
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [penguinState, setPenguinState] = React.useState<PenguinState>('idle');

  const callbackUrl =
    getSafeReturnTo(search.get('callbackUrl'), locale) ?? `/${locale}/onboarding`;

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setPenguinState('loading');

    try {
      const result = await signIn('credentials', {
        identifier,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(t('errors.invalidCredentials'));
        setPenguinState('idle');
      } else if (result?.url) {
        setPenguinState('success');
        setTimeout(() => {
          window.location.assign(result.url!);
        }, 600);
      } else {
        setError(t('errors.invalidCredentials'));
        setPenguinState('idle');
      }
    } catch {
      setError(t('errors.invalidCredentials'));
      setPenguinState('idle');
    } finally {
      setBusy(false);
    }
  }

  const handleGoogleSignIn = () => {
    if (!googleEnabled) return;
    signIn('google', { callbackUrl });
  };

  const handleZaloSignIn = () => {
    if (!zaloEnabled) return;
    signIn('zalo', { callbackUrl });
  };

  return (
    <AuthSplitLayout
      penguinState={penguinState}
      locale={locale}
      onLanguageToggle={toggleLanguage}
    >
      <LoginPresentation
        locale={locale}
        isLoading={busy}
        errorMessage={error}
        identifierValue={identifier}
        passwordValue={password}
        onIdentifierChange={setIdentifier}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onZaloSignIn={handleZaloSignIn}
        onSwitchToRegister={() => router.push(`/${locale}/register`)}
        onForgotPassword={() => router.push(`/${locale}/forgot-password`)}
        onFocusFieldChange={(field) => {
          if (field === 'identifier') setPenguinState('username_focus');
          else if (field === 'password') setPenguinState('password_focus');
          else if (field === null && !busy && !error) setPenguinState('idle');
        }}
        onPasswordVisibilityChange={(visible) => {
          if (visible) setPenguinState('password_visible');
          else setPenguinState('password_focus');
        }}
      />
    </AuthSplitLayout>
  );
}
