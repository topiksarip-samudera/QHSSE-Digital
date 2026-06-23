import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OfflineSyncService {
  constructor(private prisma: PrismaService) {}

  async push(companyId: string, userId: string, items: any[]) {
    let synced = 0; let conflicts = 0; let errors = 0;
    for (const item of items) {
      try {
        const existing = await this.prisma.syncJob.findFirst({ where: { companyId, userId, recordId: item.recordId, status: 'queued' } });
        if (existing) {
          await this.prisma.syncConflict.create({ data: { syncJobId: existing.id, companyId, serverData: existing.payload as any, clientData: item.payload } });
          conflicts++;
          await this.prisma.syncJob.update({ where: { id: existing.id }, data: { status: 'conflict' } });
        } else {
          await this.prisma.syncJob.create({ data: { companyId, userId, module: item.module, action: item.action, recordType: item.recordType, recordId: item.recordId, payload: item.payload || {}, status: 'completed', syncedAt: new Date() } });
          synced++;
        }
      } catch { errors++; }
    }
    await this.prisma.syncLog.create({ data: { companyId, userId, action: 'push', items: synced, errors: errors + conflicts } });
    return { synced, conflicts, errors };
  }

  async pull(companyId: string, userId: string, since?: string) {
    const where: any = { companyId, userId };
    if (since) where.createdAt = { gte: new Date(since) };
    const jobs = await this.prisma.syncJob.findMany({ where: { ...where, status: 'completed' }, orderBy: { createdAt: 'desc' }, take: 100 });
    await this.prisma.syncLog.create({ data: { companyId, userId, action: 'pull', items: jobs.length } });
    return { items: jobs };
  }

  async getConflicts(companyId: string) {
    return this.prisma.syncConflict.findMany({ where: { companyId, resolution: null }, orderBy: { createdAt: 'desc' } });
  }

  async resolveConflict(conflictId: string, resolution: string, userId: string) {
    const c = await this.prisma.syncConflict.findUnique({ where: { id: conflictId } });
    if (!c) throw new NotFoundException('Conflict not found');
    await this.prisma.syncConflict.update({ where: { id: conflictId }, data: { resolution, resolvedBy: userId, resolvedAt: new Date() } });
    await this.prisma.syncJob.update({ where: { id: c.syncJobId }, data: { status: 'completed' } });
    await this.prisma.syncLog.create({ data: { companyId: c.companyId, userId, action: 'conflict_resolve', items: 1 } });
    return { resolved: true };
  }

  async getStatus(companyId: string, userId: string) {
    const [queued, failed, conflicts] = await Promise.all([
      this.prisma.syncJob.count({ where: { companyId, userId, status: 'queued' } }),
      this.prisma.syncJob.count({ where: { companyId, userId, status: 'failed' } }),
      this.prisma.syncConflict.count({ where: { companyId, resolution: null } }),
    ]);
    return { queued, failed, pendingConflicts: conflicts };
  }
}
