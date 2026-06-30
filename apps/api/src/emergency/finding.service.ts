import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class FindingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    return this.prisma.emergencyFinding.create({ data });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { drillId, category, severity, status, assignedTo, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (drillId) where.drillId = drillId;
    if (category) where.category = category;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyFinding.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyFinding.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.emergencyFinding.findFirst({ where: { id, companyId, deletedAt: null }, include: { correctiveActions: true } });
  }

  async update(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    return this.prisma.emergencyFinding.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.emergencyFinding.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
