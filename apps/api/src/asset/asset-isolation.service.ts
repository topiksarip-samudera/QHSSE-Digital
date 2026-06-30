import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetIsolationService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.assetId) where.assetId = query.assetId;
    const [data, total] = await Promise.all([
      this.prisma.assetIsolationPoint.findMany({ where, orderBy: { createdAt: 'desc' }, include: { asset: { select: { id: true, name: true } } } }),
      this.prisma.assetIsolationPoint.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.assetIsolationPoint.findFirst({ where: { id, companyId }, include: { asset: { select: { id: true, name: true } } } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.assetIsolationPoint.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.assetIsolationPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetIsolationPoint.update({ where: { id }, data: dto });
  }

  async verify(id: string, userId: string, companyId: string) {
    await this.prisma.assetIsolationPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetIsolationPoint.update({ where: { id }, data: { status: 'verified', verifiedBy: userId, lastVerified: new Date() } });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.assetIsolationPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetIsolationPoint.delete({ where: { id } });
  }
}
