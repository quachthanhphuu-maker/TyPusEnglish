'use client';

import * as React from 'react';
import {
  AuthSplitLayout,
  LoginPresentation,
  RegisterPresentation,
  type PenguinState,
  type AuthFieldFocus,
  type AuthMode,
} from '@/components/auth/ui';

export function AuthPreviewClient({ initialLocale }: { initialLocale: 'vi' | 'en' }) {
  const [locale, setLocale] = React.useState<'vi' | 'en'>(initialLocale);
  const [mode, setMode] = React.useState<AuthMode>('login');
  const [focusedField, setFocusedField] = React.useState<AuthFieldFocus>(null);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Form input state
  const [identifier, setIdentifier] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Initial welcoming wave for the first 3 seconds
  const [isWelcoming, setIsWelcoming] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcoming(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Determine autonomous penguin state based on user interaction
  const effectivePenguinState: PenguinState = React.useMemo(() => {
    if (isLoading) return 'loading';
    if (successMessage) return 'success';
    if (focusedField === 'password') {
      return isPasswordVisible ? 'password_visible' : 'password_focus';
    }
    if (focusedField === 'identifier' || focusedField === 'username' || focusedField === 'email') {
      return 'username_focus';
    }
    if (isWelcoming) return 'initial';
    if (mode === 'register') return 'register_mode';
    return 'idle';
  }, [isLoading, successMessage, focusedField, isPasswordVisible, isWelcoming, mode]);

  const handleLanguageToggle = () => {
    setLocale((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        locale === 'en'
          ? '🎉 Authentication successful! Welcome back to TyPusEnglish.'
          : '🎉 Đăng nhập thành công! Chào mừng bạn quay trở lại với TyPusEnglish.'
      );
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        locale === 'en'
          ? '🎉 Registration successful! Welcome to TyPusEnglish.'
          : '🎉 Đăng ký thành công! Chào mừng bạn đến với TyPusEnglish.'
      );
    }, 1200);
  };

  return (
    <AuthSplitLayout
      penguinState={effectivePenguinState}
      locale={locale}
      onLanguageToggle={handleLanguageToggle}
    >
      {mode === 'login' ? (
        <LoginPresentation
          locale={locale}
          isLoading={isLoading}
          errorMessage={errorMessage}
          identifierValue={identifier}
          passwordValue={password}
          onIdentifierChange={setIdentifier}
          onPasswordChange={setPassword}
          onSubmit={handleLoginSubmit}
          onGoogleSignIn={() => alert('Google OAuth sign-in')}
          onZaloSignIn={() => alert('Zalo OAuth sign-in')}
          onForgotPassword={() => alert('Quên mật khẩu / Forgot password')}
          onSwitchToRegister={() => {
            setMode('register');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          onFocusFieldChange={setFocusedField}
          onPasswordVisibilityChange={setIsPasswordVisible}
          onLanguageToggle={handleLanguageToggle}
        />
      ) : (
        <RegisterPresentation
          locale={locale}
          isLoading={isLoading}
          errorMessage={errorMessage}
          successMessage={successMessage}
          emailValue={email}
          usernameValue={username}
          passwordValue={password}
          onEmailChange={setEmail}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleRegisterSubmit}
          onGoogleSignIn={() => alert('Google OAuth sign-up')}
          onZaloSignIn={() => alert('Zalo OAuth sign-up')}
          onSwitchToLogin={() => {
            setMode('login');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          onFocusFieldChange={setFocusedField}
          onPasswordVisibilityChange={setIsPasswordVisible}
          onLanguageToggle={handleLanguageToggle}
        />
      )}
    </AuthSplitLayout>
  );
}
