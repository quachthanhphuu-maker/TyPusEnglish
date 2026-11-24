'use client';

import * as React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registerCredentialsAction } from '@/modules/accounts/actions';

export default function RegisterForm({ googleEnabled, zaloEnabled }: { googleEnabled: boolean; zaloEnabled: boolean }) {
  const t = useTranslations('auth');
  const locale = useLocale() as 'vi' | 'en';
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(false);
    try {
      const data = new FormData(event.currentTarget); data.set('locale', locale);
      const result = await registerCredentialsAction(data);
      if (result === 'accepted') setSent(true); else setError(true);
    } catch { setError(true); } finally { setBusy(false); }
  }
  return <div className="flex min-h-[70vh] items-center justify-center px-4 py-10"><Card className="w-full max-w-lg">
    <CardHeader><CardTitle>{t('registerTitle')}</CardTitle><CardDescription>{t('registerDescription')}</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      {sent ? <div className="rounded-md border p-4 text-sm" role="status">{t('verificationSent')}</div> : <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1 text-sm"><span>{t('emailLabel')}</span><input name="email" type="email" required maxLength={254} autoComplete="email" className="h-10 w-full rounded-md border bg-background px-3" /></label>
        <label className="block space-y-1 text-sm"><span>{t('usernameLabel')}</span><input name="username" required minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9._-]*" autoComplete="username" className="h-10 w-full rounded-md border bg-background px-3" /><span className="text-xs text-muted-foreground">{t('usernameHint')}</span></label>
        <label className="block space-y-1 text-sm"><span>{t('passwordLabel')}</span><input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="h-10 w-full rounded-md border bg-background px-3" /><span className="text-xs text-muted-foreground">{t('passwordHint')}</span></label>
        {error && <p className="text-sm text-destructive" role="alert">{t('registrationFailed')}</p>}
        <Button className="w-full" type="submit" disabled={busy}>{busy ? t('working') : t('createAccount')}</Button>
      </form>}
      <div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" disabled={busy || !googleEnabled} onClick={() => signIn('google', { callbackUrl: `/${locale}/onboarding` })}>Google</Button><Button type="button" variant="outline" disabled={busy || !zaloEnabled} onClick={() => signIn('zalo', { callbackUrl: `/${locale}/onboarding` })}>Zalo</Button></div>
      {(!googleEnabled || !zaloEnabled) && <p className="text-xs text-muted-foreground">{t('providerSetupHint')}</p>}
      <p className="text-center text-sm">{t('registerPrompt')} <Link className="text-primary underline" href={`/${locale}/login`}>{t('registerLink')}</Link></p>
    </CardContent>
  </Card></div>;
}
