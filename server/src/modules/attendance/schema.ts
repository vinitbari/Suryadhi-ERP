import { z } from 'zod';

export const attendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY']);

export const markStudentAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  batchId: z.string().min(1, 'Batch ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid date required'),
  status: attendanceStatusEnum,
  remarks: z.string().max(250).optional(),
});

export const bulkStudentAttendanceSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid date required'),
  records: z.array(z.object({
    studentId: z.string().min(1),
    status: attendanceStatusEnum,
    remarks: z.string().max(250).optional(),
  })).min(1, 'At least one record is required'),
});

export const markTeacherAttendanceSchema = z.object({
  teacherId: z.string().min(1, 'Teacher ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid date required'),
  status: attendanceStatusEnum,
  remarks: z.string().max(250).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

export const getAttendanceQuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  batchId: z.string().optional(),
  studentId: z.string().optional(),
  teacherId: z.string().optional(),
});

export type MarkStudentAttendanceInput = z.infer<typeof markStudentAttendanceSchema>;
export type BulkStudentAttendanceInput = z.infer<typeof bulkStudentAttendanceSchema>;
export type MarkTeacherAttendanceInput = z.infer<typeof markTeacherAttendanceSchema>;
export type GetAttendanceQuery = z.infer<typeof getAttendanceQuerySchema>;
