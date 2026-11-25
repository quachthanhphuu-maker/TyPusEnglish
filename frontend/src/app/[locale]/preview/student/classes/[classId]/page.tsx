import { notFound } from 'next/navigation';
import {
  MOCK_CLASSES,
  MOCK_LESSONS,
  MOCK_STUDENT_ASSIGNMENTS,
  MOCK_STUDENT_RESULTS,
} from '@/mocks/data';
import { StudentClassDetailView } from '@/modules/dashboards/components/student-class-detail-view';

export default function StudentPreviewClassDetailPage({
  params,
}: {
  params: { locale: string; classId: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return (
    <StudentClassDetailView
      locale={locale}
      basePath={`/${locale}/preview/student`}
      classId={params.classId}
      classes={MOCK_CLASSES.slice(0, 2)}
      schedule={MOCK_LESSONS.filter(
        (lesson) => lesson.classId === 'cls_01' || lesson.classId === 'cls_02',
      )}
      assignments={[...MOCK_STUDENT_ASSIGNMENTS]}
      results={[...MOCK_STUDENT_RESULTS]}
    />
  );
}
