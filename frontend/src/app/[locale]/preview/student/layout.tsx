import { notFound } from 'next/navigation';
import { StudentShell } from '@/modules/dashboards/components/student-shell';

export const metadata = {
  title: 'TyPusEnglish Student Preview',
  robots: 'noindex, nofollow',
};

export default function StudentPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return (
    <StudentShell
      locale={locale}
      basePath={`/${locale}/preview/student`}
      isPreview
      user={{
        displayName: 'Minh Anh',
        email: 'minhanh.student@example.test',
        hasMultipleRoles: false,
      }}
    >
      {children}
    </StudentShell>
  );
}
