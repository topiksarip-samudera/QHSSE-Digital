import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QualityRcaService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.ncrId) where.ncrId = query.ncrId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.qualityRca.findMany({ where, orderBy: { createdAt: 'desc' }, include: { ncr: { select: { id: true, number: true, title: true } } } }),
      this.prisma.qualityRca.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.qualityRca.findFirst({ where: { id, companyId }, include: { ncr: { select: { id: true, number: true, title: true } } } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.qualityRca.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string, userId: string) {
    await this.prisma.qualityRca.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityRca.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.qualityRca.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.qualityRca.delete({ where: { id } });
  }
}
