import { Request, Response, NextFunction } from 'express';
import { soaService } from './service';

export class SOAController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await soaService.getSummary(req.user!.schoolId!, req.query.month as string | undefined);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await soaService.getDetails(req.user!.schoolId!, req.query.month as string | undefined);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export const soaController = new SOAController();
