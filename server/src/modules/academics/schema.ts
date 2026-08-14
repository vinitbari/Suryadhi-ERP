import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
  programId: z.string().min(1, 'Program ID is required'),
});

export const createExamSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid start date required'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid end date required'),
  academicYearId: z.string().min(1, 'Academic Year ID is required'),
});

export const createAssessmentSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  maxMarks: z.number().min(1, 'Max marks must be greater than 0'),
  passingMarks: z.number().optional(),
  date: z.string().optional(),
});

export const marksEntrySchema = z.object({
  assessmentId: z.string().min(1, 'Assessment ID is required'),
  records: z.array(z.object({
    studentId: z.string().min(1),
    marksObtained: z.number().min(0),
    remarks: z.string().optional(),
  })).min(1, 'At least one record is required'),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type MarksEntryInput = z.infer<typeof marksEntrySchema>;
