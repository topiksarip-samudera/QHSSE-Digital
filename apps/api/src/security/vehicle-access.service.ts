import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehicleAccessService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.status) where.status = query.status;
    if (query?.siteId) where.siteId = query.siteId;
    const [data, total] = await Promise.all([
      this.prisma.vehicleAccessRecord.findMany({ where, orderBy: { checkInTime: 'desc' }, take: 100 }),
      this.prisma.vehicleAccessRecord.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) { return this.prisma.vehicleAccessRecord.findFirst({ where: { id, companyId } }); }

  async create(dto: any, companyId: string, userId: string) { return this.prisma.vehicleAccessRecord.create({ data: { ...dto, companyId, createdBy: userId } }); }

  async checkIn(id: string, companyId: string) {
    return this.prisma.vehicleAccessRecord.update({ where: { id }, data: { status: 'checked_in', checkInTime: new Date() } });
  }

  async checkOut(id: string, companyId: string) {
    return this.prisma.vehicleAccessRecord.update({ where: { id }, data: { status: 'checked_out', checkOutTime: new Date() } });
  }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.vehicleAccessRecord.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.vehicleAccessRecord.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) { return this.prisma.vehicleAccessRecord.delete({ where: { id } }); }
}
