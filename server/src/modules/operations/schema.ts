import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  items: z.array(z.any()), // JSON representation
  totalAmount: z.number().min(0, 'Total amount cannot be negative'),
  notes: z.string().optional(),
});

export const updatePurchaseOrderStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'DISPATCHED', 'DELIVERED', 'CANCELLED']),
});

export const reportShortageDamageSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reportType: z.enum(['SHORTAGE', 'DAMAGE']),
  description: z.string().optional(),
  reportDate: z.string(),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderStatusInput = z.infer<typeof updatePurchaseOrderStatusSchema>;
export type ReportShortageDamageInput = z.infer<typeof reportShortageDamageSchema>;
