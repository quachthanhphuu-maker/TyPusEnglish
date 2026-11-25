'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { AuthSplitLayout } from '@/components/auth/ui/auth-split-layout';
import { RegisterPresentation } from '@/components/auth/ui/register-presentation';
import type { PenguinState } from '@/components/auth/ui/auth-types';
import { registerCredentialsAction } from '@/modules/accounts/actions';
import { validatePassword, validateUsername } from '@/modules/accounts/lib/credential-input';

export default function RegisterForm({
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

  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [penguinState, setPenguinState] = React.useState<PenguinState>('register_mode');

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    if (!validateUsername(username)) {
      setError(t('errors.invalidUsername'));
      setPenguinState('idle');
      return;
    }
    if (!validatePassword(password)) {
      setError(t('errors.invalidPassword'));
      setPenguinState('idle');
      return;
    }
    setBusy(true);
    setError(null);
    setPenguinState('loading');

    try {
      const data = new FormData();
      data.set('email', email);
      data.set('username', username);
      data.set('password', password);
      data.set('locale', locale);

      const result = await registerCredentialsAction(data);
      if (result === 'accepted') {
        setSent(true);
        setPenguinState('success');
      } else {
        setError(t('registrationFailed'));
        setPenguinState('idle');
      }
    } catch {
      setError(t('registrationFailed'));
      setPenguinState('idle');
    } finally {
      setBusy(false);
    }
  }

  const handleGoogleSignIn = () => {
    if (!googleEnabled) return;
    signIn('google', { callbackUrl: `/${locale}/onboarding` });
  };

  const handleZaloSignIn = () => {
    if (!zaloEnabled) return;
    signIn('zalo', { callbackUrl: `/${locale}/onboarding` });
  };

  return (
    <AuthSplitLayout
      penguinState={penguinState}
      locale={locale}
      onLanguageToggle={toggleLanguage}
    >
      <RegisterPresentation
        locale={locale}
        isLoading={busy}
        errorMessage={error}
        successMessage={sent ? t('verificationSent') : null}
        emailValue={email}
        usernameValue={username}
        passwordValue={password}
        onEmailChange={setEmail}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onZaloSignIn={handleZaloSignIn}
        onSwitchToLogin={() => router.push(`/${locale}/login`)}
        onFocusFieldChange={(field) => {
          if (field === 'email' || field === 'username') setPenguinState('username_focus');
          else if (field === 'password') setPenguinState('password_focus');
          else if (field === null && !busy && !sent && !error) setPenguinState('register_mode');
        }}
        onPasswordVisibilityChange={(visible) => {
          if (visible) setPenguinState('password_visible');
          else setPenguinState('password_focus');
        }}
      />
    </AuthSplitLayout>
  );
}
