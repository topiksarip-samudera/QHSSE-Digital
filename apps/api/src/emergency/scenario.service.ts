import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class ScenarioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.emergencyScenario.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { type, status, riskLevel, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (type) where.type = type;
    if (status) where.status = status;
    if (riskLevel) where.riskLevel = riskLevel;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyScenario.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyScenario.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.emergencyScenario.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async update(id: string, dto: any, companyId: string) {
    return this.prisma.emergencyScenario.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.emergencyScenario.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
