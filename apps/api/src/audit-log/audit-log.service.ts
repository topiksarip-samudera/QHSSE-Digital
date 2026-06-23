import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogQueryDto, ActivityLogQueryDto, LoginHistoryQueryDto } from './dto/audit-log-query.dto';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  // ─── Audit Logs ─────────────────────────────────────────────────────────────

  async getAuditLogs(companyId: string, query: AuditLogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (query.module) where.module = query.module;
    if (query.action) where.action = query.action;
    if (query.actorId) where.actorId = query.actorId;
    if (query.recordType) where.recordType = query.recordType;
    if (query.recordId) where.recordId = query.recordId;

    if (query.search) {
      where.OR = [
        { module: { contains: query.search, mode: 'insensitive' } },
        { action: { contains: query.search, mode: 'insensitive' } },
        { recordType: { contains: query.search, mode: 'insensitive' } },
        { recordId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
      if (query.toDate) where.createdAt.lte = new Date(query.toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { actor: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAuditLogById(id: string, companyId: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { actor: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });

    if (!log) throw new NotFoundException('Audit log not found');
    if (companyId && log.companyId && log.companyId !== companyId) {
      throw new NotFoundException('Audit log not found');
    }

    return log;
  }

  async getAuditLogStats(companyId: string) {
    const [total, byModule, byAction, recentActivity] = await Promise.all([
      this.prisma.auditLog.count({ where: companyId ? { companyId } : {} }),
      this.prisma.auditLog.groupBy({
        by: ['module'],
        where: companyId ? { companyId } : {},
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where: companyId ? { companyId } : {},
        _count: { id: true },
      }),
      this.prisma.auditLog.findMany({
        where: companyId ? { companyId } : {},
        include: { actor: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      total,
      byModule: byModule.map((m) => ({ module: m.module, count: m._count.id })),
      byAction: byAction.map((a) => ({ action: a.action, count: a._count.id })),
      recentActivity,
    };
  }

  async exportAuditLogs(companyId: string, query: AuditLogQueryDto) {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (query.module) where.module = query.module;
    if (query.action) where.action = query.action;
    if (query.fromDate) {
      where.createdAt = { ...(where.createdAt || {}), gte: new Date(query.fromDate) };
    }
    if (query.toDate) {
      where.createdAt = { ...(where.createdAt || {}), lte: new Date(query.toDate) };
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: { actor: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    const csvHeader = 'ID,Timestamp,Module,Action,Record Type,Record ID,Actor Email,Actor Name,IP Address,User Agent\n';
    const csvRows = logs.map((log) =>
      [
        log.id,
        log.createdAt.toISOString(),
        log.module,
        log.action,
        log.recordType || '',
        log.recordId || '',
        log.actor?.email || '',
        log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : '',
        log.ipAddress || '',
        (log.userAgent || '').replace(/"/g, '""'),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );

    return csvHeader + csvRows.join('\n');
  }

  // ─── Activity Logs ──────────────────────────────────────────────────────────

  async getActivityLogs(companyId: string, query: ActivityLogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (query.activity) where.activity = query.activity;
    if (query.entity) where.entity = query.entity;
    if (query.actorId) where.actorId = query.actorId;

    if (query.search) {
      where.OR = [
        { activity: { contains: query.search, mode: 'insensitive' } },
        { entity: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
      if (query.toDate) where.createdAt.lte = new Date(query.toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        include: { actor: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async createActivityLog(data: {
    companyId: string;
    actorId: string;
    activity: string;
    entity?: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.activityLog.create({ data });
  }

  // ─── Login History ──────────────────────────────────────────────────────────

  async getLoginHistory(query: LoginHistoryQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.email) where.email = { contains: query.email, mode: 'insensitive' };

    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
      if (query.toDate) where.createdAt.lte = new Date(query.toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.loginHistory.findMany({
        where,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.loginHistory.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getLoginHistoryStats() {
    const [total, success, failed, blocked, recent] = await Promise.all([
      this.prisma.loginHistory.count(),
      this.prisma.loginHistory.count({ where: { status: 'success' } }),
      this.prisma.loginHistory.count({ where: { status: 'failed' } }),
      this.prisma.loginHistory.count({ where: { status: 'blocked' } }),
      this.prisma.loginHistory.findMany({
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return { total, success, failed, blocked, recent };
  }
}
