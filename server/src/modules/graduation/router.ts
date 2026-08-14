import { Router } from 'express';
import { graduationController } from './controller';
import { authenticate, schoolScope, authorize, validate } from '../../middleware';
import { createGraduationSchema, graduationListQuerySchema } from './schema';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/graduation/list - Get graduations (homebuddy)
router.get('/list', validate(graduationListQuerySchema, 'query'), (req, res, next) => graduationController.list(req, res, next));

// POST /api/graduation/:admissionId - Graduate a student
router.post('/:admissionId', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(createGraduationSchema), (req, res, next) => graduationController.graduate(req, res, next));

export default router;
