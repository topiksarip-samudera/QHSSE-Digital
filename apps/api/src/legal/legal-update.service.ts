import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LegalUpdateService {
  constructor(private prisma: PrismaService) {}

  // ─── Regulatory Update Log ──────────────────────────────────────────────

  async createUpdateLog(dto: CreateUpdateLogDto, companyId: string) {
    return this.prisma.regulatoryUpdateLog.create({
      data: { ...dto, effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : undefined, companyId },
    });
  }

  async findUpdateLogs(companyId: string, query: any) {
    const { updateType, impact, actionRequired, page = 1, limit = 20 } = query || {};
    const where: any = { companyId };
    if (updateType) where.updateType = updateType;
    if (impact) where.impact = impact;
    if (actionRequired !== undefined) where.actionRequired = actionRequired === 'true' || actionRequired === true;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.regulatoryUpdateLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.regulatoryUpdateLog.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findUpdateLog(id: string, companyId: string) {
    const u = await this.prisma.regulatoryUpdateLog.findUnique({ where: { id } });
    if (!u || u.companyId !== companyId) throw new NotFoundException('Update log not found');
    return u;
  }

  async reviewUpdate(id: string, companyId: string, userId: string, result: any) {
    const u = await this.findUpdateLog(id, companyId);
    return this.prisma.regulatoryUpdateLog.update({
      where: { id: u.id },
      data: { reviewedBy: userId, actionRequired: result.actionRequired ?? false, actionId: result.actionId },
    });
  }

  // ─── Review Schedule ────────────────────────────────────────────────────

  async getReviewSchedule(companyId: string) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [dueObligations, upcomingUpdates] = await Promise.all([
      this.prisma.legalObligation.findMany({
        where: { companyId, status: { in: ['open', 'in_progress'] }, dueDate: { lte: thirtyDaysFromNow } },
        include: { regulation: { select: { id: true, title: true } } },
        orderBy: { dueDate: 'asc' },
        take: 50,
      }),
      this.prisma.regulatoryUpdateLog.findMany({
        where: { companyId, reviewedBy: null },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const overdue = dueObligations.filter(o => o.dueDate && o.dueDate < today);
    const upcoming = dueObligations.filter(o => o.dueDate && o.dueDate >= today);

    return { overdue, upcoming, unreviewedUpdates: upcomingUpdates };
  }

  async getComplianceCalendar(companyId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    const obligations = await this.prisma.legalObligation.findMany({
      where: { companyId, dueDate: { gte: start, lte: end }, status: { not: 'closed' } },
      include: { regulation: { select: { id: true, title: true } } },
      orderBy: { dueDate: 'asc' },
    });

    const updateLogs = await this.prisma.regulatoryUpdateLog.findMany({
      where: { companyId, effectiveDate: { gte: start, lte: end } },
      orderBy: { effectiveDate: 'asc' },
    });

    return { obligations, updateLogs };
  }
}
