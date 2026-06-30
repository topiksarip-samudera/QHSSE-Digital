import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalIncidents, criticalIncidents, visitorsToday, activeVisitors, vehiclesInside, gatePassesActive, openInvestigations, openActions] = await Promise.all([
      this.prisma.securityIncident.count({ where: { companyId } }),
      this.prisma.securityIncident.count({ where: { companyId, severity: 'critical' } }),
      this.prisma.visitorRecord.count({ where: { companyId, checkInTime: { gte: today } } }),
      this.prisma.visitorRecord.count({ where: { companyId, status: 'checked_in' } }),
      this.prisma.vehicleAccessRecord.count({ where: { companyId, status: 'checked_in' } }),
      this.prisma.gatePass.count({ where: { companyId, status: 'active' } }),
      this.prisma.securityInvestigation.count({ where: { companyId, status: { in: ['open', 'in_progress'] } } }),
      this.prisma.securityIncident.count({ where: { companyId, status: { not: 'closed' } } }),
    ]);
    return { totalIncidents, criticalIncidents, visitorsToday, activeVisitors, vehiclesInside, gatePassesActive, openInvestigations, openActions };
  }
}
