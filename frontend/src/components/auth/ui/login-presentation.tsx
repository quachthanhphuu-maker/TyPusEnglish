'use client';

import * as React from 'react';
import { User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { GoogleAuthButton, ZaloAuthButton } from './social-auth-buttons';
import { AuthInputField } from './auth-input-field';
import type { LoginPresentationProps } from './auth-types';

export function LoginPresentation({
  locale = 'vi',
  isLoading = false,
  errorMessage,
  onSubmit,
  onGoogleSignIn,
  onZaloSignIn,
  onSwitchToRegister,
  onForgotPassword,
  identifierValue = '',
  passwordValue = '',
  onIdentifierChange,
  onPasswordChange,
  onFocusFieldChange,
  onPasswordVisibilityChange,
}: LoginPresentationProps) {
  const isEn = locale === 'en';

  const texts = {
    title: isEn ? 'Sign In to TyPusEnglish' : 'Đăng nhập TyPusEnglish',
    subtitle: isEn
      ? 'Sign in with your account or continue with Google or Zalo'
      : 'Đăng nhập hoặc tiếp tục bằng Google hay Zalo',
    identifierLabel: isEn ? 'Email or username' : 'Email hoặc tên đăng nhập',
    identifierPlaceholder: isEn ? 'Enter username or email' : 'Nhập tên đăng nhập hoặc email',
    passwordLabel: isEn ? 'Password' : 'Mật khẩu',
    passwordPlaceholder: isEn ? 'Enter password' : 'Nhập mật khẩu',
    forgotPassword: isEn ? 'Forgot password?' : 'Quên mật khẩu?',
    signIn: isEn ? 'Sign in' : 'Đăng nhập',
    signingIn: isEn ? 'Signing in...' : 'Đang xử lý...',
    orContinueWith: isEn ? 'Or continue with' : 'Hoặc tiếp tục bằng',
    registerPrompt: isEn ? 'New to TyPusEnglish?' : 'Bạn mới sử dụng TyPusEnglish?',
    registerLink: isEn ? 'Create an account' : 'Tạo tài khoản',
  };

  return (
    <div className="w-full space-y-6">
      {/* Heading */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1B2A38] tracking-tight">
          {texts.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-body">
          {texts.subtitle}
        </p>
      </div>

      {/* Social Logins */}
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

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Identifier (Email / Username) */}
        <AuthInputField
          label={texts.identifierLabel}
          name="identifier"
          type="text"
          required
          autoComplete="username"
          placeholder={texts.identifierPlaceholder}
          value={identifierValue}
          onChange={(e) => onIdentifierChange?.(e.target.value)}
          disabled={isLoading}
          leftIcon={<User className="h-4 w-4" />}
          onFocusChange={(focused) => onFocusFieldChange?.(focused ? 'identifier' : null)}
        />

        {/* Password */}
        <div>
          <AuthInputField
            label={texts.passwordLabel}
            name="password"
            type="password"
            isPassword={true}
            required
            autoComplete="current-password"
            placeholder={texts.passwordPlaceholder}
            value={passwordValue}
            onChange={(e) => onPasswordChange?.(e.target.value)}
            disabled={isLoading}
            leftIcon={<Lock className="h-4 w-4" />}
            onFocusChange={(focused) => onFocusFieldChange?.(focused ? 'password' : null)}
            onPasswordToggle={onPasswordVisibilityChange}
          />

          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-semibold text-[#0EA5E9] hover:text-[#0284C7] hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0EA5E9]"
            >
              {texts.forgotPassword}
            </button>
          </div>
        </div>

        {/* Submit Button (Arctic Orange #FF7A00) */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A00] hover:bg-[#E56E00] text-white px-5 py-3 text-sm font-bold font-heading shadow-md shadow-[#FF7A00]/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
        >
          <span>{isLoading ? texts.signingIn : texts.signIn}</span>
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-slate-500">
        <span>{texts.registerPrompt} </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-[#FF7A00] hover:underline underline-offset-2 transition-colors focus-visible:outline-none"
        >
          {texts.registerLink}
        </button>
      </div>
    </div>
  );
}
