import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentEnergyService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: string, userId: string) {
    return this.prisma.environmentEnergyUsage.create({ data: { ...data, companyId, recordedBy: userId } });
  }

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.type) where.type = query.type;
    if (query?.siteId) where.siteId = query.siteId;
    if (query?.startDate || query?.endDate) {
      where.recordedAt = {};
      if (query?.startDate) where.recordedAt.gte = new Date(query.startDate);
      if (query?.endDate) where.recordedAt.lte = new Date(query.endDate);
    }
    const [data, total] = await Promise.all([
      this.prisma.environmentEnergyUsage.findMany({ where, orderBy: { recordedAt: 'desc' }, take: 100 }),
      this.prisma.environmentEnergyUsage.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.environmentEnergyUsage.findFirst({ where: { id, companyId } });
  }

  async update(id: string, data: any, companyId: string) {
    await this.prisma.environmentEnergyUsage.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.environmentEnergyUsage.update({ where: { id }, data });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.environmentEnergyUsage.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.environmentEnergyUsage.delete({ where: { id } });
  }
}
