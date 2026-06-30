import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalApplicabilityService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: { regulationId?: string; siteId?: string; departmentId?: string }) {
    const where: any = { companyId };
    if (query?.regulationId) where.regulationId = query.regulationId;
    if (query?.siteId) where.siteId = query.siteId;
    if (query?.departmentId) where.departmentId = query.departmentId;
    const [data, total] = await Promise.all([
      this.prisma.applicabilityMatrix.findMany({ where, orderBy: { createdAt: 'desc' }, include: { regulation: true } }),
      this.prisma.applicabilityMatrix.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.applicabilityMatrix.findFirst({ where: { id, companyId } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.applicabilityMatrix.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.applicabilityMatrix.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.applicabilityMatrix.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.applicabilityMatrix.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.applicabilityMatrix.delete({ where: { id } });
  }
}
