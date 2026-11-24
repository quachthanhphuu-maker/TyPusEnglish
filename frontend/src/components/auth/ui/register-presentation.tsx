'use client';

import * as React from 'react';
import { Mail, User, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { GoogleAuthButton, ZaloAuthButton } from './social-auth-buttons';
import { AuthInputField } from './auth-input-field';
import type { RegisterPresentationProps } from './auth-types';

export function RegisterPresentation({
  locale = 'vi',
  isLoading = false,
  errorMessage,
  successMessage,
  onSubmit,
  onGoogleSignIn,
  onZaloSignIn,
  onSwitchToLogin,
  emailValue = '',
  usernameValue = '',
  passwordValue = '',
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  onFocusFieldChange,
  onPasswordVisibilityChange,
}: RegisterPresentationProps) {
  const isEn = locale === 'en';

  const texts = {
    title: isEn ? 'Create your account' : 'Tạo tài khoản TyPusEnglish',
    subtitle: isEn
      ? 'Sign up to manage classes or practice English independently'
      : 'Tham gia giảng dạy lớp học hoặc tự học Tiếng Anh thông minh',
    emailLabel: isEn ? 'Email address' : 'Địa chỉ email',
    emailPlaceholder: isEn ? 'Enter your email address' : 'Nhập địa chỉ email của bạn',
    usernameLabel: isEn ? 'Username' : 'Tên đăng nhập',
    usernamePlaceholder: isEn ? 'Choose a username' : 'Chọn tên đăng nhập',
    usernameHint: isEn
      ? '3–32 letters, numbers, dots, hyphens, or underscores.'
      : 'Dài 3–32 ký tự, gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.',
    passwordLabel: isEn ? 'Password' : 'Mật khẩu',
    passwordPlaceholder: isEn ? 'Choose a strong password' : 'Nhập mật khẩu an toàn',
    passwordHint: isEn ? 'Use 12–128 characters.' : 'Dùng từ 12 đến 128 ký tự.',
    createAccount: isEn ? 'Create account' : 'Tạo tài khoản',
    creating: isEn ? 'Creating account...' : 'Đang xử lý...',
    orContinueWith: isEn ? 'Or continue with' : 'Hoặc tiếp tục bằng',
    loginPrompt: isEn ? 'Already have an account?' : 'Bạn đã có tài khoản?',
    loginLink: isEn ? 'Sign in' : 'Đăng nhập ngay',
  };

  return (
    <div className="w-full space-y-5">
      {/* Heading */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1B2A38] tracking-tight">
          {texts.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-body">
          {texts.subtitle}
        </p>
      </div>

      {/* Social Sign-ups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <GoogleAuthButton
          onClick={onGoogleSignIn}
          disabled={isLoading}
          label={isEn ? 'Google' : 'Google'}
        />
        <ZaloAuthButton
          onClick={onZaloSignIn}
          disabled={isLoading}
          label={isEn ? 'Zalo' : 'Zalo'}
        />
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[#D8E9F8]" />
        <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {texts.orContinueWith}
        </span>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Email Field */}
        <AuthInputField
          label={texts.emailLabel}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={texts.emailPlaceholder}
          value={emailValue}
          onChange={(e) => onEmailChange?.(e.target.value)}
          disabled={isLoading}
          leftIcon={<Mail className="h-4 w-4" />}
          onFocusChange={(focused) => onFocusFieldChange?.(focused ? 'email' : null)}
        />

        {/* Username Field */}
        <AuthInputField
          label={texts.usernameLabel}
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder={texts.usernamePlaceholder}
          hint={texts.usernameHint}
          value={usernameValue}
          onChange={(e) => onUsernameChange?.(e.target.value)}
          disabled={isLoading}
          leftIcon={<User className="h-4 w-4" />}
          onFocusChange={(focused) => onFocusFieldChange?.(focused ? 'username' : null)}
        />

        {/* Password Field */}
        <AuthInputField
          label={texts.passwordLabel}
          name="password"
          type="password"
          isPassword={true}
          required
          autoComplete="new-password"
          placeholder={texts.passwordPlaceholder}
          hint={texts.passwordHint}
          value={passwordValue}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          disabled={isLoading}
          leftIcon={<Lock className="h-4 w-4" />}
          onFocusChange={(focused) => onFocusFieldChange?.(focused ? 'password' : null)}
          onPasswordToggle={onPasswordVisibilityChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A00] hover:bg-[#E56E00] text-white px-5 py-3 text-sm font-bold font-heading shadow-md shadow-[#FF7A00]/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
        >
          <span>{isLoading ? texts.creating : texts.createAccount}</span>
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-slate-500">
        <span>{texts.loginPrompt} </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-[#FF7A00] hover:underline underline-offset-2 transition-colors focus-visible:outline-none"
        >
          {texts.loginLink}
        </button>
      </div>
    </div>
  );
}
