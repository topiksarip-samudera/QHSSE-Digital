import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class MusterPointService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string) {
    return this.prisma.musterPoint.create({ data: { ...dto, companyId } });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { status, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.musterPoint.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.musterPoint.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.musterPoint.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async update(id: string, dto: any, companyId: string) {
    return this.prisma.musterPoint.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.musterPoint.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
