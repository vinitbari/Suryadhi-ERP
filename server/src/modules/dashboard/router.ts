import { Router } from 'express';
import { authenticate, schoolScope } from '../../middleware';
import { dashboardController } from './controller';

const router = Router();

router.use(authenticate);
router.use(schoolScope);

// GET /api/dashboard
router.get('/', (req, res, next) => dashboardController.getDashboard(req, res, next));

// GET /api/dashboard/enrollment-analytics
router.get('/enrollment-analytics', (req, res, next) => dashboardController.getEnrollmentAnalytics(req, res, next));

export default router;
