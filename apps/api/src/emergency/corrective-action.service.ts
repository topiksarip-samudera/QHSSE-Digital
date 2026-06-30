import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type QueryParams = Record<string, any>;

@Injectable()
export class CorrectiveActionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, companyId: string) {
    const data: any = { ...dto, companyId };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    if (data.completionDate) data.completionDate = new Date(data.completionDate);
    return this.prisma.emergencyCorrectiveAction.create({ data });
  }

  async findAll(companyId: string, query: QueryParams) {
    const { findingId, status, responsiblePerson, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (findingId) where.findingId = findingId;
    if (status) where.status = status;
    if (responsiblePerson) where.responsiblePerson = responsiblePerson;
    if (search) where.description = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyCorrectiveAction.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyCorrectiveAction.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.emergencyCorrectiveAction.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async update(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    if (data.completionDate) data.completionDate = new Date(data.completionDate);
    return this.prisma.emergencyCorrectiveAction.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async complete(id: string, companyId: string) {
    return this.prisma.emergencyCorrectiveAction.updateMany({
      where: { id, companyId, deletedAt: null },
      data: { status: 'completed', completionDate: new Date() },
    });
  }

  async delete(id: string, companyId: string) {
    return this.prisma.emergencyCorrectiveAction.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }
}
