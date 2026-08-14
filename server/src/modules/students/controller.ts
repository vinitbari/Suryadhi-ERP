import { Request, Response, NextFunction } from 'express';
import { studentService } from './service';
import { uploadDocumentSchema, verifyDocumentSchema } from './schema';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class StudentController {
  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const validatedData = uploadDocumentSchema.parse(req.body);
      const result = await studentService.uploadDocument(validatedData, schoolId);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const { studentId } = req.params;
      const result = await studentService.getDocuments(studentId as string, schoolId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async verifyDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const { documentId } = req.params;
      const validatedData = verifyDocumentSchema.parse(req.body);
      const result = await studentService.verifyDocument(documentId as string, validatedData, schoolId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getStudentProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const { id } = req.params;
      const result = await studentService.getStudentProfile(id as string, schoolId);
      if (!result) {
        res.status(404).json({ success: false, error: 'Student not found' });
        return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const studentController = new StudentController();
