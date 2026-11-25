import { notFound } from 'next/navigation';
import {
  MOCK_CLASSES,
  MOCK_LESSONS,
  MOCK_TUTOR_SUBMISSIONS,
} from '@/mocks/data';
import { TutorDashboardView } from '@/modules/dashboards/components/tutor-dashboard-view';

export default function TutorPreviewPage({
  params,
}: {
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';
  const ungradedSubmissions = MOCK_TUTOR_SUBMISSIONS.filter(
    (submission) => submission.status === 'UNGRADED',
  );

  return (
    <TutorDashboardView
      locale={locale}
      classes={[...MOCK_CLASSES]}
      lessons={[...MOCK_LESSONS]}
      submissions={ungradedSubmissions}
    />
  );
}
