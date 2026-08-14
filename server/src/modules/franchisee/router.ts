import { Router } from 'express';
import { franchiseeController } from './controller';
import { authenticate, schoolScope, validate } from '../../middleware';
import { franchiseeInvoiceQuerySchema } from './schema';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/franchisee/invoices - Get franchisee invoices (SOA entries)
router.get('/invoices', validate(franchiseeInvoiceQuerySchema, 'query'), (req, res, next) => franchiseeController.getInvoices(req, res, next));

// GET /api/franchisee/royalty-forecast - Forecasted royalties
router.get('/royalty-forecast', (req, res, next) => franchiseeController.getRoyaltyForecast(req, res, next));

// GET /api/franchisee/coaches - Get coaches (teachers/staff)
router.get('/coaches', (req, res, next) => franchiseeController.getCoaches(req, res, next));

export default router;
