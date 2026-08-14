import { z } from 'zod';

export const createQuitSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  quitDate: z.string().or(z.date()).optional(),
  isDuplicate: z.boolean().optional(),
});

export const quitListQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type CreateQuitInput = z.infer<typeof createQuitSchema>;
export type QuitListQuery = z.infer<typeof quitListQuerySchema>;
