import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompetencyService {
  constructor(private prisma: PrismaService) {}

  // ─── Competency Matrices ────────────────────────────────────────────────

  async findAllMatrices(companyId: string, query?: { positionId?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.positionId) where.positionId = query.positionId;
    const [data, total] = await Promise.all([
      this.prisma.competencyMatrix.findMany({ where, orderBy: { competencyItem: 'asc' }, include: { assessments: true } }),
      this.prisma.competencyMatrix.count({ where }),
    ]);
    return { data, total };
  }

  async findMatrixById(id: string, companyId: string) {
    return this.prisma.competencyMatrix.findFirst({ where: { id, companyId, deletedAt: null }, include: { assessments: true } });
  }

  async createMatrix(companyId: string, userId: string, dto: any) {
    return this.prisma.competencyMatrix.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateMatrix(id: string, companyId: string, dto: any) {
    await this.prisma.competencyMatrix.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.competencyMatrix.update({ where: { id }, data: dto });
  }

  async deleteMatrix(id: string, companyId: string) {
    await this.prisma.competencyMatrix.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.competencyMatrix.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Competency Assessments ─────────────────────────────────────────────

  async findAllAssessments(companyId: string, query?: { userId?: string; result?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.userId) where.userId = query.userId;
    if (query?.result) where.result = query.result;
    const [data, total] = await Promise.all([
      this.prisma.competencyAssessment.findMany({ where, orderBy: { assessedDate: 'desc' }, include: { competencyItem: true } }),
      this.prisma.competencyAssessment.count({ where }),
    ]);
    return { data, total };
  }

  async findAssessmentById(id: string, companyId: string) {
    return this.prisma.competencyAssessment.findFirst({ where: { id, companyId, deletedAt: null }, include: { competencyItem: true } });
  }

  async createAssessment(companyId: string, userId: string, dto: any) {
    return this.prisma.competencyAssessment.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateAssessment(id: string, companyId: string, dto: any) {
    await this.prisma.competencyAssessment.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.competencyAssessment.update({ where: { id }, data: dto });
  }

  async deleteAssessment(id: string, companyId: string) {
    await this.prisma.competencyAssessment.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.competencyAssessment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
