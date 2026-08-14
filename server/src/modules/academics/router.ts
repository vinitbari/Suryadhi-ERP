import { Router } from 'express';
import { academicsController } from './controller';
import { authenticate, schoolScope, authorize, validate } from '../../middleware';
import {
  createSubjectSchema,
  createExamSchema,
  createAssessmentSchema,
  marksEntrySchema,
} from './schema';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(schoolScope);

// Subjects
router.post('/subjects', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(createSubjectSchema), (req, res, next) => academicsController.createSubject(req, res, next));
router.get('/subjects', (req, res, next) => academicsController.getSubjects(req, res, next));

// Exams
router.post('/exams', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), validate(createExamSchema), (req, res, next) => academicsController.createExam(req, res, next));
router.get('/exams', (req, res, next) => academicsController.getExams(req, res, next));

// Assessments & Marks
router.post('/assessments', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), validate(createAssessmentSchema), (req, res, next) => academicsController.createAssessment(req, res, next));
router.post('/marks', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), validate(marksEntrySchema), (req, res, next) => academicsController.enterMarks(req, res, next));
router.get('/assessments/:assessmentId/marks', (req, res, next) => academicsController.getMarks(req, res, next));

export default router;
