import { Router } from 'express';
import { authenticate, schoolScope } from '../../middleware';
import { soaController } from './controller';

const router = Router();

router.use(authenticate);
router.use(schoolScope);

// GET /api/soa/summary
router.get('/summary', (req, res, next) => soaController.getSummary(req, res, next));

// GET /api/soa/details
router.get('/details', (req, res, next) => soaController.getDetails(req, res, next));

export default router;
