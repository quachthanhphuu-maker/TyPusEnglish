import { getTranslations } from 'next-intl/server';
import { getAuthStatus } from '@/modules/accounts/auth';
import { StudentDashboardView } from '@/modules/dashboards/components/student-dashboard-view';
import { getStudentDisplayName } from '@/modules/dashboards/lib/student-helpers';
import { studentService } from '@/services/api-client';

export default async function StudentDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('student');

  const [authStatus, classes, schedule, assignments, results] = await Promise.all([
    getAuthStatus(),
    studentService.getMyClasses().catch(() => []),
    studentService.getSchedule().catch(() => []),
    studentService.getDashboardAssignments().catch(() => []),
    studentService.getPublishedResults().catch(() => []),
  ]);

  const studentName =
    authStatus.status === 'authenticated'
      ? getStudentDisplayName(authStatus.session.user, t('userMenu.studentRole'))
      : t('userMenu.studentRole');

  return (
    <StudentDashboardView
      locale={locale}
      basePath={`/${locale}/student`}
      studentName={studentName}
      classes={classes}
      schedule={schedule}
      assignments={assignments}
      results={results}
    />
  );
}
