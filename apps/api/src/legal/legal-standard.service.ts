import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalStandardService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: { type?: string; status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.type) where.type = query.type;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.legalStandard.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.legalStandard.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.legalStandard.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.legalStandard.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.legalStandard.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.legalStandard.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.legalStandard.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.legalStandard.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
