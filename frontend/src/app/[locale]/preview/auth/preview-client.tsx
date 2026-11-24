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
  const [manualState, setManualState] = React.useState<PenguinState | 'auto'>('auto');
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

  // Determine effective penguin state (either manual override or reactive to user focus)
  const effectivePenguinState: PenguinState = React.useMemo(() => {
    if (manualState !== 'auto') return manualState;
    if (isLoading) return 'loading';
    if (successMessage) return 'success';
    if (mode === 'register' && !focusedField) return 'register_mode';
    if (focusedField === 'password') {
      return isPasswordVisible ? 'password_visible' : 'password_focus';
    }
    if (focusedField === 'identifier' || focusedField === 'username' || focusedField === 'email') {
      return 'username_focus';
    }
    return 'idle';
  }, [manualState, isLoading, successMessage, mode, focusedField, isPasswordVisible]);

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
      if (!password || password.length < 6) {
        setErrorMessage(
          locale === 'en'
            ? 'Invalid credentials. Please check your username and password.'
            : 'Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.'
        );
      } else {
        setSuccessMessage(
          locale === 'en'
            ? 'Authentication successful! Welcome back.'
            : 'Đăng nhập thành công! Chào mừng bạn quay trở lại.'
        );
      }
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
          ? 'Registration request received! A verification link has been sent to your email.'
          : 'Đã gửi yêu cầu đăng ký! Vui lòng kiểm tra email để xác minh tài khoản.'
      );
    }, 1200);
  };

  const statesList: Array<{ label: string; value: PenguinState | 'auto' }> = [
    { label: 'Auto (Reactive)', value: 'auto' },
    { label: 'Initial (Wave)', value: 'initial' },
    { label: 'Idle (Breathe)', value: 'idle' },
    { label: 'Look at Form', value: 'username_focus' },
    { label: 'Cover Eyes', value: 'password_focus' },
    { label: 'Peek (Password Shown)', value: 'password_visible' },
    { label: 'Loading', value: 'loading' },
    { label: 'Success (Celebrate)', value: 'success' },
    { label: 'Register (Book)', value: 'register_mode' },
  ];

  return (
    <div className="relative">
      {/* Interactive Developer Showcase Toolbar (Isolated Preview Only) */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-[#0EA5E9]/20 bg-[#1B2A38] px-4 py-2.5 text-white shadow-md text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide text-arctic-orange uppercase">UI Preview Tool</span>
          <span className="text-slate-400 hidden sm:inline">| Parallel presentation testing</span>
        </div>

        {/* Mascot State Quick Overrides */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-300 mr-1 hidden md:inline">Mascot State:</span>
          {statesList.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setManualState(st.value)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                manualState === st.value
                  ? 'bg-[#FF7A00] text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'login' ? 'register' : 'login'));
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] px-3 py-1 text-xs font-semibold text-white transition-colors"
          >
            Switch to {mode === 'login' ? 'Register UI' : 'Login UI'}
          </button>
        </div>
      </div>

      {/* Main Split-Screen Component */}
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
            onGoogleSignIn={() => alert('Google OAuth sign-in trigger')}
            onZaloSignIn={() => alert('Zalo OAuth sign-in trigger')}
            onForgotPassword={() => alert('Forgot password trigger')}
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
            onGoogleSignIn={() => alert('Google OAuth sign-up trigger')}
            onZaloSignIn={() => alert('Zalo OAuth sign-up trigger')}
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
    </div>
  );
}
