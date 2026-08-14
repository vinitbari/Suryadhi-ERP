import { PrismaClient, OrderStatus } from '@prisma/client';
import { 
  CreatePurchaseOrderInput, 
  UpdatePurchaseOrderStatusInput, 
  ReportShortageDamageInput 
} from './schema';

const prisma = new PrismaClient();

export class OperationsService {
  async getPurchaseOrders(schoolId: string) {
    return prisma.purchaseOrder.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPurchaseOrder(schoolId: string, data: CreatePurchaseOrderInput) {
    return prisma.purchaseOrder.create({
      data: {
        schoolId,
        orderNumber: data.orderNumber,
        items: data.items,
        totalAmount: data.totalAmount,
        notes: data.notes,
        status: 'DRAFT',
      }
    });
  }

  async updatePurchaseOrderStatus(id: string, schoolId: string, data: UpdatePurchaseOrderStatusInput) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { 
        status: data.status as OrderStatus,
        ...(data.status === 'SUBMITTED' || data.status === 'DISPATCHED' ? { orderedAt: new Date() } : {}),
        ...(data.status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
      }
    });
  }

  async getShortageReports(schoolId: string) {
    return prisma.shortageReport.findMany({
      where: { schoolId },
      orderBy: { reportDate: 'desc' }
    });
  }

  async createShortageReport(schoolId: string, data: ReportShortageDamageInput) {
    return prisma.shortageReport.create({
      data: {
        schoolId,
        itemName: data.itemName,
        quantity: data.quantity,
        reportType: data.reportType,
        description: data.description,
        reportDate: new Date(data.reportDate),
        status: 'REPORTED',
      }
    });
  }

  async resolveShortageReport(id: string, schoolId: string) {
    return prisma.shortageReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      }
    });
  }
}

export const operationsService = new OperationsService();
