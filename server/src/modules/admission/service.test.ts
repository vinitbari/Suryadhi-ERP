import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdmissionService } from './service';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    admission: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn((fn) => fn(prisma)),
  },
}));

describe('AdmissionService Unit Tests', () => {
  let admissionService: AdmissionService;

  beforeEach(() => {
    admissionService = new AdmissionService();
    vi.clearAllMocks();
  });

  it('should throw 404 AppError when getting non-existent admission', async () => {
    (prisma.admission.findFirst as any).mockResolvedValue(null);

    await expect(admissionService.getById('invalid-id', 'sch-1')).rejects.toThrow('Admission not found');
  });

  it('should list admissions scoped by schoolId', async () => {
    const mockAdmissions = [
      { id: 'adm-1', schoolId: 'sch-1', status: 'ACTIVE' },
    ];

    (prisma.admission.findMany as any).mockResolvedValue(mockAdmissions);
    (prisma.admission.count as any).mockResolvedValue(1);

    const result = await admissionService.list('sch-1', { page: '1', limit: '10', sortBy: 'admissionDate', sortOrder: 'desc' });

    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });
});
