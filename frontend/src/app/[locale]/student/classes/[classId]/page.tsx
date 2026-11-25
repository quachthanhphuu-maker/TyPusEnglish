import { StudentClassDetailView } from '@/modules/dashboards/components/student-class-detail-view';
import { studentService } from '@/services/api-client';

export default async function StudentClassDetailPage({
  params,
}: {
  params: { locale: string; classId: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const [classes, schedule, assignments, results] = await Promise.all([
    studentService.getMyClasses().catch(() => []),
    studentService.getSchedule().catch(() => []),
    studentService.getDashboardAssignments().catch(() => []),
    studentService.getPublishedResults().catch(() => []),
  ]);

  return (
    <StudentClassDetailView
      locale={locale}
      basePath={`/${locale}/student`}
      classId={params.classId}
      classes={classes}
      schedule={schedule}
      assignments={assignments}
      results={results}
    />
  );
}
