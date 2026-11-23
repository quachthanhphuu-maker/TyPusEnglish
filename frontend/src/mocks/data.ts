import {
  ClassSummaryDTO,
  LessonSummaryDTO,
  AssignmentDTO,
  TuitionSummaryDTO,
  ParentReportSnapshotDTO,
  VocabularySetDTO,
  StudyStreakDTO,
} from '@/types';

export const MOCK_CLASSES: ClassSummaryDTO[] = [
  {
    id: 'cls_01',
    name: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    subject: 'Tiếng Anh',
    gradeLevel: 'Lớp 11',
    classType: 'ONE_TO_ONE',
    studentCount: 1,
    nextLesson: '2026-11-24T14:00:00Z',
  },
  {
    id: 'cls_02',
    name: 'Toán Học & Tư Duy Logic 10A',
    subject: 'Toán',
    gradeLevel: 'Lớp 10',
    classType: 'SMALL_GROUP',
    studentCount: 6,
    nextLesson: '2026-11-25T09:30:00Z',
  },
  {
    id: 'cls_03',
    name: 'IELTS Writing & Speaking Focus',
    subject: 'Tiếng Anh',
    gradeLevel: 'Luyện thi',
    classType: 'SMALL_GROUP',
    studentCount: 4,
    nextLesson: '2026-11-26T18:00:00Z',
  },
];

export const MOCK_LESSONS: LessonSummaryDTO[] = [
  {
    id: 'les_01',
    classId: 'cls_01',
    scheduledAt: '2026-11-24T14:00:00Z',
    topic: 'Unit 4: Advanced Relative Clauses & Complex Sentences',
    attendedCount: 1,
    totalStudents: 1,
    status: 'SCHEDULED',
  },
  {
    id: 'les_02',
    classId: 'cls_02',
    scheduledAt: '2026-11-25T09:30:00Z',
    topic: 'Phương trình bậc hai & Định lý Vi-et ứng dụng',
    attendedCount: 6,
    totalStudents: 6,
    status: 'SCHEDULED',
  },
];

export const MOCK_ASSIGNMENTS: AssignmentDTO[] = [
  {
    id: 'asm_01',
    classId: 'cls_01',
    title: 'Essay: The Impact of Artificial Intelligence on Daily Education',
    dueDate: '2026-11-27T23:59:00Z',
    totalSubmissions: 1,
    gradedCount: 1,
    totalStudents: 1,
  },
  {
    id: 'asm_02',
    classId: 'cls_02',
    title: 'Bài tập tuần 12: Biện luận nghiệm phương trình bậc 2',
    dueDate: '2026-11-28T18:00:00Z',
    totalSubmissions: 4,
    gradedCount: 2,
    totalStudents: 6,
  },
];

export const MOCK_TUITION: Record<string, TuitionSummaryDTO> = {
  cls_01: {
    classId: 'cls_01',
    totalCharged: 2400000,
    totalPaid: 2400000,
    outstandingBalance: 0,
    currency: 'VND',
    overdueCount: 0,
  },
  cls_02: {
    classId: 'cls_02',
    totalCharged: 7200000,
    totalPaid: 4800000,
    outstandingBalance: 2400000,
    currency: 'VND',
    overdueCount: 1,
  },
};

export const MOCK_PARENT_REPORTS: ParentReportSnapshotDTO[] = [
  {
    id: 'rpt_01',
    studentName: 'Nguyễn Minh Anh',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    periodStart: '2026-11-01',
    periodEnd: '2026-11-22',
    attendancePresent: 8,
    attendanceTotal: 8,
    averageScore: 9.2,
    tutorFeedback: 'Minh Anh nắm bắt cấu trúc câu rất nhanh, phát âm chuẩn và tự tin phản xạ trong giờ học.',
    publishedAt: '2026-11-22T10:00:00Z',
  },
];

export const MOCK_VOCABULARY_SETS: VocabularySetDTO[] = [
  {
    id: 'voc_01',
    title: 'Oxford 3000 Core Vocabulary',
    cardCount: 250,
    lastReviewedAt: '2026-11-23T08:00:00Z',
    masteryPercentage: 78,
  },
  {
    id: 'voc_02',
    title: 'IELTS Academic Writing Task 2 Collocations',
    cardCount: 120,
    lastReviewedAt: '2026-11-22T19:30:00Z',
    masteryPercentage: 45,
  },
];

export const MOCK_STREAK: StudyStreakDTO = {
  currentStreak: 14,
  longestStreak: 21,
  dailyGoalProgress: 15,
  dailyGoalTarget: 20,
};
