import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalRequirementService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: { regulationId?: string; status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.regulationId) where.regulationId = query.regulationId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.legalRequirement.findMany({ where, orderBy: { createdAt: 'desc' }, include: { regulation: true, obligations: true } }),
      this.prisma.legalRequirement.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.legalRequirement.findFirst({ where: { id, companyId, deletedAt: null }, include: { regulation: true, obligations: true } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.legalRequirement.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.legalRequirement.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.legalRequirement.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.legalRequirement.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.legalRequirement.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
