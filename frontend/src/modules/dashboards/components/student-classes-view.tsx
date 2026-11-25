import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, BookOpen, CalendarDays, GraduationCap } from 'lucide-react';
import type { ClassSummaryDTO } from '@/types';
import { formatStudentDateTime } from '../lib/student-helpers';

export async function StudentClassesView({
  locale,
  basePath,
  classes,
}: {
  locale: 'vi' | 'en';
  basePath: string;
  classes: ClassSummaryDTO[];
}) {
  const isEn = locale === 'en';
  const t = await getTranslations('student');

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>{t('portalLabel')}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{t('myClasses')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('classesDescription')}</p>
      </header>

      {classes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#334155] bg-[#131E2B] p-8 text-center">
          <GraduationCap aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-white">{t('myClasses')}</p>
          <p className="mt-1 text-xs text-slate-400">{t('noClasses')}</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {classes.map((item) => (
            <li key={item.id} className="flex flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-[#243244] bg-[#0E1722] px-3 py-1 text-[11px] font-semibold text-slate-300">
                    {item.classType === 'ONE_TO_ONE' ? t('classTypeOneToOne') : t('classTypeSmallGroup')}
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold text-white">
                  {isEn ? item.nameEn ?? item.name : item.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {isEn ? item.subjectEn ?? item.subject : item.subject} ·{' '}
                  {isEn ? item.gradeLevelEn ?? item.gradeLevel : item.gradeLevel}
                </p>

                {item.nextLesson && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-sky-300">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {t('nextLessonLabel')}: {formatStudentDateTime(item.nextLesson, locale, true)}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-[#1E293B] pt-4">
                <Link
                  href={`${basePath}/classes/${item.id}`}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-4 py-2 text-xs font-semibold text-[#38BDF8] transition-colors hover:bg-[#0EA5E9]/20"
                >
                  <span>{t('viewClass')}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
