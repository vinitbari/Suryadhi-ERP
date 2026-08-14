import prisma from '../../config/database';
import { FranchiseeInvoiceQuery } from './schema';

export class FranchiseeService {
  async getInvoices(schoolId?: string, query?: FranchiseeInvoiceQuery) {
    const where: any = {};
    if (schoolId) {
      where.schoolId = schoolId;
    }
    if (query?.type) {
      where.entryType = query.type;
    }
    if (query?.from || query?.to) {
      where.entryDate = {};
      if (query.from) where.entryDate.gte = new Date(query.from);
      if (query.to) where.entryDate.lte = new Date(query.to);
    }

    const entries = await prisma.sOAEntry.findMany({
      where,
      orderBy: { entryDate: 'desc' },
    });

    const totalInvoice = entries.reduce((sum, e) => sum + Number(e.invoiceAmount || 0), 0);
    const totalReceipt = entries.reduce((sum, e) => sum + Number(e.receiptAmount || 0), 0);

    return {
      entries,
      total: entries.length,
      summary: {
        totalInvoice,
        totalReceipt,
        balance: totalInvoice - totalReceipt,
      },
    };
  }

  async getRoyaltyForecast(schoolId?: string) {
    const where: any = {};
    if (schoolId) {
      where.admission = { schoolId };
    }

    const forecasts = await prisma.forecastedRoyalty.findMany({
      where,
      include: {
        admission: {
          include: {
            student: { select: { firstName: true, lastName: true, uin: true } },
            program: { select: { name: true, shortName: true } },
          },
        },
      },
      orderBy: [{ month: 'asc' }],
    });

    const byMonth: Record<string, { month: string; amount: number; studentCount: number }> = {};
    forecasts.forEach((f) => {
      const key = f.month.toISOString().substring(0, 7);
      if (!byMonth[key]) byMonth[key] = { month: key, amount: 0, studentCount: 0 };
      byMonth[key].amount += Number(f.amount);
      byMonth[key].studentCount++;
    });

    return {
      details: forecasts,
      monthly: Object.values(byMonth),
      totalForecast: forecasts.reduce((sum, f) => sum + Number(f.amount), 0),
    };
  }

  async getCoaches(schoolId?: string) {
    const where: any = {
      role: { in: ['TEACHER', 'SCHOOL_ADMIN'] },
      isActive: true,
      deletedAt: null,
    };
    if (schoolId) {
      where.schoolId = schoolId;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { firstName: 'asc' },
    });

    const coaches = users.map((u) => ({
      id: u.id,
      coachName: `${u.firstName} ${u.lastName}`,
      coachCode: 'COACH-' + u.username.toUpperCase(),
      designation: u.role === 'SCHOOL_ADMIN' ? 'Head Coach / Admin' : 'Preschool Coach',
      specialty: 'Early Childhood Education',
      qualification: 'B.Ed. / Montessori Trained',
      contactNumber: u.phone || '',
      email: u.email,
      isActive: u.isActive,
    }));

    return coaches;
  }
}

export const franchiseeService = new FranchiseeService();
