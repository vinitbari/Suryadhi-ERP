import { z } from 'zod';

export const franchiseeInvoiceQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(['ROYALTY', 'FRANCHISEE_FEES', 'PRODUCT_SALES', 'CREDIT_NOTE', 'DEBIT_NOTE', 'ADVANCE']).optional(),
});

export type FranchiseeInvoiceQuery = z.infer<typeof franchiseeInvoiceQuerySchema>;
