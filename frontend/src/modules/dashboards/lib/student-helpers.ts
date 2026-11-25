import type { ClassSummaryDTO, StudentDashboardAssignmentDTO } from '@/types';

export type AssignmentStatusFilter = 'ALL' | StudentDashboardAssignmentDTO['status'];

export function getStudentDisplayName(
  user: { name?: string | null; username?: string | null; email?: string | null },
  fallback: string,
): string {
  const trimmedName = user.name?.trim();
  if (trimmedName) return trimmedName;

  const trimmedUsername = user.username?.trim();
  if (trimmedUsername) return trimmedUsername;

  const trimmedEmail = user.email?.trim();
  if (trimmedEmail) return trimmedEmail.split('@')[0] || fallback;

  return fallback;
}

export function getStudentInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function formatStudentDateTime(
  value: string,
  locale: 'vi' | 'en',
  withTime = false,
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(
    locale === 'vi' ? 'vi-VN' : 'en-US',
    withTime
      ? { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric' },
  ).format(date);
}

export function filterStudentAssignments(
  assignments: readonly StudentDashboardAssignmentDTO[],
  statusFilter: AssignmentStatusFilter,
  query: string,
): StudentDashboardAssignmentDTO[] {
  const normalizedQuery = query.trim().toLowerCase();

  return assignments.filter((assignment) => {
    if (statusFilter !== 'ALL' && assignment.status !== statusFilter) {
      return false;
    }

    if (!normalizedQuery) return true;

    const searchable = [
      assignment.title,
      assignment.titleEn ?? '',
      assignment.className,
      assignment.classNameEn ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function findAuthorizedStudentClass(
  classes: readonly ClassSummaryDTO[],
  classId: string,
): ClassSummaryDTO | null {
  return classes.find((item) => item.id === classId) ?? null;
}
