import { Router } from 'express';
import { transfersController } from './controller';
import { authenticate, schoolScope, authorize, validate } from '../../middleware';
import { createTransferRequestSchema, updateTransferStatusSchema, transferListQuerySchema } from './schema';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/transfers/requests - Get all transfer requests for this school
router.get('/requests', validate(transferListQuerySchema, 'query'), (req, res, next) => transfersController.getRequests(req, res, next));

// POST /api/transfers/request - Create transfer out request
router.post('/request', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(createTransferRequestSchema), (req, res, next) => transfersController.createRequest(req, res, next));

// PUT /api/transfers/:id/status - Update transfer status
router.put('/:id/status', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(updateTransferStatusSchema), (req, res, next) => transfersController.updateStatus(req, res, next));

export default router;
