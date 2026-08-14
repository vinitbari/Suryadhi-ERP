import { describe, it, expect, vi, beforeEach } from 'vitest';
import { studentService } from '../students/service';
import { admissionService } from '../admission/service';
import { transfersService } from '../transfers/service';
import { getEffectiveSchoolId } from '../../utils/helpers';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    student: {
      findFirst: vi.fn(),
    },
    studentDocument: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    admission: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    transferOutRequest: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('Multi-Tenant Cross-School Data Scoping & Isolation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEffectiveSchoolId Helper', () => {
    it('should strictly return user.schoolId for franchise roles (SCHOOL_ADMIN)', () => {
      const mockReq = {
        user: { role: 'SCHOOL_ADMIN', schoolId: 'school-A' },
        query: { schoolId: 'school-B' }, // Attempt to query School B
      };

      const schoolId = getEffectiveSchoolId(mockReq);
      expect(schoolId).toBe('school-A'); // Must ignore query override and enforce assigned school
    });

    it('should allow SUPER_ADMIN to query specific school via query params', () => {
      const mockReq = {
        user: { role: 'SUPER_ADMIN', schoolId: undefined },
        query: { schoolId: 'school-B' },
      };

      const schoolId = getEffectiveSchoolId(mockReq);
      expect(schoolId).toBe('school-B');
    });
  });

  describe('Cross-Tenant Data Isolation (School A vs School B)', () => {
    it('should reject fetching student profile if student belongs to School B and requested by School A', async () => {
      (prisma.student.findFirst as any).mockResolvedValue(null);

      const profile = await studentService.getStudentProfile('student-b-1', 'school-A');
      expect(profile).toBeNull();
      expect(prisma.student.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'student-b-1',
            admissions: { some: { schoolId: 'school-A', deletedAt: null } },
          },
        })
      );
    });

    it('should throw Error when attempting to verify a document belonging to another school', async () => {
      (prisma.studentDocument.findFirst as any).mockResolvedValue(null);

      await expect(
        studentService.verifyDocument('doc-b-1', { verified: true }, 'school-A')
      ).rejects.toThrow('Document not found or access denied');
    });

    it('should throw 404 AppError when updating status of a transfer request belonging to another school', async () => {
      (prisma.transferOutRequest.findFirst as any).mockResolvedValue(null);

      await expect(
        transfersService.updateStatus('transfer-b-1', { status: 'COMPLETED' }, 'school-A')
      ).rejects.toThrow('Transfer request not found or access denied');
    });
  });
});
