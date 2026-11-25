import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectParentChild } from '@/modules/dashboards/lib/select-parent-child';
import { parentService, studentService, tutorService } from '@/services/api-client';

describe('role dashboard mock data', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true');
  });

  it('provides a tutor schedule and only submissions that still need grading', async () => {
    const [lessons, submissions] = await Promise.all([
      tutorService.getLessons(),
      tutorService.getSubmissionsToGrade(),
    ]);

    expect(lessons.length).toBeGreaterThan(0);
    expect(submissions.length).toBeGreaterThan(0);
    expect(submissions.every((submission) => submission.status === 'UNGRADED')).toBe(true);
  });

  it('provides student schedules, pending submissions, and published results', async () => {
    const [schedule, assignments, results] = await Promise.all([
      studentService.getSchedule(),
      studentService.getDashboardAssignments(),
      studentService.getPublishedResults(),
    ]);

    expect(schedule.length).toBeGreaterThan(0);
    expect(assignments.some((assignment) => assignment.status === 'NOT_SUBMITTED')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('selects the requested child and falls back safely when the selection is stale', async () => {
    const children = await parentService.getChildren();

    expect(children.length).toBeGreaterThan(1);
    expect(selectParentChild(children, children[1].id)).toEqual(children[1]);
    expect(selectParentChild(children, 'missing-child')).toEqual(children[0]);
    expect(selectParentChild([], 'missing-child')).toBeNull();
  });
});
