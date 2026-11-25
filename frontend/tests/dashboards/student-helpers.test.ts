import { describe, expect, it } from 'vitest';
import {
  filterStudentAssignments,
  findAuthorizedStudentClass,
  getStudentDisplayName,
  getStudentInitials,
} from '@/modules/dashboards/lib/student-helpers';
import { MOCK_CLASSES, MOCK_STUDENT_ASSIGNMENTS } from '@/mocks/data';

describe('student dashboard helpers', () => {
  it('resolves display name from name, username, or email local part', () => {
    expect(getStudentDisplayName({ name: 'Minh Anh', username: 'ma', email: 'ma@example.com' }, 'Student')).toBe('Minh Anh');
    expect(getStudentDisplayName({ name: '  ', username: 'minhanh', email: 'ma@example.com' }, 'Student')).toBe('minhanh');
    expect(getStudentDisplayName({ name: null, username: null, email: 'student@example.com' }, 'Student')).toBe('student');
    expect(getStudentDisplayName({ name: null, username: null, email: null }, 'Student')).toBe('Student');
  });

  it('computes initials safely', () => {
    expect(getStudentInitials('Minh Anh')).toBe('MA');
    expect(getStudentInitials('Lan')).toBe('LA');
    expect(getStudentInitials('   ')).toBe('ST');
  });

  it('filters assignments by status and search query', () => {
    expect(filterStudentAssignments(MOCK_STUDENT_ASSIGNMENTS, 'ALL', '')).toHaveLength(
      MOCK_STUDENT_ASSIGNMENTS.length,
    );
    expect(filterStudentAssignments(MOCK_STUDENT_ASSIGNMENTS, 'NOT_SUBMITTED', '')).toHaveLength(1);
    expect(filterStudentAssignments(MOCK_STUDENT_ASSIGNMENTS, 'ALL', 'vi-et')).toHaveLength(1);
    expect(filterStudentAssignments(MOCK_STUDENT_ASSIGNMENTS, 'GRADED', 'vi-et')).toHaveLength(0);
  });

  it('returns only classes present in the student authorized list', () => {
    const authorized = MOCK_CLASSES.slice(0, 2);
    expect(findAuthorizedStudentClass(authorized, 'cls_01')?.id).toBe('cls_01');
    expect(findAuthorizedStudentClass(authorized, 'cls_03')).toBeNull();
    expect(findAuthorizedStudentClass(authorized, 'unknown-id')).toBeNull();
  });
});
