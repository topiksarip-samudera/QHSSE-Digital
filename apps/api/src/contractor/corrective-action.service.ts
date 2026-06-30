import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractorCorrectiveActionService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.contractorId) where.contractorId = query.contractorId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.contractorCorrectiveAction.findMany({ where, orderBy: { dueDate: 'asc' }, include: { contractor: { select: { id: true, name: true } } } }),
      this.prisma.contractorCorrectiveAction.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) { return this.prisma.contractorCorrectiveAction.findFirst({ where: { id, companyId }, include: { contractor: true } }); }

  async create(dto: any, companyId: string, userId: string) { return this.prisma.contractorCorrectiveAction.create({ data: { ...dto, companyId, createdBy: userId } }); }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.contractorCorrectiveAction.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.contractorCorrectiveAction.update({ where: { id }, data: dto });
  }

  async complete(id: string, companyId: string) {
    return this.prisma.contractorCorrectiveAction.update({ where: { id }, data: { status: 'completed', completedAt: new Date() } });
  }

  async delete(id: string, companyId: string) { return this.prisma.contractorCorrectiveAction.delete({ where: { id } }); }
}
