import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export async function migrateLegacyEuroPrograms(prisma: PrismaClient) {
  try {
    // 1. Ensure SUNOIA Junior & SUNOIA Senior exist
    let sunoiaJunior = await prisma.program.findFirst({ where: { name: 'SUNOIA Junior' } });
    if (!sunoiaJunior) {
      sunoiaJunior = await prisma.program.create({
        data: { name: 'SUNOIA Junior', shortName: 'EJ', ageFrom: 42, ageTo: 54, sortOrder: 3 },
      });
    }

    let sunoiaSenior = await prisma.program.findFirst({ where: { name: 'SUNOIA Senior' } });
    if (!sunoiaSenior) {
      sunoiaSenior = await prisma.program.create({
        data: { name: 'SUNOIA Senior', shortName: 'ES', ageFrom: 54, ageTo: 72, sortOrder: 4 },
      });
    }

    // 2. Find any programs with Euro in the name
    const euroPrograms = await prisma.program.findMany({
      where: {
        OR: [
          { name: { contains: 'Euro', mode: 'insensitive' } },
          { name: 'Euro Junior' },
          { name: 'Euro Senior' },
        ],
      },
    });

    if (euroPrograms.length === 0) {
      return;
    }

    logger.info(`🧹 Found ${euroPrograms.length} legacy Euro program(s) to migrate and remove.`);

    for (const euroProg of euroPrograms) {
      const isSenior = euroProg.name.toLowerCase().includes('senior');
      const targetProg = isSenior ? sunoiaSenior : sunoiaJunior;

      if (euroProg.id === targetProg.id) continue;

      // Migrate Enquiries
      await prisma.enquiry.updateMany({
        where: { programId: euroProg.id },
        data: { programId: targetProg.id },
      });

      // Migrate Admissions
      await prisma.admission.updateMany({
        where: { programId: euroProg.id },
        data: { programId: targetProg.id },
      });

      // Migrate Batches
      const euroBatches = await prisma.batch.findMany({
        where: { programId: euroProg.id },
      });

      for (const eb of euroBatches) {
        let targetBatch = await prisma.batch.findFirst({
          where: { programId: targetProg.id, schoolId: eb.schoolId, timeSlot: eb.timeSlot },
        });

        if (!targetBatch) {
          targetBatch = await prisma.batch.create({
            data: {
              programId: targetProg.id,
              schoolId: eb.schoolId,
              timeSlot: eb.timeSlot,
              capacity: eb.capacity,
            },
          });
        }

        // Reassign any admissions pointing to the old batch
        await prisma.admission.updateMany({
          where: { batchId: eb.id },
          data: { batchId: targetBatch.id },
        });

        // Reassign attendance pointing to the old batch
        await prisma.studentAttendance.updateMany({
          where: { batchId: eb.id },
          data: { batchId: targetBatch.id },
        });

        // Delete old batch
        await prisma.batch.delete({ where: { id: eb.id } }).catch(() => {});
      }

      // Delete Fee Structures linked to old program
      await prisma.feeStructure.deleteMany({
        where: { programId: euroProg.id },
      });

      // Update Graduations
      await prisma.graduation.updateMany({
        where: { fromProgramId: euroProg.id },
        data: { fromProgramId: targetProg.id },
      });
      await prisma.graduation.updateMany({
        where: { toProgramId: euroProg.id },
        data: { toProgramId: targetProg.id },
      });

      // Update Subjects
      const euroSubjects = await prisma.subject.findMany({
        where: { programId: euroProg.id },
      });
      for (const es of euroSubjects) {
        const existingTargetSubject = await prisma.subject.findFirst({
          where: { schoolId: es.schoolId, programId: targetProg.id, name: es.name },
        });
        if (existingTargetSubject) {
          await prisma.assessment.updateMany({
            where: { subjectId: es.id },
            data: { subjectId: existingTargetSubject.id },
          });
          await prisma.subject.delete({ where: { id: es.id } }).catch(() => {});
        } else {
          await prisma.subject.update({
            where: { id: es.id },
            data: { programId: targetProg.id },
          }).catch(() => {});
        }
      }

      // Delete the legacy Euro program
      await prisma.program.delete({
        where: { id: euroProg.id },
      }).catch((err) => {
        logger.warn(err, `Failed to delete legacy program ${euroProg.name}`);
      });
    }

    logger.info('✅ Successfully cleaned up legacy Euro programs from database.');
  } catch (error) {
    logger.warn(error, 'Legacy program cleanup encountered an error');
  }
}

export async function ensureDefaultUsers(prisma: PrismaClient) {
  try {
    const bcrypt = await import('bcryptjs');
    let school = await prisma.school.findFirst();
    if (!school) {
      school = await prisma.school.create({
        data: {
          code: 'SEMS-DEMO-001',
          name: 'SŪNOIAKIDS™ Demo Pre-School',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
        },
      });
    }

    const adminHash = await bcrypt.hash('Admin@123', 12);
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: { passwordHash: adminHash, schoolId: school.id, isActive: true, deletedAt: null },
      create: {
        username: 'admin',
        email: 'admin@sems.suryadhi.in',
        passwordHash: adminHash,
        firstName: 'System',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        schoolId: school.id,
        isActive: true,
      },
    });

    const rahulHash = await bcrypt.hash('Suryadhi@7474', 12);
    await prisma.user.upsert({
      where: { username: 'Rahul.Khandale' },
      update: { passwordHash: rahulHash, schoolId: school.id, isActive: true, deletedAt: null },
      create: {
        username: 'Rahul.Khandale',
        email: 'rahul.khandale@sems.suryadhi.in',
        passwordHash: rahulHash,
        firstName: 'Rahul',
        lastName: 'Khandale',
        role: 'SUPER_ADMIN',
        schoolId: school.id,
        isActive: true,
      },
    });

    logger.info('✅ Default administrators verified (admin & Rahul.Khandale)');
  } catch (error) {
    logger.warn(error, 'Failed to ensure default administrators');
  }
}
