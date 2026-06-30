import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ListUsageLogsQueryDto,
  GetUsageCostQueryDto,
  ListGuardrailEventsQueryDto,
  ListAuditLogsQueryDto,
  UsageStatisticsDto,
} from './dto/usage.dto';

@Injectable()
export class AIUsageService {
  constructor(private prisma: PrismaService) {}

  // ─── Usage Logs ─────────────────────────────────────────────────────────────

  async listUsageLogs(companyId: string, query: ListUsageLogsQueryDto) {
    const {
      page = 1,
      limit = 20,
      userId,
      providerId,
      providerKey,
      featureKey,
      moduleKey,
      conversationId,
      status,
      dateFrom,
      dateTo,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (userId) where.userId = userId;
    if (providerId) where.providerId = providerId;
    if (providerKey) where.providerKey = providerKey;
    if (featureKey) where.featureKey = featureKey;
    if (moduleKey) where.moduleKey = moduleKey;
    if (conversationId) where.conversationId = conversationId;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [logs, total] = await Promise.all([
      this.prisma.aIUsageLog.findMany({
        where,
        include: {
          provider: {
            select: { id: true, providerKey: true, name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIUsageLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUsageStatistics(companyId: string, query: GetUsageCostQueryDto): Promise<UsageStatisticsDto> {
    const { userId, providerKey, model, dateFrom, dateTo } = query;

    const where: any = { companyId };
    if (userId) where.userId = userId;
    if (providerKey) where.providerKey = providerKey;
    if (model) where.model = model;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const logs = await this.prisma.aIUsageLog.findMany({ where });

    const totalTokens = logs.reduce((sum, log) => sum + log.totalTokens, 0);
    const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
    const totalRequests = logs.length;
    const avgLatency = logs.reduce((sum, log) => sum + (log.latencyMs || 0), 0) / totalRequests || 0;
    const successCount = logs.filter(l => l.status === 'success').length;
    const successRate = (successCount / totalRequests) * 100 || 0;

    // Aggregate by feature
    const featureMap = new Map<string, { count: number; tokens: number; cost: number }>();
    logs.forEach(log => {
      const existing = featureMap.get(log.featureKey) || { count: 0, tokens: 0, cost: 0 };
      existing.count++;
      existing.tokens += log.totalTokens;
      existing.cost += log.cost;
      featureMap.set(log.featureKey, existing);
    });

    const topFeatures = Array.from(featureMap.entries())
      .map(([feature, data]) => ({ feature, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate by model
    const modelMap = new Map<string, { count: number; tokens: number; cost: number }>();
    logs.forEach(log => {
      if (log.model) {
        const existing = modelMap.get(log.model) || { count: 0, tokens: 0, cost: 0 };
        existing.count++;
        existing.tokens += log.totalTokens;
        existing.cost += log.cost;
        modelMap.set(log.model, existing);
      }
    });

    const topModels = Array.from(modelMap.entries())
      .map(([model, data]) => ({ model, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Daily trend (simplified)
    const dailyTrend = []; // TODO: Implement actual daily aggregation

    return {
      totalTokens,
      totalCost,
      totalRequests,
      avgLatency,
      successRate,
      topFeatures,
      topModels,
      dailyTrend,
    };
  }

  // ─── Cost Tracking ──────────────────────────────────────────────────────────

  async getCostLogs(companyId: string, query: GetUsageCostQueryDto) {
    const { providerKey, model, dateFrom, dateTo, groupBy = 'day' } = query;

    const where: any = { companyId };
    if (providerKey) where.providerKey = providerKey;
    if (model) where.model = model;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const costLogs = await this.prisma.aICostLog.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return costLogs;
  }

  // ─── Guardrail Events ───────────────────────────────────────────────────────

  async listGuardrailEvents(companyId: string, query: ListGuardrailEventsQueryDto) {
    const {
      page = 1,
      limit = 20,
      policyId,
      userId,
      eventType,
      severity,
      action,
      dateFrom,
      dateTo,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (policyId) where.policyId = policyId;
    if (userId) where.userId = userId;
    if (eventType) where.eventType = eventType;
    if (severity) where.severity = severity;
    if (action) where.action = action;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [events, total] = await Promise.all([
      this.prisma.aIGuardrailEvent.findMany({
        where,
        include: {
          policy: {
            select: { id: true, policyKey: true, name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIGuardrailEvent.count({ where }),
    ]);

    return {
      data: events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Audit Logs ─────────────────────────────────────────────────────────────

  async listAuditLogs(companyId: string, query: ListAuditLogsQueryDto) {
    const { page = 1, limit = 20, userId, action, resourceType, resourceId, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resourceType) where.resourceType = resourceType;
    if (resourceId) where.resourceId = resourceId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [logs, total] = await Promise.all([
      this.prisma.aIAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIAuditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Logging Helpers ────────────────────────────────────────────────────────

  async logUsage(data: {
    companyId: string;
    userId: string;
    providerId?: string;
    providerKey?: string;
    model?: string;
    featureKey: string;
    moduleKey?: string;
    conversationId?: string;
    messageId?: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
    latencyMs?: number;
    status: string;
    error?: string;
  }) {
    return this.prisma.aIUsageLog.create({ data });
  }

  async logAudit(data: {
    companyId: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.aIAuditLog.create({ data });
  }
}
