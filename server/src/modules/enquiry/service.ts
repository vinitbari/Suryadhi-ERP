import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { createAuditLog } from '../../utils/helpers';
import {
  CreateEnquiryInput,
  UpdateEnquiryInput,
  EnquiryFollowUpInput,
  EnquiryListQuery,
} from './schema';

export class EnquiryService {
  /**
   * List enquiries with filtering, sorting, and pagination
   */
  async list(schoolId: string, query: EnquiryListQuery) {
    const page = parseInt(query.page || '1', 10);
    const limit = Math.min(parseInt(query.limit || '25', 10), 100);
    const skip = (page - 1) * limit;

    const where: any = {
      schoolId,
      deletedAt: null,
    };

    if (query.stage) {
      where.stage = query.stage;
    }
    if (query.subStage) {
      where.subStage = query.subStage;
    }
    if (query.programId) {
      where.programId = query.programId;
    }
    if (query.search) {
      where.OR = [
        { enquirerName: { contains: query.search, mode: 'insensitive' } },
        { enquirerMobile: { contains: query.search } },
        { student: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { student: { lastName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any = {};
    orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              dateOfBirth: true,
              gender: true,
            },
          },
          program: {
            select: { id: true, name: true, shortName: true },
          },
          mediaSource: {
            select: { id: true, name: true },
          },
          _count: {
            select: { followUps: true },
          },
        },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return {
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    };
  }

  /**
   * Get single enquiry by ID
   */
  async getById(id: string, schoolId: string) {
    const enquiry = await prisma.enquiry.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        student: true,
        program: true,
        academicYear: true,
        mediaSource: true,
        followUps: {
          orderBy: { contactDate: 'desc' },
        },
        advanceReceipts: {
          orderBy: { receiptDate: 'desc' },
        },
      },
    });

    if (!enquiry) {
      throw new AppError('Enquiry not found', 404);
    }

    return enquiry;
  }

  /**
   * Create a new enquiry with student record
   */
  async create(schoolId: string, input: CreateEnquiryInput, userId: string) {
    // Create or find student
    const student = await prisma.student.create({
      data: {
        firstName: input.studentFirstName,
        middleName: input.studentMiddleName || null,
        lastName: input.studentLastName,
        dateOfBirth: new Date(input.dateOfBirth),
        gender: input.gender as any,
      },
    });

    const enquiry = await prisma.enquiry.create({
      data: {
        enquirerName: input.enquirerName,
        enquirerMobile: input.enquirerMobile,
        enquirerEmail: input.enquirerEmail || null,
        enquirerAddress: input.enquirerAddress,
        hasSibling: input.hasSibling,
        isTrialClass: input.isTrialClass,
        stage: 'NEW',
        studentId: student.id,
        programId: input.programId,
        academicYearId: input.academicYearId,
        mediaSourceId: input.mediaSourceId || null,
        schoolId,
      },
      include: {
        student: true,
        program: true,
      },
    });

    await createAuditLog({
      userId,
      action: 'CREATE',
      entity: 'Enquiry',
      entityId: enquiry.id,
      newValue: enquiry,
    });

    return enquiry;
  }

  /**
   * Update an existing enquiry
   */
  async update(id: string, schoolId: string, input: UpdateEnquiryInput, userId: string) {
    const existing = await this.getById(id, schoolId);

    const updateData: any = {};
    if (input.enquirerName) updateData.enquirerName = input.enquirerName;
    if (input.enquirerMobile) updateData.enquirerMobile = input.enquirerMobile;
    if (input.enquirerEmail !== undefined) updateData.enquirerEmail = input.enquirerEmail || null;
    if (input.enquirerAddress) updateData.enquirerAddress = input.enquirerAddress;
    if (input.hasSibling !== undefined) updateData.hasSibling = input.hasSibling;
    if (input.isTrialClass !== undefined) updateData.isTrialClass = input.isTrialClass;
    if (input.stage) updateData.stage = input.stage;
    if (input.subStage !== undefined) updateData.subStage = input.subStage;
    if (input.programId) updateData.programId = input.programId;
    if (input.mediaSourceId !== undefined) updateData.mediaSourceId = input.mediaSourceId || null;

    // Update student info if provided
    if (input.studentFirstName || input.studentLastName || input.dateOfBirth || input.gender) {
      const studentUpdate: any = {};
      if (input.studentFirstName) studentUpdate.firstName = input.studentFirstName;
      if (input.studentMiddleName !== undefined) studentUpdate.middleName = input.studentMiddleName || null;
      if (input.studentLastName) studentUpdate.lastName = input.studentLastName;
      if (input.dateOfBirth) studentUpdate.dateOfBirth = new Date(input.dateOfBirth);
      if (input.gender) studentUpdate.gender = input.gender;

      await prisma.student.update({
        where: { id: existing.studentId },
        data: studentUpdate,
      });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        program: true,
      },
    });

    await createAuditLog({
      userId,
      action: 'UPDATE',
      entity: 'Enquiry',
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });

    return updated;
  }

  /**
   * Add a follow-up entry to an enquiry
   */
  async addFollowUp(enquiryId: string, schoolId: string, input: EnquiryFollowUpInput, userId: string) {
    // Verify enquiry exists
    await this.getById(enquiryId, schoolId);

    const followUp = await prisma.enquiryFollowUp.create({
      data: {
        enquiryId,
        contactDate: new Date(input.contactDate),
        nextFollowUp: input.nextFollowUp ? new Date(input.nextFollowUp) : null,
        notes: input.notes,
        contactedBy: input.contactedBy || userId,
      },
    });

    // Update enquiry's follow-up tracking
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: {
        lastContacted: new Date(input.contactDate),
        nextFollowUp: input.nextFollowUp ? new Date(input.nextFollowUp) : null,
        stage: 'FOLLOW_UP',
      },
    });

    await createAuditLog({
      userId,
      action: 'CREATE',
      entity: 'EnquiryFollowUp',
      entityId: followUp.id,
      newValue: followUp,
    });

    return followUp;
  }

  /**
   * Convert enquiry to admission (marks as CONVERTED)
   */
  async convertToAdmission(enquiryId: string, schoolId: string, userId: string) {
    const enquiry = await this.getById(enquiryId, schoolId);

    if (enquiry.stage === 'CONVERTED') {
      throw new AppError('Enquiry is already converted to admission', 400);
    }

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: {
        stage: 'CONVERTED',
      },
      include: { student: true },
    });

    await createAuditLog({
      userId,
      action: 'CONVERT',
      entity: 'Enquiry',
      entityId: enquiryId,
      oldValue: { stage: enquiry.stage },
      newValue: { stage: 'CONVERTED' },
    });

    return updated;
  }

  /**
   * Delete enquiry (soft delete)
   */
  async delete(id: string, schoolId: string, userId: string) {
    await this.getById(id, schoolId);

    await prisma.enquiry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await createAuditLog({
      userId,
      action: 'DELETE',
      entity: 'Enquiry',
      entityId: id,
    });
  }
}

export const enquiryService = new EnquiryService();
