import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetLotoService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.assetId) where.assetId = query.assetId;
    const [data, total] = await Promise.all([
      this.prisma.assetLotoPoint.findMany({ where, orderBy: { createdAt: 'desc' }, include: { asset: { select: { id: true, name: true, registerCode: true } } } }),
      this.prisma.assetLotoPoint.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.assetLotoPoint.findFirst({ where: { id, companyId }, include: { asset: { select: { id: true, name: true } } } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.assetLotoPoint.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.assetLotoPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetLotoPoint.update({ where: { id }, data: dto });
  }

  async verify(id: string, userId: string, companyId: string) {
    await this.prisma.assetLotoPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetLotoPoint.update({ where: { id }, data: { verificationStatus: 'verified', verifiedBy: userId, lastVerified: new Date() } });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.assetLotoPoint.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetLotoPoint.delete({ where: { id } });
  }
}
