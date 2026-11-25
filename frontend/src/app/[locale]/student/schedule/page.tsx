import { StudentScheduleView } from '@/modules/dashboards/components/student-schedule-view';
import { studentService } from '@/services/api-client';

export default async function StudentSchedulePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const [classes, schedule] = await Promise.all([
    studentService.getMyClasses().catch(() => []),
    studentService.getSchedule().catch(() => []),
  ]);

  return (
    <StudentScheduleView
      locale={locale}
      basePath={`/${locale}/student`}
      classes={classes}
      schedule={schedule}
    />
  );
}
