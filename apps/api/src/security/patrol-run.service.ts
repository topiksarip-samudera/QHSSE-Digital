import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatrolRunService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.routeId) where.routeId = query.routeId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.securityPatrolRun.findMany({ where, orderBy: { startedAt: 'desc' }, include: { route: true } }),
      this.prisma.securityPatrolRun.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) { return this.prisma.securityPatrolRun.findFirst({ where: { id, companyId }, include: { route: true, checkpointLogs: true } }); }

  async startRun(routeId: string, officerId: string, companyId: string) {
    return this.prisma.securityPatrolRun.create({ data: { routeId, officerId, companyId, status: 'in_progress', startedAt: new Date() } });
  }

  async scanCheckpoint(runId: string, checkpointId: string, companyId: string) {
    return this.prisma.securityCheckpointLog.create({ data: { runId, checkpointId, companyId, scannedAt: new Date() } });
  }

  async completeRun(id: string, companyId: string) {
    return this.prisma.securityPatrolRun.update({ where: { id }, data: { status: 'completed', completedAt: new Date() } });
  }

  async getRuns(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.officerId) where.officerId = query.officerId;
    const [data, total] = await Promise.all([
      this.prisma.securityPatrolRun.findMany({ where, orderBy: { startedAt: 'desc' }, include: { route: true } }),
      this.prisma.securityPatrolRun.count({ where }),
    ]);
    return { data, total };
  }
}
