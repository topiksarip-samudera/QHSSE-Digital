import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class EvacuationRouteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string) {
    return this.prisma.evacuationRoute.create({ data: { ...dto, companyId } });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { status, siteId, musterPointId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (siteId) where.siteId = siteId;
    if (musterPointId) where.musterPointId = musterPointId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.evacuationRoute.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.evacuationRoute.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.evacuationRoute.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async update(id: string, dto: any, companyId: string) {
    return this.prisma.evacuationRoute.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.evacuationRoute.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
