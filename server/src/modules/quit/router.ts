import { Router } from 'express';
import { quitController } from './controller';
import { authenticate, schoolScope, authorize, validate } from '../../middleware';
import { createQuitSchema, quitListQuerySchema } from './schema';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/quit/list - Get quit records
router.get('/list', validate(quitListQuerySchema, 'query'), (req, res, next) => quitController.list(req, res, next));

// POST /api/quit/:admissionId - Quit an admission
router.post('/:admissionId', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(createQuitSchema), (req, res, next) => quitController.quit(req, res, next));

export default router;
