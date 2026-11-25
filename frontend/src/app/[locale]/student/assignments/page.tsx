import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { ClipboardCheck } from 'lucide-react';
import { StudentAssignmentsView } from '@/modules/dashboards/components/student-assignments-view';
import { studentService } from '@/services/api-client';

export default async function StudentAssignmentsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('student');

  const [assignments, results] = await Promise.all([
    studentService.getDashboardAssignments().catch(() => []),
    studentService.getPublishedResults().catch(() => []),
  ]);

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
        <StudentAssignmentsView locale={locale} assignments={assignments} results={results} />
      </Suspense>
    </div>
  );
}
