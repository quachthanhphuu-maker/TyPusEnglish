export type PenguinState =
  | 'initial'
  | 'idle'
  | 'username_focus'
  | 'password_focus'
  | 'password_visible'
  | 'loading'
  | 'success'
  | 'register_mode';

export type AuthFieldFocus = 'identifier' | 'username' | 'email' | 'password' | null;

export type AuthMode = 'login' | 'register';

export interface SocialAuthButtonProps {
  provider: 'google' | 'zalo';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  label?: string;
}

export interface AuthInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  onPasswordToggle?: (isVisible: boolean) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export interface InteractivePenguinProps {
  state?: PenguinState;
  className?: string;
  showDecorations?: boolean;
}

export interface LoginPresentationProps {
  locale: 'vi' | 'en';
  isLoading?: boolean;
  errorMessage?: string | null;
  onLanguageToggle?: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onZaloSignIn?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  identifierValue?: string;
  passwordValue?: string;
  onIdentifierChange?: (val: string) => void;
  onPasswordChange?: (val: string) => void;
  onFocusFieldChange?: (field: AuthFieldFocus) => void;
  onPasswordVisibilityChange?: (isVisible: boolean) => void;
}

export interface RegisterPresentationProps {
  locale: 'vi' | 'en';
  isLoading?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  onLanguageToggle?: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onZaloSignIn?: () => void;
  onSwitchToLogin?: () => void;
  emailValue?: string;
  usernameValue?: string;
  passwordValue?: string;
  onEmailChange?: (val: string) => void;
  onUsernameChange?: (val: string) => void;
  onPasswordChange?: (val: string) => void;
  onFocusFieldChange?: (field: AuthFieldFocus) => void;
  onPasswordVisibilityChange?: (isVisible: boolean) => void;
}

export interface AuthSplitLayoutProps {
  children: React.ReactNode;
  penguinState?: PenguinState;
  locale?: 'vi' | 'en';
  onLanguageToggle?: () => void;
}
