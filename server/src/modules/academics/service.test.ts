import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AcademicsService } from './service';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    subject: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    exam: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    marksEntry: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn((ops) => Promise.all(ops)),
  },
}));

describe('AcademicsService Unit Tests', () => {
  let academicsService: AcademicsService;

  beforeEach(() => {
    academicsService = new AcademicsService();
    vi.clearAllMocks();
  });

  describe('createSubject', () => {
    it('should create subject with schoolId and programId', async () => {
      const mockSubject = { id: 'sub-1', schoolId: 'sch-1', name: 'Mathematics', code: 'MATH-01' };
      (prisma.subject.create as any).mockResolvedValue(mockSubject);

      const result = await academicsService.createSubject('sch-1', {
        programId: 'prog-1',
        name: 'Mathematics',
        code: 'MATH-01',
      });

      expect(result).toEqual(mockSubject);
      expect(prisma.subject.create).toHaveBeenCalledWith({
        data: {
          schoolId: 'sch-1',
          programId: 'prog-1',
          name: 'Mathematics',
          code: 'MATH-01',
          description: undefined,
        },
      });
    });
  });

  describe('enterMarks', () => {
    it('should upsert marks records inside a transaction', async () => {
      const mockUpsert = { id: 'me-1', marksObtained: 85 };
      (prisma.marksEntry.upsert as any).mockResolvedValue(mockUpsert);

      const result = await academicsService.enterMarks('user-teacher-1', {
        assessmentId: 'ass-1',
        records: [
          { studentId: 'stud-1', marksObtained: 85, remarks: 'Excellent' },
          { studentId: 'stud-2', marksObtained: 90, remarks: 'Great' },
        ],
      });

      expect(result).toHaveLength(2);
      expect(prisma.marksEntry.upsert).toHaveBeenCalledTimes(2);
    });
  });
});
