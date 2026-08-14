import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { createAuditLog } from '../../utils/helpers';
import { CreateQuitInput, QuitListQuery } from './schema';

export class QuitService {
  async list(schoolId?: string, query?: QuitListQuery) {
    const where: any = {};
    if (schoolId) {
      where.admission = { schoolId };
    }
    if (query?.from || query?.to) {
      where.quitDate = {};
      if (query.from) where.quitDate.gte = new Date(query.from);
      if (query.to) where.quitDate.lte = new Date(query.to);
    }

    const quitRecords = await prisma.quitRecord.findMany({
      where,
      include: {
        admission: {
          include: {
            student: { select: { firstName: true, lastName: true, uin: true, dateOfBirth: true } },
            program: { select: { name: true, shortName: true } },
          },
        },
      },
      orderBy: { quitDate: 'desc' },
    });

    return quitRecords;
  }

  async quit(admissionId: string, data: CreateQuitInput, userId?: string, schoolId?: string) {
    const whereAdmission: any = { id: admissionId, status: 'ACTIVE', deletedAt: null };
    if (schoolId) {
      whereAdmission.schoolId = schoolId;
    }

    const admission = await prisma.admission.findFirst({
      where: whereAdmission,
    });

    if (!admission) {
      throw new AppError('Active admission not found or access denied', 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const quit = await tx.quitRecord.create({
        data: {
          admissionId,
          reason: data.reason,
          quitDate: data.quitDate ? new Date(data.quitDate) : new Date(),
          isDuplicate: data.isDuplicate || false,
        },
      });

      await tx.admission.update({
        where: { id: admissionId },
        data: { status: 'QUIT' },
      });

      return quit;
    });

    await createAuditLog({
      userId,
      action: 'QUIT_STUDENT',
      entity: 'Admission',
      entityId: admissionId,
      oldValue: { status: admission.status },
      newValue: { status: 'QUIT', reason: data.reason },
    });

    return result;
  }
}

export const quitService = new QuitService();
