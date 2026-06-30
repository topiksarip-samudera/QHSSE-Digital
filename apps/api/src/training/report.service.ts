import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingReportService {
  constructor(private prisma: PrismaService) {}

  async getExpiringCertificates(companyId: string, days: number = 30) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    return this.prisma.certificateRecord.findMany({ where: { companyId, expiryDate: { lte: threshold, gte: new Date() }, status: { not: 'expired' } }, orderBy: { expiryDate: 'asc' } });
  }

  async getComplianceReport(companyId: string) {
    const [total, compliant, matrices] = await Promise.all([
      this.prisma.certificateRecord.count({ where: { companyId } }),
      this.prisma.certificateRecord.count({ where: { companyId, status: 'active' } }),
      this.prisma.trainingMatrix.findMany({ where: { companyId, deletedAt: null }, select: { id: true, name: true, type: true } }),
    ]);
    const rate = total > 0 ? Math.round((compliant / total) * 100) : 0;
    return { totalCertificates: total, compliantCertificates: compliant, complianceRate: rate, matrices };
  }

  async getAttendanceReport(companyId: string, query?: { sessionId?: string; startDate?: string; endDate?: string }) {
    const where: any = { companyId };
    if (query?.sessionId) where.sessionId = query.sessionId;
    if (query?.startDate || query?.endDate) {
      where.createdAt = {};
      if (query?.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query?.endDate) where.createdAt.lte = new Date(query.endDate);
    }
    return this.prisma.trainingAttendance.findMany({ where, include: { session: { select: { name: true, actualDate: true } } }, orderBy: { createdAt: 'desc' } });
  }
}
