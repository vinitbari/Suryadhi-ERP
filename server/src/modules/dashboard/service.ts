import prisma from '../../config/database';

export class DashboardService {
  /**
   * Get all dashboard KPIs, financials, recent activity for a school
   */
  async getDashboardData(schoolId: string) {
    // Get current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    const yearFilter = currentYear ? { academicYearId: currentYear.id } : {};

    // Parallel queries for dashboard KPIs
    const [
      enquiryCount,
      grossAdmission,
      activeAdmissions,
      transferIn,
      transferOut,
      quitCount,
      totalReceivable,
      totalCollection,
      recentEnquiries,
      recentAdmissions,
    ] = await Promise.all([
      prisma.enquiry.count({
        where: { schoolId, ...yearFilter, deletedAt: null },
      }),
      prisma.admission.count({
        where: { schoolId, ...yearFilter, deletedAt: null },
      }),
      prisma.admission.count({
        where: { schoolId, status: 'ACTIVE', ...yearFilter, deletedAt: null },
      }),
      prisma.admission.count({
        where: { schoolId, status: 'TRANSFERRED_IN', ...yearFilter, deletedAt: null },
      }),
      prisma.admission.count({
        where: { schoolId, status: 'TRANSFERRED_OUT', ...yearFilter, deletedAt: null },
      }),
      prisma.admission.count({
        where: { schoolId, status: 'QUIT', ...yearFilter, deletedAt: null },
      }),
      prisma.invoice.aggregate({
        where: { admission: { schoolId }, deletedAt: null },
        _sum: { netAmount: true },
      }),
      prisma.receipt.aggregate({
        where: { admission: { schoolId }, isCancelled: false, deletedAt: null },
        _sum: { amount: true },
      }),
      prisma.enquiry.findMany({
        where: { schoolId, deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true } },
          program: { select: { name: true } },
        },
      }),
      prisma.admission.findMany({
        where: { schoolId, deletedAt: null },
        take: 5,
        orderBy: { admissionDate: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true } },
          program: { select: { name: true } },
        },
      }),
    ]);

    const receivable = Number(totalReceivable._sum.netAmount || 0);
    const collection = Number(totalCollection._sum.amount || 0);

    // Program-wise enrollment breakdown
    const programBreakdown = await prisma.admission.groupBy({
      by: ['programId'],
      where: { schoolId, status: 'ACTIVE', ...yearFilter, deletedAt: null },
      _count: { id: true },
    });

    const programs = await prisma.program.findMany({
      where: { id: { in: programBreakdown.map((p) => p.programId) } },
      select: { id: true, name: true, shortName: true },
    });

    const enrollmentByProgram = programBreakdown.map((pb) => ({
      program: programs.find((p) => p.id === pb.programId),
      count: pb._count.id,
    }));

    return {
      kpis: {
        enquiries: enquiryCount,
        grossAdmission,
        activeAdmissions,
        transferIn,
        transferOut,
        quit: quitCount,
        netEnrollment: grossAdmission + transferIn - transferOut - quitCount,
      },
      financials: {
        receivable,
        collection,
        paymentDue: receivable - collection,
        fcrDeposited: 0,
        fcrPending: 0,
      },
      enrollmentByProgram,
      recentEnquiries,
      recentAdmissions,
      academicYear: currentYear,
    };
  }

  /**
   * Get enrollment analytics: monthly trend, stage breakdown, source-wise
   */
  async getEnrollmentAnalytics(schoolId: string) {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const admissions = await prisma.admission.findMany({
      where: { schoolId, admissionDate: { gte: twelveMonthsAgo }, deletedAt: null },
      select: { admissionDate: true, programId: true },
    });

    // Group by month
    const monthlyData: Record<string, number> = {};
    admissions.forEach((a) => {
      const key = `${a.admissionDate.getFullYear()}-${String(a.admissionDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    const enrollmentTrend = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    // Stage-wise enquiry breakdown
    const enquiryByStage = await prisma.enquiry.groupBy({
      by: ['stage'],
      where: { schoolId, deletedAt: null },
      _count: { id: true },
    });

    // Source-wise enquiry breakdown
    const sourceWiseRaw = await prisma.enquiry.findMany({
      where: { schoolId, deletedAt: null },
      select: {
        program: { select: { name: true } },
        mediaSource: { select: { name: true } },
      },
    });

    const groupedByProgram: Record<string, any> = {};
    sourceWiseRaw.forEach((e) => {
      const progName = e.program?.name || 'Unknown';
      const sourceName = e.mediaSource?.name || 'Walkin';

      if (!groupedByProgram[progName]) {
        groupedByProgram[progName] = { program: progName, walkin: 0, gateApp: 0, digital: 0, bvn: 0, total: 0 };
      }
      groupedByProgram[progName].total += 1;

      if (/digital|online|web/i.test(sourceName)) {
        groupedByProgram[progName].digital += 1;
      } else if (/gate/i.test(sourceName)) {
        groupedByProgram[progName].gateApp += 1;
      } else if (/bvn/i.test(sourceName)) {
        groupedByProgram[progName].bvn += 1;
      } else {
        groupedByProgram[progName].walkin += 1;
      }
    });

    const sourceWiseEnquiries = Object.values(groupedByProgram);
    sourceWiseEnquiries.push({
      program: 'Total',
      isTotal: true,
      walkin: sourceWiseEnquiries.reduce((sum: number, item: any) => sum + item.walkin, 0),
      gateApp: sourceWiseEnquiries.reduce((sum: number, item: any) => sum + item.gateApp, 0),
      digital: sourceWiseEnquiries.reduce((sum: number, item: any) => sum + item.digital, 0),
      bvn: sourceWiseEnquiries.reduce((sum: number, item: any) => sum + item.bvn, 0),
      total: sourceWiseEnquiries.reduce((sum: number, item: any) => sum + item.total, 0),
    });

    return {
      enrollmentTrend,
      enquiryByStage: enquiryByStage.map((e) => ({ stage: e.stage, count: e._count.id })),
      sourceWiseEnquiries,
    };
  }
}

export const dashboardService = new DashboardService();
