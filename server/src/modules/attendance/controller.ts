import { Request, Response, NextFunction } from 'express';
import { attendanceService } from './service';
import { 
  markStudentAttendanceSchema, 
  bulkStudentAttendanceSchema,
  markTeacherAttendanceSchema,
  getAttendanceQuerySchema
} from './schema';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class AttendanceController {
  async markStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID required' });
        return;
      }
      const userId = req.user!.userId;
      
      const validatedData = markStudentAttendanceSchema.parse(req.body);
      const result = await attendanceService.markStudentAttendance(schoolId, userId, validatedData);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async markBulkStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID required' });
        return;
      }
      const userId = req.user!.userId;
      
      const validatedData = bulkStudentAttendanceSchema.parse(req.body);
      const result = await attendanceService.markBulkStudentAttendance(schoolId, userId, validatedData);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async markTeacherAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID required' });
        return;
      }
      
      const validatedData = markTeacherAttendanceSchema.parse(req.body);
      const result = await attendanceService.markTeacherAttendance(schoolId, validatedData);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const validatedQuery = getAttendanceQuerySchema.parse(req.query);
      
      const result = await attendanceService.getStudentAttendance(schoolId || '', validatedQuery);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getTeacherAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const validatedQuery = getAttendanceQuerySchema.parse(req.query);
      
      const result = await attendanceService.getTeacherAttendance(schoolId || '', validatedQuery);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const attendanceController = new AttendanceController();
