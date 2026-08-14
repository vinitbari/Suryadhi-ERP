import { Router } from 'express';
import { authenticate, schoolScope } from '../../middleware';
import { reportsController } from './controller';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/reports/admissions
router.get('/admissions', (req, res, next) => reportsController.admissions(req, res, next));

// GET /api/reports/enquiries
router.get('/enquiries', (req, res, next) => reportsController.enquiries(req, res, next));

// GET /api/reports/payment-due
router.get('/payment-due', (req, res, next) => reportsController.paymentDue(req, res, next));

// GET /api/reports/cancelled-receipts
router.get('/cancelled-receipts', (req, res, next) => reportsController.cancelledReceipts(req, res, next));

// GET /api/reports/transfers
router.get('/transfers', (req, res, next) => reportsController.transfers(req, res, next));

// GET /api/reports/fcr (Fee Collection Report)
router.get('/fcr', (req, res, next) => reportsController.fcr(req, res, next));

// GET /api/reports/fee-card
router.get('/fee-card', (req, res, next) => reportsController.feeCard(req, res, next));

// GET /api/reports/admission-count
router.get('/admission-count', (req, res, next) => reportsController.admissionCount(req, res, next));

// GET /api/reports/enquiry-count
router.get('/enquiry-count', (req, res, next) => reportsController.enquiryCount(req, res, next));

// GET /api/reports/online-payments
router.get('/online-payments', (req, res, next) => reportsController.onlinePayments(req, res, next));

// GET /api/reports/royalty-forecast
router.get('/royalty-forecast', (req, res, next) => reportsController.royaltyForecast(req, res, next));

// GET /api/reports/lsq-enquiries
router.get('/lsq-enquiries', (req, res, next) => reportsController.lsqEnquiries(req, res, next));

export default router;
