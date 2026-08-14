import { Router } from 'express';
import { authenticate, schoolScope } from '../../middleware';
import { downloadsController } from './controller';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  /api/downloads  –  Universal ERP Download API                      ║
 * ║                                                                      ║
 * ║  All endpoints support:                                              ║
 * ║    ?format=csv   (default) → triggers browser file download as CSV  ║
 * ║    ?format=json            → returns JSON payload                   ║
 * ║                                                                      ║
 * ║  CSV files include a UTF-8 BOM for Excel compatibility              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// ─── Admissions ─────────────────────────────────────────────────────────────
// GET /api/downloads/admissions?academicYearId=&programId=&status=&from=&to=&format=csv
router.get('/admissions', (req, res, next) =>
  downloadsController.admissions(req, res, next));

// ─── Enquiries ──────────────────────────────────────────────────────────────
// GET /api/downloads/enquiries?academicYearId=&programId=&stage=&from=&to=&format=csv
router.get('/enquiries', (req, res, next) =>
  downloadsController.enquiries(req, res, next));

// ─── Fee Collection Receipts ─────────────────────────────────────────────────
// GET /api/downloads/receipts?from=&to=&paymentMode=&format=csv
router.get('/receipts', (req, res, next) =>
  downloadsController.receipts(req, res, next));

// ─── Franchisee Invoices / SOA ───────────────────────────────────────────────
// GET /api/downloads/invoices?from=&to=&entryType=&format=csv
router.get('/invoices', (req, res, next) =>
  downloadsController.invoices(req, res, next));

// ─── Students Master List ────────────────────────────────────────────────────
// GET /api/downloads/students?programId=&status=&format=csv
router.get('/students', (req, res, next) =>
  downloadsController.students(req, res, next));

// ─── Attendance Register ─────────────────────────────────────────────────────
// GET /api/downloads/attendance?date=&programId=&batchId=&format=csv
router.get('/attendance', (req, res, next) =>
  downloadsController.attendance(req, res, next));

// ─── Payment Due Report ──────────────────────────────────────────────────────
// GET /api/downloads/payment-due?format=csv
router.get('/payment-due', (req, res, next) =>
  downloadsController.paymentDue(req, res, next));

// ─── Transfers ───────────────────────────────────────────────────────────────
// GET /api/downloads/transfers?format=csv
router.get('/transfers', (req, res, next) =>
  downloadsController.transfers(req, res, next));

// ─── Fee Card / Structure ────────────────────────────────────────────────────
// GET /api/downloads/fee-card?programId=&format=csv
router.get('/fee-card', (req, res, next) =>
  downloadsController.feeCard(req, res, next));

// ─── Cancelled Receipts ──────────────────────────────────────────────────────
// GET /api/downloads/cancelled-receipts?format=csv
router.get('/cancelled-receipts', (req, res, next) =>
  downloadsController.cancelledReceipts(req, res, next));

// ─── Purchase Orders ─────────────────────────────────────────────────────────
// GET /api/downloads/purchase-orders?format=csv
router.get('/purchase-orders', (req, res, next) =>
  downloadsController.purchaseOrders(req, res, next));

// ─── Online Payments ─────────────────────────────────────────────────────────
// GET /api/downloads/online-payments?from=&to=&format=csv
router.get('/online-payments', (req, res, next) =>
  downloadsController.onlinePayments(req, res, next));

// ─── Graduation List ─────────────────────────────────────────────────────────
// GET /api/downloads/graduation?format=csv
router.get('/graduation', (req, res, next) =>
  downloadsController.graduation(req, res, next));

// ─── SOA Ledger (per student) ────────────────────────────────────────────────
// GET /api/downloads/soa-ledger/:admissionId?format=csv
router.get('/soa-ledger/:admissionId', (req, res, next) =>
  downloadsController.soaLedger(req, res, next));

// ─── Quit / Withdrawn Students ───────────────────────────────────────────────
// GET /api/downloads/quit?format=csv
router.get('/quit', (req, res, next) =>
  downloadsController.quit(req, res, next));

export default router;
