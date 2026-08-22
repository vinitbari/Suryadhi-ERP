import prisma from '../../config/database';
import { OrderStatus } from '@prisma/client';
import { 
  CreatePurchaseOrderInput, 
  UpdatePurchaseOrderStatusInput, 
  ReportShortageDamageInput 
} from './schema';

export class OperationsService {
  private async getFallbackSchoolId(schoolId?: string): Promise<string> {
    if (schoolId) return schoolId;
    const school = await prisma.school.findFirst({ select: { id: true } });
    return school?.id || '';
  }

  async getPurchaseOrders(schoolId?: string) {
    const where: any = schoolId ? { schoolId } : {};
    return prisma.purchaseOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPurchaseOrder(schoolId: string | undefined, data: CreatePurchaseOrderInput) {
    const effectiveSchoolId = await this.getFallbackSchoolId(schoolId);
    return prisma.purchaseOrder.create({
      data: {
        schoolId: effectiveSchoolId,
        orderNumber: data.orderNumber,
        items: data.items,
        totalAmount: data.totalAmount,
        notes: data.notes,
        status: 'DRAFT',
      }
    });
  }

  async updatePurchaseOrderStatus(id: string, _schoolId: string | undefined, data: UpdatePurchaseOrderStatusInput) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { 
        status: data.status as OrderStatus,
        ...(data.status === 'SUBMITTED' || data.status === 'DISPATCHED' ? { orderedAt: new Date() } : {}),
        ...(data.status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
      }
    });
  }

  async getShortageReports(schoolId?: string) {
    const where: any = schoolId ? { schoolId } : {};
    return prisma.shortageReport.findMany({
      where,
      orderBy: { reportDate: 'desc' }
    });
  }

  async createShortageReport(schoolId: string | undefined, data: ReportShortageDamageInput) {
    const effectiveSchoolId = await this.getFallbackSchoolId(schoolId);
    return prisma.shortageReport.create({
      data: {
        schoolId: effectiveSchoolId,
        itemName: data.itemName,
        quantity: data.quantity,
        reportType: data.reportType,
        description: data.description,
        reportDate: new Date(data.reportDate),
        status: 'REPORTED',
      }
    });
  }

  async resolveShortageReport(id: string, _schoolId?: string) {
    return prisma.shortageReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      }
    });
  }

  async getExchangeOrders(schoolId?: string) {
    const where: any = { reportType: 'EXCHANGE' };
    if (schoolId) where.schoolId = schoolId;

    const reports = await prisma.shortageReport.findMany({
      where,
      orderBy: { reportDate: 'desc' }
    });

    return reports.map(r => ({
      id: r.id,
      exchangeNumber: `EXC-${r.id.slice(-6).toUpperCase()}`,
      poNumber: r.description?.includes('PO:') ? r.description.split('PO:')[1].split(';')[0].trim() : 'PO-2026-001',
      lrNumber: `LR-${Math.floor(100000 + Math.random() * 900000)}`,
      reportDate: r.reportDate.toISOString().split('T')[0],
      itemName: r.itemName,
      quantity: r.quantity,
      status: r.status,
    }));
  }

  async createExchangeOrder(schoolId: string | undefined, data: any) {
    const effectiveSchoolId = await this.getFallbackSchoolId(schoolId);
    return prisma.shortageReport.create({
      data: {
        schoolId: effectiveSchoolId,
        itemName: data.itemName || 'Student Kit Exchange',
        quantity: Number(data.quantity) || 1,
        reportType: 'EXCHANGE',
        description: `PO: ${data.poNumber || 'N/A'}; Reason: ${data.reason || 'Size/Item Mismatch'}`,
        reportDate: new Date(),
        status: 'REPORTED',
      }
    });
  }
}

export const operationsService = new OperationsService();
