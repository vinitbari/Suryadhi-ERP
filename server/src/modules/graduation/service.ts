import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { createAuditLog } from '../../utils/helpers';
import { CreateGraduationInput, GraduationListQuery } from './schema';

export class GraduationService {
  async list(schoolId?: string, query?: GraduationListQuery) {
    const where: any = {
      admission: { deletedAt: null },
    };
    if (schoolId) {
      where.admission.schoolId = schoolId;
    }
    if (query?.programId) {
      where.fromProgramId = query.programId;
    }

    const graduations = await prisma.graduation.findMany({
      where,
      include: {
        admission: {
          include: {
            student: { select: { firstName: true, lastName: true, uin: true, dateOfBirth: true } },
            program: { select: { name: true, shortName: true } },
          },
        },
        fromProgram: { select: { name: true, shortName: true } },
        toProgram: { select: { name: true, shortName: true } },
      },
      orderBy: { graduationDate: 'desc' },
    });

    return graduations;
  }

  async graduate(admissionId: string, data: CreateGraduationInput, userId?: string, schoolId?: string) {
    const whereAdmission: any = { id: admissionId, deletedAt: null };
    if (schoolId) {
      whereAdmission.schoolId = schoolId;
    }

    const admission = await prisma.admission.findFirst({
      where: whereAdmission,
    });

    if (!admission) {
      throw new AppError('Admission not found or access denied', 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const grad = await tx.graduation.create({
        data: {
          admissionId,
          fromProgramId: admission.programId,
          toProgramId: data.toProgramId,
          graduationDate: new Date(data.graduationDate),
          isHomebuddy: data.isHomebuddy || false,
        },
      });

      await tx.admission.update({
        where: { id: admissionId },
        data: { status: 'GRADUATED', programId: data.toProgramId },
      });

      return grad;
    });

    await createAuditLog({
      userId,
      action: 'GRADUATE_STUDENT',
      entity: 'Admission',
      entityId: admissionId,
      oldValue: { status: admission.status, programId: admission.programId },
      newValue: { status: 'GRADUATED', programId: data.toProgramId },
    });

    return result;
  }
}

export const graduationService = new GraduationService();
