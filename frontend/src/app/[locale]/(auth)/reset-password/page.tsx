'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { resetPasswordAction } from '@/modules/accounts/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const search = useSearchParams(); const locale = useLocale(); const t = useTranslations('auth'); const [done, setDone] = React.useState(false); const [error, setError] = React.useState(false); const [busy, setBusy] = React.useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (busy) return; setBusy(true); setError(false); const data = new FormData(event.currentTarget); const password = String(data.get('password') ?? ''); try { const ok = await resetPasswordAction(search.get('token') ?? '', password); setDone(ok); setError(!ok); } catch { setError(true); } finally { setBusy(false); } }
  return <div className="flex min-h-[70vh] items-center justify-center px-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>{t('resetPasswordTitle')}</CardTitle></CardHeader><CardContent>{done ? <p role="status">{t('passwordReset')}</p> : <form onSubmit={submit} className="space-y-4"><label className="block space-y-1 text-sm"><span>{t('passwordLabel')}</span><input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="h-10 w-full rounded-md border bg-background px-3" /></label>{error && <p role="alert" className="text-sm text-destructive">{t('errors.tokenInvalid')}</p>}<Button disabled={busy || !search.get('token')} className="w-full">{busy ? t('working') : t('resetPassword')}</Button></form>}<Link className="mt-4 block text-sm text-primary underline" href={`/${locale}/login`}>{t('backToLogin')}</Link></CardContent></Card></div>;
}
