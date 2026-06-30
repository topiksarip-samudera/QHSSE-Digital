import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QualityCopqService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.category) where.category = query.category;
    if (query?.startDate || query?.endDate) {
      where.entryDate = {};
      if (query?.startDate) where.entryDate.gte = new Date(query.startDate);
      if (query?.endDate) where.entryDate.lte = new Date(query.endDate);
    }
    const [data, total] = await Promise.all([
      this.prisma.qualityCopq.findMany({ where, orderBy: { entryDate: 'desc' } }),
      this.prisma.qualityCopq.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.qualityCopq.findFirst({ where: { id, companyId } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.qualityCopq.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.qualityCopq.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityCopq.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.qualityCopq.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityCopq.delete({ where: { id } });
  }

  async getSummary(companyId: string) {
    const entries = await this.prisma.qualityCopq.findMany({ where: { companyId } });
    const categories = { prevention: 0, appraisal: 0, internal_failure: 0, external_failure: 0 };
    let total = 0;
    for (const e of entries) { if (categories[e.category] !== undefined) { categories[e.category] += e.amount; total += e.amount; } }
    return { total, ...categories, count: entries.length };
  }
}
