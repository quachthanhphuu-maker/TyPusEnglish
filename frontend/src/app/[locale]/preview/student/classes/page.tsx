import { notFound } from 'next/navigation';
import { MOCK_CLASSES } from '@/mocks/data';
import { StudentClassesView } from '@/modules/dashboards/components/student-classes-view';

export default function StudentPreviewClassesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return (
    <StudentClassesView
      locale={locale}
      basePath={`/${locale}/preview/student`}
      classes={MOCK_CLASSES.slice(0, 2)}
    />
  );
}
