import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './service';

export class DashboardController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user!.schoolId!;
      const data = await dashboardService.getDashboardData(schoolId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getEnrollmentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user!.schoolId!;
      const data = await dashboardService.getEnrollmentAnalytics(schoolId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
