import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto, SavedSearchDto, SearchQueryDto } from './dto/search.dto';

@Injectable()
export class GlobalSearchService {
  constructor(private prisma: PrismaService) {}

  async search(companyId: string, dto: SearchDto) {
    const results: any[] = [];
    const searchTerm = dto.query;
    const module = dto.module;

    const searchConditions: any = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { title: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };

    // Search across modules
    let tables: Array<{ name: string; table: any; fields: string[] }> = [];
    if (!module || module === 'action') tables.push({ name: 'action', table: this.prisma.action, fields: ['title', 'description'] });
    if (!module || module === 'user') tables.push({ name: 'user', table: this.prisma.user, fields: ['firstName', 'lastName', 'email'] });
    if (!module || module === 'company') tables.push({ name: 'company', table: this.prisma.company, fields: ['name', 'description'] });
    if (!module || module === 'workflow') tables.push({ name: 'workflow', table: this.prisma.workflow, fields: ['name', 'description'] });
    if (!module || module === 'notification') tables.push({ name: 'notification', table: this.prisma.notification, fields: ['title', 'message'] });
    if (!module || module === 'form') tables.push({ name: 'form', table: this.prisma.form, fields: ['name', 'description'] });
    if (!module || module === 'checklist') tables.push({ name: 'checklist', table: this.prisma.checklist, fields: ['name', 'description'] });
    if (!module || module === 'template') tables.push({ name: 'template', table: this.prisma.template, fields: ['name', 'description'] });
    if (!module || module === 'schedule') tables.push({ name: 'schedule', table: this.prisma.schedule, fields: ['name', 'description'] });

    for (const t of tables) {
      try {
        const where: any = { companyId };
        if (dto.fromDate || dto.toDate) { where.createdAt = {}; if (dto.fromDate) where.createdAt.gte = new Date(dto.fromDate); if (dto.toDate) where.createdAt.lte = new Date(dto.toDate); }
        where.OR = t.fields.map((f: string) => ({ [f]: { contains: searchTerm, mode: 'insensitive' } }));
        const rows = await (t.table as any).findMany({ where, take: 5, select: { id: true, [t.fields[0]]: true } });
        rows.forEach((r: any) => results.push({ module: t.name, id: r.id, title: r[t.fields[0]] || r.name || r.title || r.firstName, url: `/dashboard/${t.name}s/${r.id}` }));
      } catch (e) { /* skip unsupported fields */ }
    }

    // Also search audit logs
    if (!module || module === 'audit') {
      try {
        const logs = await this.prisma.auditLog.findMany({ where: { companyId, OR: [{ module: { contains: searchTerm, mode: 'insensitive' } }, { action: { contains: searchTerm, mode: 'insensitive' } }] }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, module: true, action: true } });
        logs.forEach((l: any) => results.push({ module: 'audit-log', id: l.id, title: `${l.module} / ${l.action}`, url: `/dashboard/audit-log/${l.id}` }));
      } catch (e) { }
    }

    // Log search
    await this.prisma.searchLog.create({ data: { companyId, userId: 'system', query: searchTerm, module: module || 'all', results: results.length } });

    return { query: searchTerm, total: results.length, results };
  }

  async createSaved(dto: SavedSearchDto, companyId: string, userId: string) {
    return this.prisma.savedSearch.create({ data: { companyId, userId, name: dto.name, query: dto.query, filters: dto.filters || {} } });
  }

  async getSaved(companyId: string, userId: string, query: SearchQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.savedSearch.findMany({ where: { companyId, userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.savedSearch.count({ where: { companyId, userId } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async deleteSaved(id: string) {
    await this.prisma.savedSearch.delete({ where: { id } });
    return { success: true };
  }

  async getRecent(companyId: string, userId: string) {
    return this.prisma.searchLog.findMany({ where: { companyId, userId }, orderBy: { createdAt: 'desc' }, take: 10, distinct: ['query'] });
  }
}
