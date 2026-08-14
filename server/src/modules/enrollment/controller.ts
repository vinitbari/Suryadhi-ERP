import { Request, Response, NextFunction } from 'express';
import { enrollmentService } from './service';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class EnrollmentController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const data = await enrollmentService.getSummary(schoolId || '', req.query.academicYearId as string | undefined);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getSourceWise(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const data = await enrollmentService.getSourceWise(schoolId || '', req.query.academicYearId as string | undefined);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getRetention(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const data = await enrollmentService.getRetention(schoolId || '');
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getLSQLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const data = await enrollmentService.getLSQLeads(schoolId || '');
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async createLSQLead(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const data = await enrollmentService.createLSQLead(schoolId || '', req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export const enrollmentController = new EnrollmentController();
