import { notFound } from 'next/navigation';
import { AuthPreviewClient } from './preview-client';

export const metadata = {
  title: 'TyPusEnglish Auth UI Preview (Isolated)',
  robots: 'noindex, nofollow',
};

export default function AuthPreviewPage({
  params,
}: {
  params: { locale: string };
}) {
  // Merge safety: Keep preview inaccessible in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return <AuthPreviewClient initialLocale={locale} />;
}
