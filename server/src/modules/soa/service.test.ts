import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SOAService } from './service';
import prisma from '../../config/database';

vi.mock('../../config/database', () => ({
  default: {
    school: {
      findUnique: vi.fn(),
    },
    admission: {
      groupBy: vi.fn(),
    },
    program: {
      findMany: vi.fn(),
    },
    sOAEntry: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    invoice: {
      aggregate: vi.fn(),
    },
    receipt: {
      aggregate: vi.fn(),
    },
    forecastedRoyalty: {
      findMany: vi.fn(),
    },
  },
}));

describe('SOAService Unit Tests', () => {
  let soaService: SOAService;

  beforeEach(() => {
    soaService = new SOAService();
    vi.clearAllMocks();
  });

  it('should correctly aggregate SOA summary ledger totals and net balance', async () => {
    const mockSOAEntries = [
      { id: 'soa-1', invoiceAmount: '15000', receiptAmount: '5000', entryType: 'ROYALTY' },
      { id: 'soa-2', invoiceAmount: '5000', receiptAmount: '10000', entryType: 'FRANCHISEE_FEES' },
    ];

    (prisma.school.findUnique as any).mockResolvedValue({ id: 'sch-1', name: 'Pune Franchise' });
    (prisma.admission.groupBy as any).mockResolvedValue([]);
    (prisma.program.findMany as any).mockResolvedValue([]);
    (prisma.sOAEntry.findMany as any).mockResolvedValue(mockSOAEntries);
    (prisma.invoice.aggregate as any).mockResolvedValue({ _sum: { netAmount: 20000 } });
    (prisma.receipt.aggregate as any).mockResolvedValue({ _sum: { amount: 15000 } });
    (prisma.sOAEntry.groupBy as any).mockResolvedValue([]);

    const result = await soaService.getSummary('sch-1');

    expect(result.feeRoyaltyStatement.feesReceivable).toBe(20000);
    expect(result.feeRoyaltyStatement.feesCollected).toBe(15000);
    expect(result.feeRoyaltyStatement.feesDue).toBe(5000);
    expect(result.soaEntries).toHaveLength(2);
  });
});
