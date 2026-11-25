'use client';

import { requestPasswordResetAction } from '@/modules/accounts/actions';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as React from 'react';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth'); const locale = useLocale(); const [sent, setSent] = React.useState(false); const [busy, setBusy] = React.useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (busy) return; setBusy(true); const data = new FormData(event.currentTarget); data.set('locale', locale); try { await requestPasswordResetAction(data); setSent(true); } finally { setBusy(false); } }
  return <div className="flex min-h-[70vh] items-center justify-center px-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>{t('forgotPassword')}</CardTitle></CardHeader><CardContent>{sent ? <p role="status">{t('resetRequestSent')}</p> : <form className="space-y-4" onSubmit={submit}><label className="block space-y-1 text-sm"><span>{t('emailLabel')}</span><input name="email" type="email" required maxLength={254} className="h-10 w-full rounded-md border bg-background px-3" /></label><Button disabled={busy} className="w-full">{t('sendResetLink')}</Button></form>}<Link className="mt-4 block text-sm text-primary underline" href={`/${locale}/login`}>{t('backToLogin')}</Link></CardContent></Card></div>;
}
