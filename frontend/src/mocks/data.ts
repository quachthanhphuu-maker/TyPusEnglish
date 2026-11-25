import {
  ClassSummaryDTO,
  LessonSummaryDTO,
  AssignmentDTO,
  TuitionSummaryDTO,
  ParentReportSnapshotDTO,
  VocabularySetDTO,
  StudyStreakDTO,
  TutorSubmissionReviewDTO,
  StudentDashboardAssignmentDTO,
  StudentPublishedResultDTO,
  ParentChildDashboardDTO,
} from '@/types';

function sampleDate(dayOffset: number, hour = 16, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const MOCK_CLASSES: ClassSummaryDTO[] = [
  {
    id: 'cls_01',
    name: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    nameEn: 'Advanced English Communication 1:1',
    subject: 'Tiếng Anh',
    subjectEn: 'English',
    gradeLevel: 'Lớp 11',
    gradeLevelEn: 'Grade 11',
    classType: 'ONE_TO_ONE',
    studentCount: 1,
    nextLesson: sampleDate(0, 16),
  },
  {
    id: 'cls_02',
    name: 'Toán Học & Tư Duy Logic 10A',
    nameEn: 'Mathematics & Logical Thinking 10A',
    subject: 'Toán',
    subjectEn: 'Mathematics',
    gradeLevel: 'Lớp 10',
    gradeLevelEn: 'Grade 10',
    classType: 'SMALL_GROUP',
    studentCount: 6,
    nextLesson: sampleDate(1, 17, 30),
  },
  {
    id: 'cls_03',
    name: 'IELTS Writing & Speaking Focus',
    nameEn: 'IELTS Writing & Speaking Focus',
    subject: 'Tiếng Anh',
    subjectEn: 'English',
    gradeLevel: 'Luyện thi',
    gradeLevelEn: 'Test preparation',
    classType: 'SMALL_GROUP',
    studentCount: 4,
    nextLesson: sampleDate(2, 18),
  },
];

export const MOCK_LESSONS: LessonSummaryDTO[] = [
  {
    id: 'les_01',
    classId: 'cls_01',
    scheduledAt: sampleDate(0, 16),
    topic: 'Unit 4: Advanced Relative Clauses & Complex Sentences',
    topicEn: 'Unit 4: Advanced Relative Clauses & Complex Sentences',
    attendedCount: 1,
    totalStudents: 1,
    status: 'SCHEDULED',
  },
  {
    id: 'les_02',
    classId: 'cls_02',
    scheduledAt: sampleDate(1, 17, 30),
    topic: 'Phương trình bậc hai & Định lý Vi-et ứng dụng',
    topicEn: 'Quadratic equations & applications of Vieta’s formulas',
    attendedCount: 6,
    totalStudents: 6,
    status: 'SCHEDULED',
  },
  {
    id: 'les_03',
    classId: 'cls_03',
    scheduledAt: sampleDate(2, 18),
    topic: 'IELTS Speaking: Structuring a clear Part 2 response',
    topicEn: 'IELTS Speaking: Structuring a clear Part 2 response',
    attendedCount: 4,
    totalStudents: 4,
    status: 'SCHEDULED',
  },
];

export const MOCK_ASSIGNMENTS: AssignmentDTO[] = [
  {
    id: 'asm_01',
    classId: 'cls_01',
    title: 'Essay: The Impact of Artificial Intelligence on Daily Education',
    titleEn: 'Essay: The Impact of Artificial Intelligence on Daily Education',
    dueDate: sampleDate(2, 23, 59),
    totalSubmissions: 1,
    gradedCount: 1,
    totalStudents: 1,
  },
  {
    id: 'asm_02',
    classId: 'cls_02',
    title: 'Bài tập tuần 12: Biện luận nghiệm phương trình bậc 2',
    titleEn: 'Week 12: Analyze the roots of a quadratic equation',
    dueDate: sampleDate(3, 18),
    totalSubmissions: 4,
    gradedCount: 2,
    totalStudents: 6,
  },
];

export const MOCK_TUTOR_SUBMISSIONS: TutorSubmissionReviewDTO[] = [
  {
    id: 'sub_01',
    studentName: 'Nguyễn Minh Anh',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    classNameEn: 'Advanced English Communication 1:1',
    assignmentTitle: 'Essay: AI in everyday education',
    assignmentTitleEn: 'Essay: AI in everyday education',
    submittedAt: sampleDate(0, 9, 20),
    status: 'UNGRADED',
  },
  {
    id: 'sub_02',
    studentName: 'Trần Gia Bảo',
    className: 'Toán Học & Tư Duy Logic 10A',
    classNameEn: 'Mathematics & Logical Thinking 10A',
    assignmentTitle: 'Bài tập tuần 12: Phương trình bậc hai',
    assignmentTitleEn: 'Week 12: Quadratic equations practice',
    submittedAt: sampleDate(-1, 20, 10),
    status: 'UNGRADED',
  },
];

export const MOCK_STUDENT_ASSIGNMENTS: StudentDashboardAssignmentDTO[] = [
  {
    id: 'stu_asm_01',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    classNameEn: 'Advanced English Communication 1:1',
    title: 'Viết đoạn văn: Một ngày học tập hiệu quả',
    titleEn: 'Write a paragraph: A productive study day',
    dueDate: sampleDate(1, 23, 59),
    status: 'NOT_SUBMITTED',
  },
  {
    id: 'stu_asm_02',
    className: 'Toán Học & Tư Duy Logic 10A',
    classNameEn: 'Mathematics & Logical Thinking 10A',
    title: 'Phiếu luyện tập: Hệ thức Vi-et',
    titleEn: 'Practice sheet: Vieta’s formulas',
    dueDate: sampleDate(3, 18),
    status: 'SUBMITTED',
  },
  {
    id: 'stu_asm_03',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    classNameEn: 'Advanced English Communication 1:1',
    title: 'Bài đọc hiểu: Learning in the digital age',
    titleEn: 'Reading: Learning in the digital age',
    dueDate: sampleDate(-2, 18),
    status: 'GRADED',
  },
];

export const MOCK_STUDENT_RESULTS: StudentPublishedResultDTO[] = [
  {
    id: 'result_01',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    classNameEn: 'Advanced English Communication 1:1',
    assignmentTitle: 'Bài đọc hiểu: Learning in the digital age',
    assignmentTitleEn: 'Reading: Learning in the digital age',
    score: 9.2,
    publishedAt: sampleDate(-1, 15),
    feedback: 'Lập luận rõ ràng; chú ý bổ sung ví dụ cụ thể cho ý chính.',
    feedbackEn: 'Clear reasoning; add a specific example to support the main point.',
  },
];

export const MOCK_PARENT_CHILDREN: ParentChildDashboardDTO[] = [
  {
    id: 'student_01',
    name: 'Nguyễn Minh Anh',
    gradeLevel: 'Lớp 11',
    className: 'Tiếng Anh Giao Tiếp Nâng Cao 1-1',
    classNameEn: 'Advanced English Communication 1:1',
    tutorName: 'Phú Thanh',
    schedule: [
      { scheduledAt: sampleDate(1, 16), topic: 'Unit 5: Expressing opinions with confidence', topicEn: 'Unit 5: Expressing opinions with confidence' },
      { scheduledAt: sampleDate(4, 16), topic: 'Listening practice: Understanding different accents', topicEn: 'Listening practice: Understanding different accents' },
    ],
    attendancePresent: 8,
    attendanceTotal: 8,
    averageScore: 9.2,
    feedback: 'Minh Anh tiến bộ đều, chủ động diễn đạt ý kiến và vận dụng tốt cấu trúc mới.',
    feedbackEn: 'Minh Anh is making steady progress, sharing ideas confidently, and applying new structures well.',
    progress: [
      { skill: 'listening', percentage: 88 },
      { skill: 'speaking', percentage: 94 },
      { skill: 'writing', percentage: 82 },
      { skill: 'grammar', percentage: 91 },
    ],
  },
  {
    id: 'student_02',
    name: 'Trần Gia Bảo',
    gradeLevel: 'Lớp 10',
    className: 'Toán Học & Tư Duy Logic 10A',
    classNameEn: 'Mathematics & Logical Thinking 10A',
    tutorName: 'Phú Thanh',
    schedule: [
      { scheduledAt: sampleDate(2, 17, 30), topic: 'Phương trình bậc hai: luyện tập vận dụng', topicEn: 'Quadratic equations: applied practice' },
      { scheduledAt: sampleDate(5, 17, 30), topic: 'Hàm số bậc hai và đồ thị', topicEn: 'Quadratic functions and graphs' },
    ],
    attendancePresent: 5,
    attendanceTotal: 6,
    averageScore: 8.1,
    feedback: 'Gia Bảo đã nắm chắc phương pháp; cần trình bày các bước giải đầy đủ hơn.',
    feedbackEn: 'Gia Bảo understands the method well and should show each solution step more fully.',
    progress: [
      { skill: 'problemSolving', percentage: 78 },
      { skill: 'algebra', percentage: 84 },
    ],
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
