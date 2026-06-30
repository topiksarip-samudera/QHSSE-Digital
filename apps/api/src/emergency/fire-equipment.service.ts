import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class FireEquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string) {
    const data: any = { ...dto, companyId };
    if (data.lastInspected) data.lastInspected = new Date(data.lastInspected);
    if (data.nextInspection) data.nextInspection = new Date(data.nextInspection);
    return this.prisma.fireEquipment.create({ data });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { type, inspectionStatus, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (type) where.type = type;
    if (inspectionStatus) where.inspectionStatus = inspectionStatus;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.fireEquipment.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.fireEquipment.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findDue(companyId: string, query: QueryParams) {
    const { siteId, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null, nextInspection: { lte: new Date() } };
    if (siteId) where.siteId = siteId;
    const [items, total] = await Promise.all([
      this.prisma.fireEquipment.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { nextInspection: 'asc' } }),
      this.prisma.fireEquipment.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.fireEquipment.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async update(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    if (data.lastInspected) data.lastInspected = new Date(data.lastInspected);
    if (data.nextInspection) data.nextInspection = new Date(data.nextInspection);
    return this.prisma.fireEquipment.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.fireEquipment.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
