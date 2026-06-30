import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalReportService {
  constructor(private prisma: PrismaService) {}

  async getComplianceScore(companyId: string) {
    const [total, compliant] = await Promise.all([
      this.prisma.complianceAssessment.count({ where: { companyId } }),
      this.prisma.complianceAssessment.count({ where: { companyId, complianceStatus: 'compliant' } }),
    ]);
    return { totalAssessments: total, compliantAssessments: compliant, score: total > 0 ? Math.round((compliant / total) * 100) : 0 };
  }

  async getGapReport(companyId: string) {
    return this.prisma.complianceGap.findMany({ where: { companyId }, include: { requirement: true }, orderBy: { dueDate: 'asc' } });
  }

  async getAuditReadiness(companyId: string) {
    const [assessments, evidence, gaps] = await Promise.all([
      this.prisma.complianceAssessment.count({ where: { companyId } }),
      this.prisma.complianceEvidence.count({ where: { companyId, verificationStatus: 'verified' } }),
      this.prisma.complianceGap.count({ where: { companyId, status: 'open' } }),
    ]);
    const ready = gaps === 0 && assessments > 0;
    return { ready, assessments, verifiedEvidence: evidence, openGaps: gaps };
  }
}
