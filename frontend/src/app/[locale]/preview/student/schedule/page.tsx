import { notFound } from 'next/navigation';
import { MOCK_CLASSES, MOCK_LESSONS } from '@/mocks/data';
import { StudentScheduleView } from '@/modules/dashboards/components/student-schedule-view';

export default function StudentPreviewSchedulePage({
  params,
}: {
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return (
    <StudentScheduleView
      locale={locale}
      basePath={`/${locale}/preview/student`}
      classes={MOCK_CLASSES.slice(0, 2)}
      schedule={MOCK_LESSONS.filter(
        (lesson) => lesson.classId === 'cls_01' || lesson.classId === 'cls_02',
      )}
    />
  );
}
