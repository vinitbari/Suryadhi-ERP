import { Request, Response, NextFunction } from 'express';
import { graduationService } from './service';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class GraduationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const graduations = await graduationService.list(schoolId, req.query as any);
      res.json({ success: true, data: graduations, total: graduations.length });
    } catch (error) { next(error); }
  }

  async graduate(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const userId = req.user?.userId;
      const admissionId = req.params.admissionId as string;
      const graduation = await graduationService.graduate(admissionId, req.body, userId, schoolId);
      res.json({ success: true, data: graduation });
    } catch (error) { next(error); }
  }
}

export const graduationController = new GraduationController();
