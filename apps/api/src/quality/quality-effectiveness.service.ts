import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QualityEffectivenessService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.capaId) where.capaId = query.capaId;
    const [data, total] = await Promise.all([
      this.prisma.qualityEffectivenessReview.findMany({ where, orderBy: { reviewDate: 'desc' } }),
      this.prisma.qualityEffectivenessReview.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.qualityEffectivenessReview.findFirst({ where: { id, companyId } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.qualityEffectivenessReview.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.qualityEffectivenessReview.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityEffectivenessReview.update({ where: { id }, data: dto });
  }

  async complete(id: string, outcome: string, companyId: string) {
    await this.prisma.qualityEffectivenessReview.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityEffectivenessReview.update({ where: { id }, data: { status: 'completed', outcome, completedAt: new Date() } });
  }
}
