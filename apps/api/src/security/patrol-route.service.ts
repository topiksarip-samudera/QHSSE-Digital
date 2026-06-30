import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatrolRouteService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    const [data, total] = await Promise.all([
      this.prisma.securityPatrolRoute.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, include: { checkpoints: true } }),
      this.prisma.securityPatrolRoute.count({ where: { companyId } }),
    ]);
    return { data, total };
  }

  async findOne(id: string, companyId: string) { return this.prisma.securityPatrolRoute.findFirst({ where: { id, companyId }, include: { checkpoints: true } }); }

  async create(dto: any, companyId: string, userId: string) { return this.prisma.securityPatrolRoute.create({ data: { ...dto, companyId, createdBy: userId } }); }

  async update(id: string, dto: any, companyId: string) {
    await this.prisma.securityPatrolRoute.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.securityPatrolRoute.update({ where: { id }, data: dto });
  }

  async delete(id: string, companyId: string) { return this.prisma.securityPatrolRoute.delete({ where: { id } }); }
}
