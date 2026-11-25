'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ClipboardCheck, FileText, Medal, Search } from 'lucide-react';
import type { StudentDashboardAssignmentDTO, StudentPublishedResultDTO } from '@/types';
import { cn } from '@/lib/utils';
import {
  filterStudentAssignments,
  formatStudentDateTime,
  type AssignmentStatusFilter,
} from '../lib/student-helpers';

interface StudentAssignmentsViewProps {
  locale: 'vi' | 'en';
  assignments: StudentDashboardAssignmentDTO[];
  results: StudentPublishedResultDTO[];
}

export function StudentAssignmentsView({
  locale,
  assignments,
  results,
}: StudentAssignmentsViewProps) {
  const t = useTranslations('student');
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [statusFilter, setStatusFilter] = React.useState<AssignmentStatusFilter>('ALL');
  const [query, setQuery] = React.useState(initialQuery);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const isEn = locale === 'en';
  const filtered = filterStudentAssignments(assignments, statusFilter, query);

  const filterOptions: { value: AssignmentStatusFilter; label: string; count: number }[] = [
    { value: 'ALL', label: t('filters.all'), count: assignments.length },
    {
      value: 'NOT_SUBMITTED',
      label: t('filters.notSubmitted'),
      count: assignments.filter((a) => a.status === 'NOT_SUBMITTED').length,
    },
    {
      value: 'SUBMITTED',
      label: t('filters.submitted'),
      count: assignments.filter((a) => a.status === 'SUBMITTED').length,
    },
    {
      value: 'GRADED',
      label: t('filters.graded'),
      count: assignments.filter((a) => a.status === 'GRADED').length,
    },
  ];

  const statusBadge = (status: StudentDashboardAssignmentDTO['status']) => {
    if (status === 'NOT_SUBMITTED') {
      return {
        label: t('notSubmitted'),
        className: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
      };
    }
    if (status === 'SUBMITTED') {
      return {
        label: t('submitted'),
        className: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
      };
    }
    return {
      label: t('graded'),
      className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('upcomingAssignments')}>
          {filterOptions.map((option) => {
            const active = statusFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  'inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors',
                  active
                    ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/15 text-[#38BDF8]'
                    : 'border-[#243244] bg-[#0E1722] text-slate-300 hover:border-[#334155] hover:text-white',
                )}
              >
                <span>{option.label}</span>
                <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[11px] tabular-nums text-slate-300">
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="h-11 w-full rounded-xl border border-[#243244] bg-[#0E1722] pl-9 pr-3 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
          />
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#334155] bg-[#131E2B] p-8 text-center">
          <FileText aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-white">{t('upcomingAssignments')}</p>
          <p className="mt-1 text-xs text-slate-400">{t('noAssignments')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#334155] bg-[#131E2B] p-8 text-center">
          <ClipboardCheck aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-white">{t('noAssignmentsFiltered')}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((assignment) => {
            const badge = statusBadge(assignment.status);
            const matchedResult = results.find(
              (result) =>
                result.assignmentTitle === assignment.title &&
                result.className === assignment.className,
            );

            return (
              <li
                key={assignment.id}
                className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white sm:text-base">
                      {isEn ? assignment.titleEn ?? assignment.title : assignment.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {isEn ? assignment.classNameEn ?? assignment.className : assignment.className}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold',
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-300">
                  {t('dueDate', { date: formatStudentDateTime(assignment.dueDate, locale, true) })}
                </p>

                {matchedResult && (
                  <div className="mt-4 rounded-xl border border-emerald-400/20 bg-[#0E1722] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                        <Medal className="h-4 w-4" aria-hidden="true" />
                        {t('teacherFeedback')}
                      </span>
                      <span className="rounded-lg bg-emerald-400/15 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-200">
                        {matchedResult.score}/10
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {isEn ? matchedResult.feedbackEn ?? matchedResult.feedback : matchedResult.feedback}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
