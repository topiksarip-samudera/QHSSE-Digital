import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDashboardDto, UpdateDashboardDto, DashboardQueryDto, WidgetDto } from './dto/dashboard-builder.dto';

@Injectable()
export class DashboardBuilderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDashboardDto, companyId: string, userId: string) {
    const dash = await this.prisma.dashboard.create({
      data: { companyId, name: dto.name, description: dto.description, layout: dto.layout || {}, scope: dto.scope || 'company', scopeId: dto.scopeId, isDefault: dto.isDefault || false, createdBy: userId },
    });
    if (dto.widgets) {
      for (const w of dto.widgets) {
        await this.prisma.dashboardWidget.create({ data: { dashboardId: dash.id, type: w.type, title: w.title, config: w.config || {}, position: w.position || { x: 0, y: 0, w: 6, h: 4 } } });
      }
    }
    return this.findOne(dash.id, companyId);
  }

  async findAll(companyId: string, query: DashboardQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.scope) where.scope = query.scope;
    const [data, total] = await Promise.all([
      this.prisma.dashboard.findMany({ where, include: { _count: { select: { widgets: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.dashboard.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const d = await this.prisma.dashboard.findUnique({ where: { id }, include: { widgets: { orderBy: { sortOrder: 'asc' } }, filters: { orderBy: { sortOrder: 'asc' } }, permissions: true } });
    if (!d) throw new NotFoundException('Not found');
    if (d.companyId !== companyId) throw new ForbiddenException('Access denied');
    return d;
  }

  async update(id: string, dto: UpdateDashboardDto, companyId: string) {
    const d = await this.findOne(id, companyId);
    return this.prisma.dashboard.update({ where: { id }, data: { name: dto.name ?? d.name, description: dto.description !== undefined ? dto.description : d.description, layout: dto.layout ?? d.layout } });
  }

  async addWidget(dashboardId: string, dto: WidgetDto, companyId: string) {
    await this.findOne(dashboardId, companyId);
    return this.prisma.dashboardWidget.create({ data: { dashboardId, type: dto.type, title: dto.title, config: dto.config || {}, position: dto.position || {} } });
  }

  async updateWidget(widgetId: string, data: any) {
    return this.prisma.dashboardWidget.update({ where: { id: widgetId }, data });
  }

  async deleteWidget(widgetId: string) {
    await this.prisma.dashboardWidget.delete({ where: { id: widgetId } });
    return { success: true };
  }

  async updateLayout(id: string, layout: any, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.dashboard.update({ where: { id }, data: { layout } });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.dashboard.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }
}
