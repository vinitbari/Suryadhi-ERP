import { Request, Response, NextFunction } from 'express';
import { academicsService } from './service';
import { 
  createSubjectSchema, 
  createExamSchema, 
  createAssessmentSchema, 
  marksEntrySchema 
} from './schema';
import { getEffectiveSchoolId } from '../../utils/helpers';

export class AcademicsController {
  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID required' });
        return;
      }
      const validatedData = createSubjectSchema.parse(req.body);
      const result = await academicsService.createSubject(schoolId, validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const { programId } = req.query;
      const result = await academicsService.getSubjects(schoolId, programId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID required' });
        return;
      }
      const validatedData = createExamSchema.parse(req.body);
      const result = await academicsService.createExam(schoolId, validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getExams(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = getEffectiveSchoolId(req);
      const { academicYearId } = req.query;
      const result = await academicsService.getExams(schoolId, academicYearId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createAssessmentSchema.parse(req.body);
      const result = await academicsService.createAssessment(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async enterMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validatedData = marksEntrySchema.parse(req.body);
      const result = await academicsService.enterMarks(userId, validatedData);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.params;
      const result = await academicsService.getMarks(assessmentId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const academicsController = new AcademicsController();
