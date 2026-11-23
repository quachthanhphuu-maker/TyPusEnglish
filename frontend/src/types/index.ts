export type UserRole = 'tutor' | 'student' | 'parent' | 'independent_learner';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Class & Student Profile DTOs
export interface ClassSummaryDTO {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  classType: 'ONE_TO_ONE' | 'SMALL_GROUP';
  studentCount: number;
  nextLesson?: string;
}

export interface StudentProfileDTO {
  id: string;
  name: string;
  hasAccount: boolean;
  email?: string;
  attendanceRate: number;
  averageGrade?: number;
  linkedParentsCount: number;
}

// Lesson & Attendance DTOs
export interface LessonSummaryDTO {
  id: string;
  classId: string;
  scheduledAt: string;
  topic: string;
  attendedCount: number;
  totalStudents: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

// Assessment & Homework DTOs
export interface AssignmentDTO {
  id: string;
  classId: string;
  title: string;
  dueDate: string;
  totalSubmissions: number;
  gradedCount: number;
  totalStudents: number;
}

// Tuition DTOs
export interface TuitionSummaryDTO {
  classId: string;
  totalCharged: number;
  totalPaid: number;
  outstandingBalance: number;
  currency: 'VND' | 'USD';
  overdueCount: number;
}

// Parent Report DTOs
export interface ParentReportSnapshotDTO {
  id: string;
  studentName: string;
  className: string;
  periodStart: string;
  periodEnd: string;
  attendancePresent: number;
  attendanceTotal: number;
  averageScore: number;
  tutorFeedback: string;
  publishedAt: string;
}

// English Self-Study DTOs
export interface VocabularySetDTO {
  id: string;
  title: string;
  cardCount: number;
  lastReviewedAt?: string;
  masteryPercentage: number;
}

export interface StudyStreakDTO {
  currentStreak: number;
  longestStreak: number;
  dailyGoalProgress: number;
  dailyGoalTarget: number;
}
