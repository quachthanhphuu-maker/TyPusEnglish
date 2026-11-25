import { getTranslations } from 'next-intl/server';
import { BookOpen, CalendarDays, ClipboardCheck, GraduationCap, Users } from 'lucide-react';
import type { ClassSummaryDTO, LessonSummaryDTO, TutorSubmissionReviewDTO } from '@/types';

interface TutorDashboardViewProps {
  locale: 'vi' | 'en';
  classes: ClassSummaryDTO[];
  lessons: LessonSummaryDTO[];
  submissions: TutorSubmissionReviewDTO[];
  tutorName?: string;
}

export async function TutorDashboardView({
  locale,
  classes,
  lessons,
  submissions,
  tutorName = 'Phú Thanh',
}: TutorDashboardViewProps) {
  const t = await getTranslations('tutor');
  const isEn = locale === 'en';
  const students = classes.reduce((count, item) => count + item.studentCount, 0);

  const dateTime = (value: string) =>
    new Intl.DateTimeFormat(isEn ? 'en-US' : 'vi-VN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));

  const hour = new Date().getHours();
  const greetingTime =
    hour < 12
      ? t('greetingMorning')
      : hour < 18
        ? t('greetingAfternoon')
        : t('greetingEvening');

  const stats = [
    { label: t('quickStats.activeClasses'), value: classes.length, icon: GraduationCap, color: 'text-sky-300 bg-sky-400/10' },
    { label: t('students'), value: students, icon: Users, color: 'text-violet-300 bg-violet-400/10' },
    { label: t('upcomingLessons'), value: lessons.length, icon: CalendarDays, color: 'text-emerald-300 bg-emerald-400/10' },
    { label: t('quickStats.ungradedAssignments'), value: submissions.length, icon: ClipboardCheck, color: 'text-amber-300 bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="rounded-2xl border border-[#1E293B] bg-gradient-to-br from-[#152536] to-[#111A26] p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          TyPusEnglish · {t('todayOverview')}
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {t('greeting', { time: greetingTime, name: tutorName })}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{t('description')}</p>
      </header>

      <section aria-label={t('todayOverview')} className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section id="schedule" aria-labelledby="tutor-schedule-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="tutor-schedule-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-sky-300" />
              {t('scheduleTitle')}
            </h2>
            <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
              {lessons.length}
            </span>
          </div>
          {lessons.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
              {t('noLessons')}
            </p>
          ) : (
            <ol className="space-y-3">
              {lessons.map((lesson) => {
                const cls = classes.find((item) => item.id === lesson.classId);
                return (
                  <li key={lesson.id} className="flex gap-3 rounded-xl border border-[#243244] bg-[#0E1722] p-3 sm:gap-4 sm:p-4">
                    <span className="mt-1 h-auto w-1 shrink-0 rounded-full bg-sky-400/80" />
                    <div className="min-w-0 flex-1">
                      <time dateTime={lesson.scheduledAt} className="text-xs font-semibold text-sky-300">
                        {dateTime(lesson.scheduledAt)}
                      </time>
                      <h3 className="mt-1 text-sm font-semibold text-white">
                        {isEn ? cls?.nameEn ?? cls?.name : cls?.name}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {isEn ? lesson.topicEn ?? lesson.topic : lesson.topic}
                      </p>
                    </div>
                    <span className="hidden shrink-0 self-center rounded-lg bg-[#182535] px-2.5 py-1.5 text-xs text-slate-300 sm:block">
                      {cls?.studentCount ?? 0} {isEn ? 'students' : 'học sinh'}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section id="grading" aria-labelledby="tutor-grading-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="tutor-grading-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
              <ClipboardCheck aria-hidden="true" className="h-5 w-5 text-amber-300" />
              {t('gradingTitle')}
            </h2>
            <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
              {submissions.length}
            </span>
          </div>
          {submissions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
              {t('noGrading')}
            </p>
          ) : (
            <ul className="space-y-3">
              {submissions.map((submission) => (
                <li key={submission.id} className="rounded-xl border border-[#243244] bg-[#0E1722] p-3 sm:p-4">
                  <p className="text-sm font-semibold text-white">
                    {isEn ? submission.assignmentTitleEn ?? submission.assignmentTitle : submission.assignmentTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {submission.studentName} · {isEn ? submission.classNameEn ?? submission.className : submission.className}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-200">
                    <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                    {t('submittedAt', { date: dateTime(submission.submittedAt) })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section id="classes" aria-labelledby="tutor-classes-title" className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="tutor-classes-title" className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
            <GraduationCap aria-hidden="true" className="h-5 w-5 text-violet-300" />
            {t('classesTitle')}
          </h2>
          <span className="text-xs text-slate-400">{classes.length}</span>
        </div>
        {classes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#334155] p-6 text-center text-sm text-slate-400">
            {isEn ? 'No classes to show yet.' : 'Chưa có lớp học để hiển thị.'}
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {classes.map((item) => (
              <li key={item.id} className="flex min-w-0 items-start gap-3 rounded-xl border border-[#243244] bg-[#0E1722] p-3 sm:p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <GraduationCap aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {isEn ? item.nameEn ?? item.name : item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {isEn ? item.subjectEn ?? item.subject : item.subject} · {isEn ? item.gradeLevelEn ?? item.gradeLevel : item.gradeLevel}
                  </p>
                  <p className="mt-2 text-xs text-slate-300">{t('lessonCount', { count: item.studentCount })}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
