import { Router } from 'express';
import { attendanceController } from './controller';
import { authenticate, schoolScope, authorize } from '../../middleware';

const router = Router();

// Ensure all attendance routes are protected
router.use(authenticate);
router.use(schoolScope);

// Student Attendance
router.post('/student', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req, res, next) => attendanceController.markStudentAttendance(req, res, next));
router.post('/student/bulk', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req, res, next) => attendanceController.markBulkStudentAttendance(req, res, next));
router.get('/student', (req, res, next) => attendanceController.getStudentAttendance(req, res, next));

// Teacher Attendance
router.post('/teacher', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req, res, next) => attendanceController.markTeacherAttendance(req, res, next));
router.get('/teacher', (req, res, next) => attendanceController.getTeacherAttendance(req, res, next));

export default router;
