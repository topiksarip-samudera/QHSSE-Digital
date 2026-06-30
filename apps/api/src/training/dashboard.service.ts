import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: string) {
    const [totalMatrices, totalPlans, totalSessions, completedSessions, totalCertificates, activeCertificates, expiredCertificates, totalCompetencies] = await Promise.all([
      this.prisma.trainingMatrix.count({ where: { companyId, deletedAt: null } }),
      this.prisma.trainingPlan.count({ where: { companyId, deletedAt: null } }),
      this.prisma.trainingSession.count({ where: { companyId, deletedAt: null } }),
      this.prisma.trainingSession.count({ where: { companyId, deletedAt: null, status: 'completed' } }),
      this.prisma.certificateRecord.count({ where: { companyId } }),
      this.prisma.certificateRecord.count({ where: { companyId, status: 'active' } }),
      this.prisma.certificateRecord.count({ where: { companyId, status: 'expired' } }),
      this.prisma.competencyAssessment.count({ where: { companyId } }),
    ]);
    const complianceRate = totalCertificates > 0 ? Math.round((activeCertificates / totalCertificates) * 100) : 0;
    return { totalMatrices, totalPlans, totalSessions, completedSessions, complianceRate, totalCertificates, activeCertificates, expiredCertificates, totalCompetencies };
  }
}
