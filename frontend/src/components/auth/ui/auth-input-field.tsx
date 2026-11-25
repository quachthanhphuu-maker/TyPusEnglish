'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuthInputFieldProps } from './auth-types';

export const AuthInputField = React.forwardRef<HTMLInputElement, AuthInputFieldProps>(
  (
    {
      label,
      name,
      type = 'text',
      hint,
      error,
      leftIcon,
      isPassword = false,
      onPasswordToggle,
      onFocusChange,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = React.useId();
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const handlePasswordToggle = () => {
      const nextState = !showPassword;
      setShowPassword(nextState);
      onPasswordToggle?.(nextState);
    };

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold font-heading text-[#1B2A38]"
        >
          {label}
        </label>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onFocus={(e) => {
              onFocusChange?.(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              onFocusChange?.(false);
              props.onBlur?.(e);
            }}
            className={cn(
              'h-11 w-full rounded-xl border border-[#D8E9F8] bg-white px-3.5 text-sm text-[#1B2A38] placeholder:text-slate-400 transition-all duration-200 outline-none',
              leftIcon && 'pl-10',
              isPassword && 'pr-11',
              'focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
              disabled && 'bg-slate-50 cursor-not-allowed text-slate-400',
              className
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-3.5 flex items-center p-0.5 text-slate-400 hover:text-[#1B2A38] focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-[#0EA5E9]" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-[11px] text-slate-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInputField.displayName = 'AuthInputField';
