import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: string) {
    const [regulations, standards, requirements, obligations, assessments, gaps, evidence, applicableItems] = await Promise.all([
      this.prisma.regulation.count({ where: { companyId, deletedAt: null } }),
      this.prisma.legalStandard.count({ where: { companyId, deletedAt: null } }),
      this.prisma.legalRequirement.count({ where: { companyId, deletedAt: null } }),
      this.prisma.legalObligation.count({ where: { companyId, deletedAt: null } }),
      this.prisma.complianceAssessment.count({ where: { companyId } }),
      this.prisma.complianceGap.count({ where: { companyId, status: { not: 'closed' } } }),
      this.prisma.complianceEvidence.count({ where: { companyId, verificationStatus: 'pending' } }),
      this.prisma.applicabilityMatrix.count({ where: { companyId } }),
    ]);
    const openGaps = await this.prisma.complianceGap.count({ where: { companyId, status: 'open' } });
    const overdueGaps = await this.prisma.complianceGap.count({ where: { companyId, status: { not: 'closed' }, dueDate: { lt: new Date() } } });
    return { regulations, standards, requirements, obligations, assessments, gaps, openGaps, overdueGaps, evidence, applicableItems };
  }
}
