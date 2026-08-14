import { Router } from 'express';
import { authenticate, schoolScope } from '../../middleware';
import { enrollmentController } from './controller';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/enrollment/summary
router.get('/summary', (req, res, next) => enrollmentController.getSummary(req, res, next));

// GET /api/enrollment/source-wise
router.get('/source-wise', (req, res, next) => enrollmentController.getSourceWise(req, res, next));

// GET /api/enrollment/retention
router.get('/retention', (req, res, next) => enrollmentController.getRetention(req, res, next));

// GET /api/enrollment/lsq
router.get('/lsq', (req, res, next) => enrollmentController.getLSQLeads(req, res, next));

// POST /api/enrollment/lsq
router.post('/lsq', (req, res, next) => enrollmentController.createLSQLead(req, res, next));

export default router;
