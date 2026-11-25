import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CalendarDays } from 'lucide-react';
import type { ClassSummaryDTO, LessonSummaryDTO } from '@/types';
import { formatStudentDateTime } from '../lib/student-helpers';

export async function StudentScheduleView({
  locale,
  basePath,
  classes,
  schedule,
}: {
  locale: 'vi' | 'en';
  basePath: string;
  classes: ClassSummaryDTO[];
  schedule: LessonSummaryDTO[];
}) {
  const isEn = locale === 'en';
  const t = await getTranslations('student');

  const statusLabel = (status: LessonSummaryDTO['status']) =>
    status === 'SCHEDULED'
      ? t('lessonStatus.scheduled')
      : status === 'COMPLETED'
        ? t('lessonStatus.completed')
        : t('lessonStatus.cancelled');

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <span>{t('portalLabel')}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{t('scheduleTitle')}</h1>
      </header>

      {schedule.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#334155] bg-[#131E2B] p-8 text-center">
          <CalendarDays aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-white">{t('scheduleTitle')}</p>
          <p className="mt-1 text-xs text-slate-400">{t('noLessons')}</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {schedule.map((lesson) => {
            const cls = classes.find((item) => item.id === lesson.classId);
            return (
              <li
                key={lesson.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex gap-3">
                  <span className="mt-1 w-1 shrink-0 rounded-full bg-sky-400/80" />
                  <div className="min-w-0">
                    <time dateTime={lesson.scheduledAt} className="text-xs font-semibold text-sky-300">
                      {formatStudentDateTime(lesson.scheduledAt, locale, true)}
                    </time>
                    <h2 className="mt-1 text-sm font-bold text-white sm:text-base">
                      {isEn ? cls?.nameEn ?? cls?.name : cls?.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {isEn ? lesson.topicEn ?? lesson.topic : lesson.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-200">
                    {statusLabel(lesson.status)}
                  </span>
                  {cls && (
                    <Link
                      href={`${basePath}/classes/${cls.id}`}
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-[#243244] bg-[#0E1722] px-3.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#334155] hover:text-white"
                    >
                      {t('viewClass')}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
