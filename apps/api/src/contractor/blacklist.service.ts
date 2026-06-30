import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlacklistService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.contractorBlacklist.findMany({ where, orderBy: { createdAt: 'desc' }, include: { contractor: { select: { id: true, name: true } } } }),
      this.prisma.contractorBlacklist.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) { return this.prisma.contractorBlacklist.findFirst({ where: { id, companyId }, include: { contractor: true } }); }

  async create(dto: any, companyId: string, userId: string) { return this.prisma.contractorBlacklist.create({ data: { ...dto, companyId, createdBy: userId } }); }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.contractorBlacklist.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.contractorBlacklist.update({ where: { id }, data: dto });
  }

  async remove(id: string, companyId: string) {
    return this.prisma.contractorBlacklist.update({ where: { id }, data: { status: 'removed', removedAt: new Date() } });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.contractorBlacklist.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.contractorBlacklist.delete({ where: { id } });
  }
}
