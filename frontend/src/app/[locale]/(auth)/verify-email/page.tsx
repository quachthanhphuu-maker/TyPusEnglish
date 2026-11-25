'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { verifyEmailAction } from '@/modules/accounts/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const search = useSearchParams(); const locale = useLocale(); const t = useTranslations('auth');
  const [status, setStatus] = React.useState<'ready' | 'verified' | 'invalid'>('ready'); const [busy, setBusy] = React.useState(false);
  async function verify() { if (busy) return; setBusy(true); try { setStatus(await verifyEmailAction(search.get('token') ?? '') ? 'verified' : 'invalid'); } catch { setStatus('invalid'); } finally { setBusy(false); } }
  return <div className="flex min-h-[70vh] items-center justify-center px-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>{t('verifyEmailTitle')}</CardTitle></CardHeader><CardContent>{status === 'ready' ? <Button disabled={busy || !search.get('token')} onClick={verify}>{busy ? t('working') : t('verifyEmail')}</Button> : <p role="status">{t(status === 'verified' ? 'emailVerified' : 'errors.tokenInvalid')}</p>}{status === 'verified' && <Link className="mt-4 block text-sm text-primary underline" href={`/${locale}/login`}>{t('signIn')}</Link>}</CardContent></Card></div>;
}
