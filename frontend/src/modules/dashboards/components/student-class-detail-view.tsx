import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  GraduationCap,
  Medal,
  ShieldAlert,
} from 'lucide-react';
import type {
  ClassSummaryDTO,
  LessonSummaryDTO,
  StudentDashboardAssignmentDTO,
  StudentPublishedResultDTO,
} from '@/types';
import { findAuthorizedStudentClass, formatStudentDateTime } from '../lib/student-helpers';

export async function StudentClassDetailView({
  locale,
  basePath,
  classId,
  classes,
  schedule,
  assignments,
  results,
}: {
  locale: 'vi' | 'en';
  basePath: string;
  classId: string;
  classes: ClassSummaryDTO[];
  schedule: LessonSummaryDTO[];
  assignments: StudentDashboardAssignmentDTO[];
  results: StudentPublishedResultDTO[];
}) {
  const isEn = locale === 'en';
  const t = await getTranslations('student');

  const cls = findAuthorizedStudentClass(classes, classId);

  if (!cls) {
    return (
      <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-8 text-center">
        <ShieldAlert aria-hidden="true" className="mx-auto h-9 w-9 text-amber-300" />
        <h1 className="mt-4 text-lg font-bold text-white">{t('classNotFoundTitle')}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          {t('classNotFoundDescription')}
        </p>
        <Link
          href={`${basePath}/classes`}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#243244] bg-[#0E1722] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#334155] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t('backToClasses')}</span>
        </Link>
      </div>
    );
  }

  const classLessons = schedule.filter((lesson) => lesson.classId === cls.id);
  const classAssignments = assignments.filter((item) => item.className === cls.name);
  const classResults = results.filter((item) => item.className === cls.name);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`${basePath}/classes`}
          className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t('backToClasses')}</span>
        </Link>
      </div>

      <header className="rounded-2xl border border-[#1E293B] bg-gradient-to-br from-[#152536] to-[#111A26] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            {isEn ? cls.subjectEn ?? cls.subject : cls.subject}
          </span>
          <span className="rounded-full border border-[#243244] bg-[#0E1722] px-3 py-1 text-xs font-medium text-slate-300">
            {isEn ? cls.gradeLevelEn ?? cls.gradeLevel : cls.gradeLevel}
          </span>
          <span className="rounded-full border border-[#243244] bg-[#0E1722] px-3 py-1 text-xs font-medium text-slate-300">
            {cls.classType === 'ONE_TO_ONE' ? t('classTypeOneToOne') : t('classTypeSmallGroup')}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
          {isEn ? cls.nameEn ?? cls.name : cls.name}
        </h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <CalendarDays className="h-5 w-5 text-sky-300" aria-hidden="true" />
            <span>{t('scheduleTitle')}</span>
          </h2>
          {classLessons.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[#334155] p-6 text-center text-xs text-slate-400">
              {t('noLessons')}
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {classLessons.map((lesson) => (
                <li key={lesson.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-3.5">
                  <time dateTime={lesson.scheduledAt} className="text-xs font-semibold text-sky-300">
                    {formatStudentDateTime(lesson.scheduledAt, locale, true)}
                  </time>
                  <p className="mt-1 text-sm font-medium text-white">
                    {isEn ? lesson.topicEn ?? lesson.topic : lesson.topic}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <FileText className="h-5 w-5 text-amber-300" aria-hidden="true" />
            <span>{t('upcomingAssignments')}</span>
          </h2>
          {classAssignments.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[#334155] p-6 text-center text-xs text-slate-400">
              {t('noAssignments')}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {classAssignments.map((assignment) => (
                <li key={assignment.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-3.5">
                  <p className="text-sm font-semibold text-white">
                    {isEn ? assignment.titleEn ?? assignment.title : assignment.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {t('dueDate', { date: formatStudentDateTime(assignment.dueDate, locale, true) })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Medal className="h-5 w-5 text-emerald-300" aria-hidden="true" />
          <span>{t('resultsTitle')}</span>
        </h2>
        {classResults.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[#334155] p-6 text-center text-xs text-slate-400">
            {t('noResults')}
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {classResults.map((result) => (
              <li key={result.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {isEn ? result.assignmentTitleEn ?? result.assignmentTitle : result.assignmentTitle}
                  </p>
                  <span className="rounded-lg bg-emerald-400/15 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-200">
                    {result.score}/10
                  </span>
                </div>
                <p className="mt-2 border-l-2 border-sky-400/40 pl-3 text-xs leading-5 text-slate-300">
                  {isEn ? result.feedbackEn ?? result.feedback : result.feedback}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
