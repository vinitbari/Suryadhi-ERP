import { Request, Response, NextFunction } from 'express';
import { franchiseeService } from './service';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class FranchiseeController {
  async getInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const result = await franchiseeService.getInvoices(schoolId, req.query as any);
      res.json({
        success: true,
        data: result.entries,
        total: result.total,
        summary: result.summary,
      });
    } catch (error) { next(error); }
  }

  async getRoyaltyForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const result = await franchiseeService.getRoyaltyForecast(schoolId, req.query as any);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) { next(error); }
  }

  async getCoaches(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const coaches = await franchiseeService.getCoaches(schoolId);
      res.json({
        success: true,
        data: coaches,
        total: coaches.length,
      });
    } catch (error) { next(error); }
  }
}

export const franchiseeController = new FranchiseeController();
