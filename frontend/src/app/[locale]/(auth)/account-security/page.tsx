import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthStatus } from '@/modules/accounts/auth';
import AccountSecurityPanel from './panel';

export default async function AccountSecurityPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const status = await getAuthStatus();
  if (status.status !== 'authenticated') redirect(`/${locale}/login`);
  const t = await getTranslations('auth');
  return <main className="mx-auto max-w-2xl px-4 py-10"><h1 className="mb-6 text-2xl font-semibold">{t('securityTitle')}</h1><AccountSecurityPanel methods={status.session.user.authMethods} email={status.session.user.email} /></main>;
}
