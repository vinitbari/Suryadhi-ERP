import { Router } from 'express';
import { enquiryController } from './controller';
import { authenticate, authorize, schoolScope, validate } from '../../middleware';
import {
  createEnquirySchema,
  updateEnquirySchema,
  enquiryFollowUpSchema,
  enquiryListQuerySchema,
} from './schema';

const router = Router();

// All enquiry routes require authentication and school scope
router.use(authenticate);
router.use(schoolScope);

// GET /api/enquiries
router.get(
  '/',
  validate(enquiryListQuerySchema, 'query'),
  (req, res, next) => enquiryController.list(req, res, next)
);

// GET /api/enquiries/:id
router.get('/:id', (req, res, next) => enquiryController.getById(req, res, next));

// POST /api/enquiries
router.post(
  '/',
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
  validate(createEnquirySchema),
  (req, res, next) => enquiryController.create(req, res, next)
);

// PUT /api/enquiries/:id
router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
  validate(updateEnquirySchema),
  (req, res, next) => enquiryController.update(req, res, next)
);

// POST /api/enquiries/:id/follow-up
router.post(
  '/:id/follow-up',
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
  validate(enquiryFollowUpSchema),
  (req, res, next) => enquiryController.addFollowUp(req, res, next)
);

// POST /api/enquiries/:id/convert
router.post(
  '/:id/convert',
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  (req, res, next) => enquiryController.convert(req, res, next)
);

// DELETE /api/enquiries/:id
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  (req, res, next) => enquiryController.delete(req, res, next)
);

export default router;
