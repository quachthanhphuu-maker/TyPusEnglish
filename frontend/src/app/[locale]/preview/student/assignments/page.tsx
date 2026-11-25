import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ClipboardCheck } from 'lucide-react';
import { MOCK_STUDENT_ASSIGNMENTS, MOCK_STUDENT_RESULTS } from '@/mocks/data';
import { StudentAssignmentsView } from '@/modules/dashboards/components/student-assignments-view';

export default async function StudentPreviewAssignmentsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('student');

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          <span>{t('portalLabel')}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{t('upcomingAssignments')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('assignmentHint')}</p>
      </header>

      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-2xl border border-[#1E293B] bg-[#131E2B]" />
        }
      >
        <StudentAssignmentsView
          locale={locale}
          assignments={[...MOCK_STUDENT_ASSIGNMENTS]}
          results={[...MOCK_STUDENT_RESULTS]}
        />
      </Suspense>
    </div>
  );
}
