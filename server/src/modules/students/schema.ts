import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  documentType: z.enum(['BIRTH_CERTIFICATE', 'AADHAR_CARD', 'PHOTOGRAPH', 'MEDICAL_RECORD', 'OTHER']),
  fileUrl: z.string().url('A valid file URL is required'),
});

export const verifyDocumentSchema = z.object({
  verified: z.boolean(),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type VerifyDocumentInput = z.infer<typeof verifyDocumentSchema>;
