import { tutorService } from '@/services/api-client';
import { TutorDashboardView } from '@/modules/dashboards/components/tutor-dashboard-view';

export default async function TutorDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const [classes, lessons, submissions] = await Promise.all([
    tutorService.getClasses().catch(() => []),
    tutorService.getLessons().catch(() => []),
    tutorService.getSubmissionsToGrade().catch(() => []),
  ]);

  return (
    <TutorDashboardView
      locale={locale}
      classes={classes}
      lessons={lessons}
      submissions={submissions}
    />
  );
}
