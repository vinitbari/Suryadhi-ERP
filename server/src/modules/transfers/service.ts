import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { CreateTransferRequestInput, UpdateTransferStatusInput, TransferListQuery } from './schema';

export class TransfersService {
  async getRequests(schoolId?: string, query?: TransferListQuery) {
    const where: any = {};
    if (schoolId) {
      where.admission = { schoolId };
    }
    if (query?.status) {
      where.status = query.status;
    }

    const transfers = await prisma.transferOutRequest.findMany({
      where,
      include: {
        admission: {
          include: {
            student: { select: { firstName: true, lastName: true, uin: true, dateOfBirth: true } },
            program: { select: { name: true, shortName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return transfers;
  }

  async createRequest(data: CreateTransferRequestInput, schoolId?: string) {
    const whereAdmission: any = { id: data.admissionId, status: 'ACTIVE', deletedAt: null };
    if (schoolId) {
      whereAdmission.schoolId = schoolId;
    }

    const admission = await prisma.admission.findFirst({
      where: whereAdmission,
      include: { student: true, school: true },
    });

    if (!admission) {
      throw new AppError('Active admission not found or access denied', 404);
    }

    return prisma.$transaction(async (tx) => {
      const t = await tx.transferOutRequest.create({
        data: {
          admissionId: data.admissionId,
          fromSchoolName: admission.school?.name || 'Current School',
          toSchoolName: data.toSchoolName,
          reason: data.reason,
          transferDate: new Date(data.transferDate),
          status: 'REQUESTED',
        },
      });

      await tx.admission.update({
        where: { id: data.admissionId },
        data: { status: 'TRANSFERRED_OUT' },
      });

      return t;
    });
  }

  async updateStatus(id: string, data: UpdateTransferStatusInput, schoolId?: string) {
    if (schoolId) {
      const reqCheck = await prisma.transferOutRequest.findFirst({
        where: {
          id,
          admission: { schoolId },
        },
      });
      if (!reqCheck) {
        throw new AppError('Transfer request not found or access denied', 404);
      }
    }

    const transfer = await prisma.transferOutRequest.update({
      where: { id },
      data: { status: data.status },
    });

    return transfer;
  }
}

export const transfersService = new TransfersService();
