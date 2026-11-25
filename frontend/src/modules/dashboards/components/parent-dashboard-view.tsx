'use client';

import * as React from 'react';
import { CalendarDays, CheckCircle2, ChevronDown, GraduationCap, Heart, Users } from 'lucide-react';
import type { ParentChildDashboardDTO, ParentProgressSkill } from '@/types';
import { selectParentChild } from '../lib/select-parent-child';

type ParentLabels = {
  title: string;
  description: string;
  notice: string;
  selectChild: string;
  selectedChild: string;
  classLabel: string;
  gradeLabel: string;
  tutorLabel: string;
  nextLesson: string;
  scheduleTitle: string;
  learningProgress: string;
  attendance: string;
  averageScore: string;
  publishedFeedback: string;
  skillNames: Record<ParentProgressSkill, string>;
  noChildren: string;
};

export function ParentDashboardView({
  students,
  labels,
  locale,
}: {
  students: ParentChildDashboardDTO[];
  labels: ParentLabels;
  locale: 'vi' | 'en';
}) {
  const [selectedId, setSelectedId] = React.useState(students[0]?.id ?? '');
  const child = selectParentChild(students, selectedId);
  const percent = child
    ? Math.round((child.attendancePresent / Math.max(child.attendanceTotal, 1)) * 100)
    : 0;

  const dateTime = (value: string) => new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(value));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">TyPusEnglish</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{labels.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{labels.description}</p>
        </div>
        {students.length > 0 && (
          <label className="w-full sm:w-72">
            <span className="mb-1.5 block text-sm font-medium">{labels.selectChild}</span>
            <span className="relative block">
              <select
                aria-label={labels.selectChild}
                value={child?.id ?? ''}
                onChange={(event) => setSelectedId(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border bg-background px-3 pr-10 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {students.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </span>
          </label>
        )}
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
        <Heart aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" />
        <p>{labels.notice}</p>
      </div>

      {!child ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <Users aria-hidden="true" className="mx-auto mb-3 h-8 w-8" />
          {labels.noChildren}
        </div>
      ) : (
        <>
          <section aria-labelledby="parent-child-overview" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <p id="parent-child-overview" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{labels.selectedChild}</p>
                  <h2 className="mt-0.5 text-xl font-bold">{child.name}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:min-w-64">
                <span className="text-muted-foreground">{labels.classLabel}</span>
                <span className="text-right font-medium">{locale === 'en' ? child.classNameEn ?? child.className : child.className}</span>
                <span className="text-muted-foreground">{labels.gradeLabel}</span>
                <span className="text-right font-medium">{child.gradeLevel}</span>
                <span className="text-muted-foreground">{labels.tutorLabel}</span>
                <span className="text-right font-medium">{child.tutorName}</span>
              </div>
            </div>
          </section>

          <section aria-label={labels.selectedChild} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-600" />{labels.attendance}</div>
              <p className="mt-3 text-2xl font-bold">{child.attendancePresent}<span className="text-base font-medium text-muted-foreground"> / {child.attendanceTotal}</span></p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={labels.attendance} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{labels.averageScore}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{child.averageScore}<span className="text-base font-medium text-muted-foreground"> / 10</span></p>
              <p className="mt-2 text-xs text-muted-foreground">{locale === 'en' ? child.classNameEn ?? child.className : child.className}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-muted-foreground">{labels.nextLesson}</p>
              <p className="mt-3 text-base font-semibold">{dateTime(child.schedule[0]?.scheduledAt ?? '')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{locale === 'en' ? child.schedule[0]?.topicEn ?? child.schedule[0]?.topic : child.schedule[0]?.topic}</p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="parent-schedule-title" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <h2 id="parent-schedule-title" className="flex items-center gap-2 text-lg font-semibold"><CalendarDays aria-hidden="true" className="h-5 w-5 text-primary" />{labels.scheduleTitle}</h2>
              <ol className="mt-4 space-y-3">
                {child.schedule.map((lesson) => (
                  <li key={lesson.scheduledAt} className="flex gap-3 rounded-xl bg-muted/50 p-3">
                    <span className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-primary/60" />
                    <div className="min-w-0">
                      <time dateTime={lesson.scheduledAt} className="text-xs font-semibold text-primary">{dateTime(lesson.scheduledAt)}</time>
                      <p className="mt-1 text-sm font-medium">{locale === 'en' ? lesson.topicEn ?? lesson.topic : lesson.topic}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="parent-progress-title" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <h2 id="parent-progress-title" className="text-lg font-semibold">{labels.learningProgress}</h2>
              <ul className="mt-5 space-y-4">
                {child.progress.map((item) => (
                  <li key={item.skill}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{labels.skillNames[item.skill]}</span>
                      <span className="tabular-nums text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={labels.skillNames[item.skill]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percentage}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section aria-labelledby="parent-feedback-title" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <h2 id="parent-feedback-title" className="text-base font-semibold">{labels.publishedFeedback}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{locale === 'en' ? child.feedbackEn ?? child.feedback : child.feedback}</p>
          </section>
        </>
      )}
    </div>
  );
}
