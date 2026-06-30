import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDashboardDto, UpdateDashboardDto, DashboardQueryDto,
  DashboardWidgetDto, DashboardFilterDto,
} from './dto/reports.dto';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  // ─── Global Dashboard ─────────────────────────────────────────────────────

  async createDashboard(dto: CreateDashboardDto, companyId: string, userId: string) {
    return this.prisma.globalDashboard.create({
      data: {
        companyId, name: dto.name, type: dto.type, description: dto.description,
        config: dto.config || {}, isDefault: dto.isDefault || false,
        scope: dto.scope || 'company', scopeId: dto.scopeId, createdBy: userId,
      },
    });
  }

  async getDashboards(companyId: string, query: DashboardQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, isActive: true };
    if (query.type) where.type = query.type;
    if (query.scope) where.scope = query.scope;
    const [data, total] = await Promise.all([
      this.prisma.globalDashboard.findMany({
        where, include: { _count: { select: { widgets: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit,
      }),
      this.prisma.globalDashboard.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getDashboard(id: string, companyId: string) {
    const d = await this.prisma.globalDashboard.findUnique({
      where: { id },
      include: { widgets: { orderBy: { sortOrder: 'asc' } }, filters: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!d) throw new NotFoundException('Dashboard not found');
    if (d.companyId !== companyId) throw new ForbiddenException('Access denied');
    return d;
  }

  async updateDashboard(id: string, dto: UpdateDashboardDto, companyId: string) {
    await this.getDashboard(id, companyId);
    return this.prisma.globalDashboard.update({ where: { id }, data: dto });
  }

  async deleteDashboard(id: string, companyId: string) {
    await this.getDashboard(id, companyId);
    await this.prisma.globalDashboard.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  // ─── Dashboard Widgets ────────────────────────────────────────────────────

  async addWidget(dashboardId: string, dto: DashboardWidgetDto, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    return this.prisma.globalDashboardWidget.create({
      data: {
        dashboardId, type: dto.type, title: dto.title,
        config: dto.config || {}, position: dto.position || {}, sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async updateWidget(dashboardId: string, widgetId: string, data: any, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    const w = await this.prisma.globalDashboardWidget.findUnique({ where: { id: widgetId } });
    if (!w || w.dashboardId !== dashboardId) throw new NotFoundException('Widget not found');
    return this.prisma.globalDashboardWidget.update({ where: { id: widgetId }, data });
  }

  async deleteWidget(dashboardId: string, widgetId: string, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    await this.prisma.globalDashboardWidget.delete({ where: { id: widgetId } });
    return { success: true };
  }

  // ─── Dashboard Filters ────────────────────────────────────────────────────

  async addFilter(dashboardId: string, dto: DashboardFilterDto, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    return this.prisma.globalDashboardFilter.create({
      data: {
        dashboardId, name: dto.name, field: dto.field,
        filterType: dto.filterType, config: dto.config || {}, sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async updateFilter(dashboardId: string, filterId: string, data: any, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    const f = await this.prisma.globalDashboardFilter.findUnique({ where: { id: filterId } });
    if (!f || f.dashboardId !== dashboardId) throw new NotFoundException('Filter not found');
    return this.prisma.globalDashboardFilter.update({ where: { id: filterId }, data });
  }

  async deleteFilter(dashboardId: string, filterId: string, companyId: string) {
    await this.getDashboard(dashboardId, companyId);
    await this.prisma.globalDashboardFilter.delete({ where: { id: filterId } });
    return { success: true };
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  async getExecutiveDashboard(companyId: string) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const settings = await this.prisma.reportSetting.findUnique({ where: { companyId } });

    const [incidentCount, openIncidents, riskCount, auditCount, trainingCount, actionCount] = await Promise.all([
      this.prisma.incident.count({ where: { companyId, deletedAt: null, incidentDate: { gte: thisMonth } } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, status: { notIn: ['closed', 'cancelled'] } } }),
      this.prisma.risk.count({ where: { companyId, deletedAt: null } }),
      this.prisma.audit.count({ where: { companyId, deletedAt: null } }),
      this.prisma.trainingSession.count({ where: { companyId, deletedAt: null } }),
      this.prisma.action.count({ where: { companyId, deletedAt: null } }),
    ]);

    return {
      summary: {
        incidentsThisMonth: incidentCount,
        openIncidents,
        totalRisks: riskCount,
        totalAudits: auditCount,
        trainingSessions: trainingCount,
        openActions: actionCount,
      },
      settings: settings || { defaultFormat: 'pdf', autoExport: false, exportRetentionDays: 90, maxExportRows: 10000 },
    };
  }

  async getAnalyticsForModule(companyId: string, module: string) {
    const baseWhere = { companyId, deletedAt: null };
    let data: any = { module, metrics: {} };

    switch (module) {
      case 'incident':
        const [incidentTotal, incidentByStatus] = await Promise.all([
          this.prisma.incident.count({ where: baseWhere }),
          this.prisma.incident.groupBy({ by: ['status'], where: baseWhere, _count: true }),
        ]);
        data.metrics = { total: incidentTotal, byStatus: incidentByStatus };
        break;
      case 'risk':
        const [riskTotal, riskByLevel] = await Promise.all([
          this.prisma.risk.count({ where: baseWhere }),
          this.prisma.risk.groupBy({ by: ['residualRiskLevel'], where: { ...baseWhere, residualRiskLevel: { not: null } }, _count: true }),
        ]);
        data.metrics = { total: riskTotal, byLevel: riskByLevel };
        break;
      case 'audit':
        const [auditTotal, auditByStatus] = await Promise.all([
          this.prisma.audit.count({ where: baseWhere }),
          this.prisma.audit.groupBy({ by: ['status'], where: baseWhere, _count: true }),
        ]);
        data.metrics = { total: auditTotal, byStatus: auditByStatus };
        break;
      case 'training':
        const [trainTotal, trainByStatus] = await Promise.all([
          this.prisma.trainingSession.count({ where: baseWhere }),
          this.prisma.trainingSession.groupBy({ by: ['status'], where: baseWhere, _count: true }),
        ]);
        data.metrics = { total: trainTotal, byStatus: trainByStatus };
        break;
      default:
        data.metrics = { count: 0 };
    }
    return data;
  }

  async getKpis(companyId: string) {
    const baseWhere = { companyId, deletedAt: null };
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [openIncidents, openRisks, overdueActions, completedAudits] = await Promise.all([
      this.prisma.incident.count({ where: { ...baseWhere, status: { notIn: ['closed', 'cancelled'] } } }),
      this.prisma.risk.count({ where: { ...baseWhere, status: 'draft' } }),
      this.prisma.action.count({ where: { ...baseWhere, status: { not: 'closed' }, dueDate: { lt: now } } }),
      this.prisma.audit.count({ where: { ...baseWhere, status: 'closed' } }),
    ]);

    return [
      { name: 'TRIR', value: openIncidents, target: 0, unit: 'count', trend: 'down' },
      { name: 'Risk Reduction', value: openRisks, target: 0, unit: 'count', trend: 'down' },
      { name: 'Overdue Actions', value: overdueActions, target: 0, unit: 'count', trend: 'down' },
      { name: 'Audits Completed', value: completedAudits, target: 100, unit: 'count', trend: 'up' },
    ];
  }
}
