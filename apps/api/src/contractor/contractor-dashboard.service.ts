import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractorDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: string) {
    const [total, active, suspended, underReview, highRisk, workersTotal, equipmentTotal, prequalifications, expiringDocs] = await Promise.all([
      this.prisma.contractor.count({ where: { companyId } }),
      this.prisma.contractor.count({ where: { companyId, status: 'active' } }),
      this.prisma.contractor.count({ where: { companyId, status: 'suspended' } }),
      this.prisma.contractor.count({ where: { companyId, status: 'under_review' } }),
      this.prisma.contractor.count({ where: { companyId, riskLevel: 'high' } }),
      this.prisma.contractorWorker.count({ where: { companyId } }),
      this.prisma.contractorEquipment.count({ where: { companyId } }),
      this.prisma.prequalification.count({ where: { companyId } }),
      this.prisma.contractorDocument.count({ where: { companyId, expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, status: { not: 'expired' } } }),
    ]);
    return { total, active, suspended, underReview, highRisk, workersTotal, equipmentTotal, prequalifications, expiringDocs };
  }
}
