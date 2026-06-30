import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificateDashboardService {
  constructor(private prisma: PrismaService) {}

  async getExpiringCertificates(companyId: string, days: number = 30) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    return this.prisma.certificateRecord.findMany({ where: { companyId, expiryDate: { lte: threshold, gte: new Date() }, status: { in: ['active', 'pending_renewal'] } }, orderBy: { expiryDate: 'asc' } });
  }

  async getExpiredCertificates(companyId: string) {
    return this.prisma.certificateRecord.findMany({ where: { companyId, expiryDate: { lt: new Date() }, status: { not: 'expired' } }, orderBy: { expiryDate: 'asc' } });
  }

  async archiveCertificate(id: string, companyId: string) {
    return this.prisma.certificateRecord.updateMany({ where: { id, companyId }, data: { status: 'archived' } });
  }
}
