import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentKpiService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(companyId: string) {
    const [aspects, impacts, permits, waste, monitoringSchedules, spills, exceedances, energy] = await Promise.all([
      this.prisma.environmentAspect.count({ where: { companyId, deletedAt: null } }),
      this.prisma.environmentalImpact.count({ where: { companyId, deletedAt: null } }),
      this.prisma.environmentPermit.count({ where: { companyId } }),
      this.prisma.environmentWaste.count({ where: { companyId } }),
      this.prisma.environmentMonitoringSchedule.count({ where: { companyId } }),
      this.prisma.environmentalSpill.count({ where: { companyId } }),
      this.prisma.environmentExceedance.count({ where: { companyId } }),
      this.prisma.environmentEnergyUsage.count({ where: { companyId } }),
    ]);
    return { aspects, impacts, permits, waste, monitoringSchedules, spills, exceedances, energy };
  }
}
