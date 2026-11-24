'use client';

import * as React from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { addVerifiedEmailAction, unlinkOAuthAction } from '@/modules/accounts/actions';
import type { AuthMethod } from '@/modules/accounts/contracts/auth-contract';

export default function AccountSecurityPanel({ methods, email }: { methods: AuthMethod[]; email: string | null }) {
  const t = useTranslations('auth'); const locale = useLocale(); const [busy, setBusy] = React.useState(false); const [notice, setNotice] = React.useState('');
  const hasPassword = methods.includes('password');
  const [emailSent, setEmailSent] = React.useState(false);
  async function unlink(provider: 'google' | 'zalo') {
    if (busy) return; setBusy(true);
    try { const ok = await unlinkOAuthAction(provider); if (!ok) { setNotice(t('errors.authMethodRequired')); return; } setNotice(t('providerUnlinked')); await signOut({ callbackUrl: `/${locale}/login` }); }
    catch { setNotice(t('errors.internal')); } finally { setBusy(false); }
  }
  async function addEmail(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (busy) return; setBusy(true); const data = new FormData(event.currentTarget); try { setEmailSent(await addVerifiedEmailAction(String(data.get('email') ?? ''), locale)); } finally { setBusy(false); } }
  return <div className="space-y-4 rounded-lg border p-5"><p className="text-sm text-muted-foreground">{t('securityDescription')}</p><div className="grid gap-3 sm:grid-cols-2"><Button variant="outline" disabled={busy || methods.includes('google')} onClick={() => signIn('google', { callbackUrl: `/${locale}/account-security` })}>{methods.includes('google') ? t('googleLinked') : t('linkGoogle')}</Button><Button variant="outline" disabled={busy || methods.includes('zalo')} onClick={() => signIn('zalo', { callbackUrl: `/${locale}/account-security` })}>{methods.includes('zalo') ? t('zaloLinked') : t('linkZalo')}</Button></div><p className="text-sm">{hasPassword ? t('passwordMethodLinked') : t('passwordMethodNotLinked')}</p>{!email && <form className="flex flex-col gap-2 sm:flex-row" onSubmit={addEmail}><input name="email" type="email" required maxLength={254} placeholder={t('emailLabel')} className="h-10 flex-1 rounded-md border bg-background px-3" /><Button disabled={busy}>{t('verifyAddedEmail')}</Button></form>}{emailSent && <p role="status" className="text-sm">{t('verificationSent')}</p>}<div className="flex gap-2">{methods.includes('google') && <Button variant="destructive" size="sm" disabled={busy || methods.length <= 1} onClick={() => unlink('google')}>{t('unlinkGoogle')}</Button>}{methods.includes('zalo') && <Button variant="destructive" size="sm" disabled={busy || methods.length <= 1} onClick={() => unlink('zalo')}>{t('unlinkZalo')}</Button>}</div>{notice && <p role="status" className="text-sm">{notice}</p>}</div>;
}
