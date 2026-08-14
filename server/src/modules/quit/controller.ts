import { Request, Response, NextFunction } from 'express';
import { quitService } from './service';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class QuitController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const quitRecords = await quitService.list(schoolId, req.query as any);
      res.json({ success: true, data: quitRecords, total: quitRecords.length });
    } catch (error) { next(error); }
  }

  async quit(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const userId = req.user?.userId;
      const admissionId = req.params.admissionId as string;
      const quitRecord = await quitService.quit(admissionId, req.body, userId, schoolId);
      res.json({ success: true, data: quitRecord });
    } catch (error) { next(error); }
  }
}

export const quitController = new QuitController();
