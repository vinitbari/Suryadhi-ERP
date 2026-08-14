import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeeService } from './service';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    feeStructure: {
      findMany: vi.fn(),
    },
    discountType: {
      findUnique: vi.fn(),
    },
    admission: {
      findFirst: vi.fn(),
    },
  },
}));

describe('FeeService Unit Tests', () => {
  let feeService: FeeService;

  beforeEach(() => {
    feeService = new FeeService();
    vi.clearAllMocks();
  });

  describe('calculateFee', () => {
    it('should correctly calculate subtotal and fee breakup without discount', async () => {
      const mockFeeStructures = [
        { id: 'fs1', feeType: 'TUITION_FEE', totalAmount: '10000', term1Amount: '5000', term2Amount: '5000' },
        { id: 'fs2', feeType: 'ACTIVITY_FEE', totalAmount: '2000', term1Amount: '1000', term2Amount: '1000' },
      ];

      (prisma.feeStructure.findMany as any).mockResolvedValue(mockFeeStructures);

      const result = await feeService.calculateFee('school-1', { programId: 'prog-1', admissionDate: '2026-08-14' });

      expect(result.subtotal).toBe(12000);
      expect(result.discountAmount).toBe(0);
      expect(result.totalAmount).toBe(12000);
      expect(result.term1Total).toBe(6000);
      expect(result.term2Total).toBe(6000);
      expect(result.feeBreakup).toHaveLength(2);
    });

    it('should correctly calculate percentage discount', async () => {
      const mockFeeStructures = [
        { id: 'fs1', feeType: 'TUITION_FEE', totalAmount: '10000', term1Amount: '5000', term2Amount: '5000' },
      ];

      (prisma.feeStructure.findMany as any).mockResolvedValue(mockFeeStructures);
      (prisma.discountType.findUnique as any).mockResolvedValue({ percentage: '10', flatAmount: null });

      const result = await feeService.calculateFee('school-1', {
        programId: 'prog-1',
        admissionDate: '2026-08-14',
        discountTypeId: 'disc-10',
      });

      expect(result.subtotal).toBe(10000);
      expect(result.discountAmount).toBe(1000);
      expect(result.totalAmount).toBe(9000);
      expect(result.term1Total).toBe(4500);
      expect(result.term2Total).toBe(4500);
    });

    it('should throw 404 AppError if no fee structure exists for program', async () => {
      (prisma.feeStructure.findMany as any).mockResolvedValue([]);

      await expect(
        feeService.calculateFee('school-1', { programId: 'non-existent', admissionDate: '2026-08-14' })
      ).rejects.toThrow('No fee structure found for this program');
    });
  });
});
