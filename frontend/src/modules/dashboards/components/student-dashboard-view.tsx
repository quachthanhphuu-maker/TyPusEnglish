import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Medal,
} from 'lucide-react';
import type {
  ClassSummaryDTO,
  LessonSummaryDTO,
  StudentDashboardAssignmentDTO,
  StudentPublishedResultDTO,
} from '@/types';
import { formatStudentDateTime } from '../lib/student-helpers';

interface StudentDashboardViewProps {
  locale: 'vi' | 'en';
  basePath: string;
  studentName: string;
  classes: ClassSummaryDTO[];
  schedule: LessonSummaryDTO[];
  assignments: StudentDashboardAssignmentDTO[];
  results: StudentPublishedResultDTO[];
}

export async function StudentDashboardView({
  locale,
  basePath,
  studentName,
  classes,
  schedule,
  assignments,
  results,
}: StudentDashboardViewProps) {
  const isEn = locale === 'en';
  const t = await getTranslations('student');

  const hour = new Date().getHours();
  const greetingTime =
    hour < 12
      ? t('greetingMorning')
      : hour < 18
        ? t('greetingAfternoon')
        : t('greetingEvening');

  const pendingCount = assignments.filter((item) => item.status === 'NOT_SUBMITTED').length;
  const averageScore = results.length
    ? (results.reduce((sum, item) => sum + item.score, 0) / results.length).toFixed(1)
    : '—';

  const statusLabel = (status: StudentDashboardAssignmentDTO['status']) =>
    status === 'NOT_SUBMITTED'
      ? t('notSubmitted')
      : status === 'SUBMITTED'
        ? t('submitted')
        : t('graded');

  const statusClass = (status: StudentDashboardAssignmentDTO['status']) =>
    status === 'NOT_SUBMITTED'
      ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
      : status === 'SUBMITTED'
        ? 'border-sky-400/30 bg-sky-400/10 text-sky-200'
        : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';

  const stats = [
    { label: t('myClasses'), value: classes.length, icon: BookOpen, color: 'bg-sky-400/10 text-sky-300' },
    { label: t('upcomingAssignments'), value: pendingCount, icon: ClipboardCheck, color: 'bg-amber-400/10 text-amber-300' },
    { label: t('scoreLabel'), value: `${averageScore} / 10`, icon: Medal, color: 'bg-emerald-400/10 text-emerald-300' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="rounded-2xl border border-[#1E293B] bg-gradient-to-br from-[#152536] to-[#111A26] p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          TyPusEnglish · {t('portalLabel')}
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {t('greeting', { time: greetingTime, name: studentName })}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{t('description')}</p>
      </header>

      <section aria-label={t('title')} className="grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-white sm:text-3xl">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section aria-labelledby="student-schedule-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="student-schedule-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-sky-300" />
              {t('scheduleTitle')}
            </h2>
            <Link
              href={`${basePath}/schedule`}
              className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {schedule.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
              {t('noLessons')}
            </p>
          ) : (
            <ol className="space-y-3">
              {schedule.map((lesson) => {
                const cls = classes.find((item) => item.id === lesson.classId);
                return (
                  <li key={lesson.id} className="flex gap-3 rounded-xl border border-[#243244] bg-[#0E1722] p-3 sm:gap-4 sm:p-4">
                    <span className="mt-1 h-auto w-1 shrink-0 rounded-full bg-sky-400/80" />
                    <div className="min-w-0 flex-1">
                      <time dateTime={lesson.scheduledAt} className="text-xs font-semibold text-sky-300">
                        {formatStudentDateTime(lesson.scheduledAt, locale, true)}
                      </time>
                      <h3 className="mt-1 text-sm font-semibold text-white">
                        {isEn ? cls?.nameEn ?? cls?.name : cls?.name}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {isEn ? lesson.topicEn ?? lesson.topic : lesson.topic}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section aria-labelledby="student-assignments-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 id="student-assignments-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
                <FileText aria-hidden="true" className="h-5 w-5 text-amber-300" />
                {t('upcomingAssignments')}
              </h2>
              <p className="mt-1 text-xs text-slate-400">{t('assignmentHint')}</p>
            </div>
            <Link
              href={`${basePath}/assignments`}
              className="inline-flex min-h-[36px] shrink-0 items-center gap-1 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
              {t('noAssignments')}
            </p>
          ) : (
            <ul className="space-y-3">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {isEn ? assignment.titleEn ?? assignment.title : assignment.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {isEn ? assignment.classNameEn ?? assignment.className : assignment.className}
                      </p>
                    </div>
                    <span className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(assignment.status)}`}>
                      {statusLabel(assignment.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-300">
                    {t('dueDate', { date: formatStudentDateTime(assignment.dueDate, locale) })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="student-classes-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="student-classes-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
            <GraduationCap aria-hidden="true" className="h-5 w-5 text-violet-300" />
            {t('myClasses')}
          </h2>
          <Link
            href={`${basePath}/classes`}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {classes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
            {t('noClasses')}
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {classes.map((item) => (
              <li key={item.id}>
                <Link
                  href={`${basePath}/classes/${item.id}`}
                  className="flex min-h-[44px] items-start gap-3 rounded-xl border border-[#243244] bg-[#0E1722] p-3.5 transition-colors hover:border-[#0EA5E9]/50 hover:bg-[#142030] sm:p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <GraduationCap aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {isEn ? item.nameEn ?? item.name : item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {isEn ? item.subjectEn ?? item.subject : item.subject} ·{' '}
                      {isEn ? item.gradeLevelEn ?? item.gradeLevel : item.gradeLevel}
                    </p>
                    {item.nextLesson && (
                      <p className="mt-2 text-xs text-sky-300">
                        {t('nextLessonLabel')}: {formatStudentDateTime(item.nextLesson, locale, true)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="student-results-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="student-results-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
            <Medal aria-hidden="true" className="h-5 w-5 text-emerald-300" />
            {t('resultsTitle')}
          </h2>
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
            {results.length}
          </span>
        </div>

        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
            {t('noResults')}
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {results.map((result) => (
              <li key={result.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {isEn ? result.assignmentTitleEn ?? result.assignmentTitle : result.assignmentTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {isEn ? result.classNameEn ?? result.className : result.className}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-emerald-400/15 px-2.5 py-1.5 text-sm font-bold tabular-nums text-emerald-200">
                    {result.score}/10
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {t('publishedAt', { date: formatStudentDateTime(result.publishedAt, locale) })}
                </p>
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
