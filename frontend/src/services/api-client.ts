import {
  ClassSummaryDTO,
  LessonSummaryDTO,
  AssignmentDTO,
  TuitionSummaryDTO,
  ParentReportSnapshotDTO,
  VocabularySetDTO,
  StudyStreakDTO,
  ActionResult,
} from '@/types';
import {
  MOCK_CLASSES,
  MOCK_LESSONS,
  MOCK_ASSIGNMENTS,
  MOCK_TUITION,
  MOCK_PARENT_REPORTS,
  MOCK_VOCABULARY_SETS,
  MOCK_STREAK,
} from '@/mocks/data';

// Toggle mock mode through env variable or default to true for Frontend Foundation
export const isMockMode = () => {
  return process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
};

export const tutorService = {
  async getClasses(): Promise<ClassSummaryDTO[]> {
    if (isMockMode()) {
      return [...MOCK_CLASSES];
    }
    // Future: Call real Backend API Route Handler
    throw new Error('Backend API not yet connected');
  },

  async getLessons(classId?: string): Promise<LessonSummaryDTO[]> {
    if (isMockMode()) {
      if (classId) return MOCK_LESSONS.filter((l) => l.classId === classId);
      return [...MOCK_LESSONS];
    }
    throw new Error('Backend API not yet connected');
  },

  async getTuitionSummary(classId: string): Promise<TuitionSummaryDTO | null> {
    if (isMockMode()) {
      return MOCK_TUITION[classId] || null;
    }
    throw new Error('Backend API not yet connected');
  },
};

export const studentService = {
  async getMyClasses(): Promise<ClassSummaryDTO[]> {
    if (isMockMode()) {
      return MOCK_CLASSES.slice(0, 2);
    }
    throw new Error('Backend API not yet connected');
  },

  async getAssignments(): Promise<AssignmentDTO[]> {
    if (isMockMode()) {
      return [...MOCK_ASSIGNMENTS];
    }
    throw new Error('Backend API not yet connected');
  },
};

export const parentService = {
  async getReports(): Promise<ParentReportSnapshotDTO[]> {
    if (isMockMode()) {
      return [...MOCK_PARENT_REPORTS];
    }
    throw new Error('Backend API not yet connected');
  },
};

export const selfStudyService = {
  async getVocabularySets(): Promise<VocabularySetDTO[]> {
    if (isMockMode()) {
      return [...MOCK_VOCABULARY_SETS];
    }
    throw new Error('Backend API not yet connected');
  },

  async getStreak(): Promise<StudyStreakDTO> {
    if (isMockMode()) {
      return { ...MOCK_STREAK };
    }
    throw new Error('Backend API not yet connected');
  },
};
