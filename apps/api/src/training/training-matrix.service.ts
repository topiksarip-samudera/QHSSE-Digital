import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingMatrixService {
  constructor(private prisma: PrismaService) {}

  // ─── Training Matrices ──────────────────────────────────────────────────

  async findAllMatrices(companyId: string, query?: { type?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.type) where.type = query.type;
    const [data, total] = await Promise.all([
      this.prisma.trainingMatrix.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.trainingMatrix.count({ where }),
    ]);
    return { data, total };
  }

  async findMatrixById(id: string, companyId: string) {
    return this.prisma.trainingMatrix.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async createMatrix(companyId: string, userId: string, dto: any) {
    return this.prisma.trainingMatrix.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateMatrix(id: string, companyId: string, userId: string, dto: any) {
    await this.prisma.trainingMatrix.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingMatrix.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async deleteMatrix(id: string, companyId: string) {
    await this.prisma.trainingMatrix.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingMatrix.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Training Plans ─────────────────────────────────────────────────────

  async findAllPlans(companyId: string, query?: { status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.trainingPlan.findMany({ where, orderBy: { startDate: 'desc' }, include: { sessions: true } }),
      this.prisma.trainingPlan.count({ where }),
    ]);
    return { data, total };
  }

  async findPlanById(id: string, companyId: string) {
    return this.prisma.trainingPlan.findFirst({ where: { id, companyId, deletedAt: null }, include: { sessions: true } });
  }

  async createPlan(companyId: string, userId: string, dto: any) {
    return this.prisma.trainingPlan.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updatePlan(id: string, companyId: string, userId: string, dto: any) {
    await this.prisma.trainingPlan.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingPlan.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async deletePlan(id: string, companyId: string) {
    await this.prisma.trainingPlan.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingPlan.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Training Sessions ──────────────────────────────────────────────────

  async findAllSessions(companyId: string, query?: { planId?: string; status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.planId) where.planId = query.planId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.trainingSession.findMany({ where, orderBy: { actualDate: 'desc' }, include: { attendances: true } }),
      this.prisma.trainingSession.count({ where }),
    ]);
    return { data, total };
  }

  async findSessionById(id: string, companyId: string) {
    return this.prisma.trainingSession.findFirst({ where: { id, companyId, deletedAt: null }, include: { attendances: true } });
  }

  async createSession(companyId: string, userId: string, dto: any) {
    return this.prisma.trainingSession.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateSession(id: string, companyId: string, dto: any) {
    await this.prisma.trainingSession.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingSession.update({ where: { id }, data: dto });
  }

  async closeSession(id: string, companyId: string) {
    await this.prisma.trainingSession.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingSession.update({ where: { id }, data: { status: 'completed' } });
  }

  async deleteSession(id: string, companyId: string) {
    await this.prisma.trainingSession.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingSession.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Training Attendances ───────────────────────────────────────────────

  async findAllAttendances(companyId: string, query?: { sessionId?: string; userId?: string }) {
    const where: any = { companyId };
    if (query?.sessionId) where.sessionId = query.sessionId;
    if (query?.userId) where.userId = query.userId;
    const [data, total] = await Promise.all([
      this.prisma.trainingAttendance.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.trainingAttendance.count({ where }),
    ]);
    return { data, total };
  }

  async createAttendance(companyId: string, dto: any) {
    return this.prisma.trainingAttendance.create({ data: { ...dto, companyId } });
  }

  async updateAttendance(id: string, companyId: string, dto: any) {
    await this.prisma.trainingAttendance.findFirstOrThrow({ where: { id, companyId } });
    return this.prisma.trainingAttendance.update({ where: { id }, data: dto });
  }
}
