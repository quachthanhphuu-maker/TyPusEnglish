import { notFound } from 'next/navigation';
import {
  MOCK_CLASSES,
  MOCK_LESSONS,
  MOCK_STUDENT_ASSIGNMENTS,
  MOCK_STUDENT_RESULTS,
} from '@/mocks/data';
import { StudentDashboardView } from '@/modules/dashboards/components/student-dashboard-view';

export default function StudentPreviewPage({
  params,
}: {
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';
  const studentClasses = MOCK_CLASSES.slice(0, 2);
  const studentSchedule = MOCK_LESSONS.filter(
    (lesson) => lesson.classId === 'cls_01' || lesson.classId === 'cls_02',
  );

  return (
    <StudentDashboardView
      locale={locale}
      basePath={`/${locale}/preview/student`}
      studentName="Minh Anh"
      classes={studentClasses}
      schedule={studentSchedule}
      assignments={[...MOCK_STUDENT_ASSIGNMENTS]}
      results={[...MOCK_STUDENT_RESULTS]}
    />
  );
}
