import { z } from 'zod';

export const createTransferRequestSchema = z.object({
  admissionId: z.string().min(1, 'Admission ID is required'),
  toSchoolName: z.string().min(1, 'Target school name is required'),
  reason: z.string().optional(),
  transferDate: z.string().or(z.date()),
});

export const updateTransferStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED']),
});

export const transferListQuerySchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
});

export type CreateTransferRequestInput = z.infer<typeof createTransferRequestSchema>;
export type UpdateTransferStatusInput = z.infer<typeof updateTransferStatusSchema>;
export type TransferListQuery = z.infer<typeof transferListQuerySchema>;
