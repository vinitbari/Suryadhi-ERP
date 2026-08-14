import { z } from 'zod';

export const createGraduationSchema = z.object({
  toProgramId: z.string().min(1, 'Target program ID is required'),
  graduationDate: z.string().or(z.date()),
  isHomebuddy: z.boolean().optional(),
});

export const graduationListQuerySchema = z.object({
  programId: z.string().optional(),
  academicYearId: z.string().optional(),
});

export type CreateGraduationInput = z.infer<typeof createGraduationSchema>;
export type GraduationListQuery = z.infer<typeof graduationListQuerySchema>;
