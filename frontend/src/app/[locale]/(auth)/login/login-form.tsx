'use client';

import * as React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSafeReturnTo } from '@/modules/accounts/lib/redirect';

export default function LoginForm({ googleEnabled, zaloEnabled }: { googleEnabled: boolean; zaloEnabled: boolean }) {
  const t = useTranslations('auth');
  const locale = useLocale() as 'vi' | 'en';
  const search = useSearchParams();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(false);
  const callbackUrl = getSafeReturnTo(search.get('callbackUrl'), locale) ?? `/${locale}/onboarding`;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(false);
    const data = new FormData(event.currentTarget);
    try {
      const result = await signIn('credentials', { identifier: data.get('identifier'), password: data.get('password'), callbackUrl, redirect: false });
      if (result?.error) setError(true);
      else if (result?.url) window.location.assign(result.url);
      else setError(true);
    } catch { setError(true); } finally { setBusy(false); }
  }
  return <div className="flex min-h-[70vh] items-center justify-center px-4 py-10"><Card className="w-full max-w-md">
    <CardHeader className="text-center"><CardTitle className="text-2xl">{t('title')}</CardTitle><CardDescription>{t('subtitle')}</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1 text-sm"><span>{t('identifierLabel')}</span><input name="identifier" required autoComplete="username" maxLength={254} className="h-10 w-full rounded-md border bg-background px-3" /></label>
        <label className="block space-y-1 text-sm"><span>{t('passwordLabel')}</span><input name="password" type="password" required autoComplete="current-password" className="h-10 w-full rounded-md border bg-background px-3" /></label>
        {error && <p className="text-sm text-destructive" role="alert">{t('errors.invalidCredentials')}</p>}
        <Button className="w-full" type="submit" disabled={busy}>{busy ? t('working') : t('signIn')}</Button>
      </form>
      <Link className="block text-center text-sm text-primary underline" href={`/${locale}/forgot-password`}>{t('forgotPassword')}</Link>
      <div className="relative py-1 text-center text-xs text-muted-foreground"><span className="bg-card px-2">{t('orContinueWith')}</span></div>
      <div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" disabled={busy || !googleEnabled} onClick={() => signIn('google', { callbackUrl })}>Google</Button><Button type="button" variant="outline" disabled={busy || !zaloEnabled} onClick={() => signIn('zalo', { callbackUrl })}>Zalo</Button></div>
      {(!googleEnabled || !zaloEnabled) && <p className="text-xs text-muted-foreground">{t('providerSetupHint')}</p>}
    </CardContent>
    <CardFooter className="flex justify-center gap-1 border-t pt-4 text-sm text-muted-foreground"><span>{t('registerPrompt')}</span><Link className="font-medium text-primary underline" href={`/${locale}/register`}>{t('registerLink')}</Link></CardFooter>
  </Card></div>;
}
