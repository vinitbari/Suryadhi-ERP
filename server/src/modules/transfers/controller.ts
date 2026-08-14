import { Request, Response, NextFunction } from 'express';
import { transfersService } from './service';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class TransfersController {
  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const transfers = await transfersService.getRequests(schoolId, req.query as any);
      res.json({ success: true, data: transfers, total: transfers.length });
    } catch (error) { next(error); }
  }

  async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const transfer = await transfersService.createRequest(req.body, schoolId);
      res.json({ success: true, data: transfer });
    } catch (error) { next(error); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const id = req.params.id as string;
      const transfer = await transfersService.updateStatus(id, req.body, schoolId);
      res.json({ success: true, data: transfer });
    } catch (error) { next(error); }
  }
}

export const transfersController = new TransfersController();
