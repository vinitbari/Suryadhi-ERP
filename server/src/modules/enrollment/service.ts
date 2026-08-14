import prisma from '../../config/database';

export class EnrollmentService {
  async getSummary(schoolId: string, academicYearId?: string) {
    const yearFilter: any = academicYearId ? { academicYearId } : {};

    const [totalEnquiries, convertedEnquiries, grossAdmissions, activeAdmissions, transferIn, transferOut, quit, programs] =
      await Promise.all([
        prisma.enquiry.count({ where: { schoolId, deletedAt: null, ...yearFilter } }),
        prisma.enquiry.count({ where: { schoolId, stage: 'CONVERTED', deletedAt: null, ...yearFilter } }),
        prisma.admission.count({ where: { schoolId, deletedAt: null, ...yearFilter } }),
        prisma.admission.count({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...yearFilter } }),
        prisma.admission.count({ where: { schoolId, status: 'TRANSFERRED_IN', deletedAt: null, ...yearFilter } }),
        prisma.admission.count({ where: { schoolId, status: 'TRANSFERRED_OUT', deletedAt: null, ...yearFilter } }),
        prisma.admission.count({ where: { schoolId, status: 'QUIT', deletedAt: null, ...yearFilter } }),
        prisma.program.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true, shortName: true } }),
      ]);

    const programBreakdown = await Promise.all(
      programs.map(async (program) => {
        const [enquiries, admissions, active] = await Promise.all([
          prisma.enquiry.count({ where: { schoolId, programId: program.id, deletedAt: null, ...yearFilter } }),
          prisma.admission.count({ where: { schoolId, programId: program.id, deletedAt: null, ...yearFilter } }),
          prisma.admission.count({ where: { schoolId, programId: program.id, status: 'ACTIVE', deletedAt: null, ...yearFilter } }),
        ]);
        return { program, enquiries, admissions, active };
      })
    );

    return {
      summary: {
        totalEnquiries,
        convertedEnquiries,
        conversionRate: totalEnquiries > 0 ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(1) : '0',
        grossAdmissions,
        activeAdmissions,
        transferIn,
        transferOut,
        quit,
        netEnrollment: grossAdmissions + transferIn - transferOut - quit,
      },
      programBreakdown,
    };
  }

  async getSourceWise(schoolId: string, academicYearId?: string) {
    const yearFilter: any = academicYearId ? { academicYearId } : {};

    const [enquiriesBySource, sources] = await Promise.all([
      prisma.enquiry.groupBy({
        by: ['mediaSourceId'],
        where: { schoolId, deletedAt: null, ...yearFilter },
        _count: { id: true },
      }),
      prisma.mediaSource.findMany({ select: { id: true, name: true } }),
    ]);

    return enquiriesBySource
      .map((e) => ({
        source: sources.find((s) => s.id === e.mediaSourceId)?.name || 'Unknown',
        enquiries: e._count.id,
      }))
      .sort((a, b) => b.enquiries - a.enquiries);
  }

  async getRetention(schoolId: string) {
    const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
    const previousYear = await prisma.academicYear.findMany({ where: { isCurrent: false }, orderBy: { startDate: 'desc' }, take: 1 });

    const prevYearId = previousYear[0]?.id;

    const [currentActive, previousTotal, retained] = await Promise.all([
      prisma.admission.count({ where: { schoolId, status: 'ACTIVE', academicYearId: currentYear?.id, deletedAt: null } }),
      prisma.admission.count({ where: { schoolId, academicYearId: prevYearId, deletedAt: null } }),
      prisma.admission.count({ where: { schoolId, status: 'ACTIVE', academicYearId: currentYear?.id, deletedAt: null } }),
    ]);

    const retentionRate = previousTotal > 0 ? ((retained / previousTotal) * 100).toFixed(1) : '0';

    return {
      currentYear: currentYear?.label,
      previousYear: previousYear[0]?.label,
      currentActive,
      previousTotal,
      retained,
      retentionRate,
      newAdmissions: currentActive - retained,
    };
  }

  async getLSQLeads(schoolId: string) {
    const leads = readLeads();
    return leads.filter((l: any) => l.schoolId === schoolId);
  }

  async createLSQLead(schoolId: string, input: any) {
    const leads = readLeads();
    const newLead = {
      id: 'LSQ-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      schoolId,
      studentName: input.studentName,
      parentName: input.parentName,
      mobile: input.mobile,
      alternateMobile: input.alternateMobile || null,
      email: input.email || null,
      area: input.area,
      program: input.program,
      leadSource: input.leadSource || 'Direct',
      leadStatus: input.leadStatus || 'New',
      remarks: input.remarks || null,
      createdAt: new Date().toISOString(),
    };
    leads.push(newLead);
    writeLeads(leads);
    return newLead;
  }
}

import fs from 'fs';
import path from 'path';

const LEADS_FILE_PATH = path.join(__dirname, '../../data/lsq-leads.json');

function readLeads(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE_PATH)) {
      fs.mkdirSync(path.dirname(LEADS_FILE_PATH), { recursive: true });
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Failed to read leads:', error);
    return [];
  }
}

function writeLeads(leads: any[]): void {
  try {
    fs.mkdirSync(path.dirname(LEADS_FILE_PATH), { recursive: true });
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Failed to write leads:', error);
  }
}

export const enrollmentService = new EnrollmentService();
