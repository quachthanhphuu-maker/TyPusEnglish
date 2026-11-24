'use client';

import * as React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSafeReturnTo } from '@/modules/accounts/lib/redirect';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale() as 'vi' | 'en';
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const intent = searchParams.get('intent');
    const signupRole = intent === 'tutor' || intent === 'independent_learner' ? intent : null;
    const defaultCallback = `/${locale}/verify-request${signupRole ? `?role=${signupRole}` : ''}`;
    const callbackUrl =
      getSafeReturnTo(searchParams.get('callbackUrl'), locale) ?? defaultCallback;

    setHasError(false);
    setIsSubmitting(true);
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      });
      if (!result || result.error) {
        setHasError(true);
        return;
      }
      setIsSubmitted(true);
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div
              className="flex flex-col items-center justify-center space-y-3 p-4 text-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t('sentSuccess')}
              </p>
              <p className="text-xs text-muted-foreground">{email.trim()}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    disabled={isSubmitting}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? 'auth-error' : undefined}
                  />
                </div>
              </div>
              {hasError && (
                <p id="auth-error" className="text-sm text-destructive" role="alert">
                  {t('requestFailed')}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('sending') : t('sendLink')}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4 text-center text-xs text-muted-foreground">
          <p>{t('registerPrompt')}</p>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={`/${locale}/register`}>
            {t('registerLink')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
