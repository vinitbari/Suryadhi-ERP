import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttendanceService } from './service';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    studentAttendance: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    teacherAttendance: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn((ops) => Promise.all(ops)),
  },
}));

describe('AttendanceService Unit Tests', () => {
  let attendanceService: AttendanceService;

  beforeEach(() => {
    attendanceService = new AttendanceService();
    vi.clearAllMocks();
  });

  it('should mark student attendance successfully', async () => {
    const mockRecord = { id: 'att-1', status: 'PRESENT' };
    (prisma.studentAttendance.upsert as any).mockResolvedValue(mockRecord);

    const result = await attendanceService.markStudentAttendance('sch-1', 'usr-1', {
      studentId: 'stud-1',
      batchId: 'batch-1',
      date: '2026-08-14',
      status: 'PRESENT',
      remarks: 'On time',
    });

    expect(result).toEqual(mockRecord);
    expect(prisma.studentAttendance.upsert).toHaveBeenCalled();
  });
});
