import { getAuthStatus } from '@/modules/accounts/auth';
import { getStudentDisplayName } from '@/modules/dashboards/lib/student-helpers';
import { TutorDashboardView } from '@/modules/dashboards/components/tutor-dashboard-view';
import { tutorService } from '@/services/api-client';

export default async function TutorDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const [authStatus, classes, lessons, submissions] = await Promise.all([
    getAuthStatus(),
    tutorService.getClasses().catch(() => []),
    tutorService.getLessons().catch(() => []),
    tutorService.getSubmissionsToGrade().catch(() => []),
  ]);

  const tutorName =
    authStatus.status === 'authenticated'
      ? getStudentDisplayName(authStatus.session.user, locale === 'en' ? 'Tutor' : 'Gia sư')
      : locale === 'en'
        ? 'Tutor'
        : 'Gia sư';

  return (
    <TutorDashboardView
      locale={locale}
      classes={classes}
      lessons={lessons}
      submissions={submissions}
      tutorName={tutorName}
    />
  );
}
