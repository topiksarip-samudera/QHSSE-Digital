import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetCalibrationService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.assetId) where.assetId = query.assetId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.assetCalibration.findMany({ where, orderBy: { nextDueDate: 'asc' }, include: { asset: { select: { id: true, name: true, registerCode: true } } } }),
      this.prisma.assetCalibration.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.assetCalibration.findFirst({ where: { id, companyId }, include: { asset: { select: { id: true, name: true } } } });
  }

  async findDue(companyId: string, days: number = 30) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    return this.prisma.assetCalibration.findMany({ where: { companyId, nextDueDate: { lte: threshold }, status: { not: 'completed' } }, include: { asset: true }, orderBy: { nextDueDate: 'asc' } });
  }

  async create(dto: any, companyId: string, userId: string) {
    return this.prisma.assetCalibration.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.assetCalibration.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetCalibration.update({ where: { id }, data: dto });
  }

  async complete(id: string, result: any, companyId: string) {
    await this.prisma.assetCalibration.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetCalibration.update({ where: { id }, data: { ...result, status: 'completed', calibratedAt: new Date() } });
  }

  async delete(id: string, companyId: string) {
    await this.prisma.assetCalibration.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.assetCalibration.delete({ where: { id } });
  }
}
