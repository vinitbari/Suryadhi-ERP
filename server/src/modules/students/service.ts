import prisma from '../../config/database';
import { UploadDocumentInput, VerifyDocumentInput } from './schema';

export class StudentService {
  async uploadDocument(data: UploadDocumentInput, schoolId?: string) {
    if (schoolId) {
      const student = await prisma.student.findFirst({
        where: {
          id: data.studentId,
          admissions: { some: { schoolId, deletedAt: null } }
        }
      });
      if (!student) {
        throw new Error('Student not found or does not belong to this school');
      }
    }

    return prisma.studentDocument.create({
      data: {
        studentId: data.studentId,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
      }
    });
  }

  async getDocuments(studentId: string, schoolId?: string) {
    if (schoolId) {
      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
          admissions: { some: { schoolId, deletedAt: null } }
        }
      });
      if (!student) {
        throw new Error('Student not found or does not belong to this school');
      }
    }

    return prisma.studentDocument.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  async verifyDocument(documentId: string, data: VerifyDocumentInput, schoolId?: string) {
    if (schoolId) {
      const doc = await prisma.studentDocument.findFirst({
        where: {
          id: documentId,
          student: { admissions: { some: { schoolId, deletedAt: null } } }
        }
      });
      if (!doc) {
        throw new Error('Document not found or access denied');
      }
    }

    return prisma.studentDocument.update({
      where: { id: documentId },
      data: { verified: data.verified }
    });
  }

  async getStudentProfile(studentId: string, schoolId?: string) {
    const where: any = { id: studentId };
    if (schoolId) {
      where.admissions = { some: { schoolId, deletedAt: null } };
    }

    return prisma.student.findFirst({
      where,
      include: {
        parent: true,
        admissions: {
          include: { program: true, batch: true }
        },
        documents: true,
      }
    });
  }
}

export const studentService = new StudentService();
