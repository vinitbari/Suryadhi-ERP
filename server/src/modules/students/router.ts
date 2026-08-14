import { Router } from 'express';
import { studentController } from './controller';
import { authenticate, schoolScope, authorize, validate } from '../../middleware';
import { uploadDocumentSchema, verifyDocumentSchema } from './schema';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(schoolScope);

// Student Profile
router.get('/:id', (req, res, next) => studentController.getStudentProfile(req, res, next));

// Documents
router.post('/documents', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), validate(uploadDocumentSchema), (req, res, next) => studentController.uploadDocument(req, res, next));
router.get('/:studentId/documents', (req, res, next) => studentController.getDocuments(req, res, next));
router.put('/documents/:documentId/verify', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(verifyDocumentSchema), (req, res, next) => studentController.verifyDocument(req, res, next));

export default router;
