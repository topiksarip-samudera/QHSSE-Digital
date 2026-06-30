import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingNeedService {
  constructor(private prisma: PrismaService) {}

  // ─── Training Need Records ──────────────────────────────────────────────

  async findAllNeeds(companyId: string, query?: { userId?: string; status?: string; priority?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.userId) where.userId = query.userId;
    if (query?.status) where.status = query.status;
    if (query?.priority) where.priority = query.priority;
    const [data, total] = await Promise.all([
      this.prisma.trainingNeedRecord.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.trainingNeedRecord.count({ where }),
    ]);
    return { data, total };
  }

  async findNeedById(id: string, companyId: string) {
    return this.prisma.trainingNeedRecord.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async createNeed(companyId: string, userId: string, dto: any) {
    return this.prisma.trainingNeedRecord.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateNeed(id: string, companyId: string, dto: any) {
    await this.prisma.trainingNeedRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingNeedRecord.update({ where: { id }, data: dto });
  }

  async deleteNeed(id: string, companyId: string) {
    await this.prisma.trainingNeedRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingNeedRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async waiveNeed(id: string, companyId: string, userId: string) {
    await this.prisma.trainingNeedRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingNeedRecord.update({ where: { id }, data: { status: 'waived', updatedBy: userId } });
  }

  // ─── Induction Records ──────────────────────────────────────────────────

  async findAllInductions(companyId: string, query?: { userId?: string; inductionType?: string; status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.userId) where.userId = query.userId;
    if (query?.inductionType) where.inductionType = query.inductionType;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.inductionRecord.findMany({ where, orderBy: { date: 'desc' } }),
      this.prisma.inductionRecord.count({ where }),
    ]);
    return { data, total };
  }

  async findInductionById(id: string, companyId: string) {
    return this.prisma.inductionRecord.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async createInduction(companyId: string, userId: string, dto: any) {
    return this.prisma.inductionRecord.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateInduction(id: string, companyId: string, dto: any) {
    await this.prisma.inductionRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.inductionRecord.update({ where: { id }, data: dto });
  }

  async deleteInduction(id: string, companyId: string) {
    await this.prisma.inductionRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.inductionRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Toolbox Meetings ───────────────────────────────────────────────────

  async findAllToolboxMeetings(companyId: string, query?: { date?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.date) where.date = { gte: new Date(query.date) };
    const [data, total] = await Promise.all([
      this.prisma.toolboxMeeting.findMany({ where, orderBy: { date: 'desc' }, include: { attendances: true } }),
      this.prisma.toolboxMeeting.count({ where }),
    ]);
    return { data, total };
  }

  async findToolboxMeetingById(id: string, companyId: string) {
    return this.prisma.toolboxMeeting.findFirst({ where: { id, companyId, deletedAt: null }, include: { attendances: true } });
  }

  async createToolboxMeeting(companyId: string, userId: string, dto: any) {
    return this.prisma.toolboxMeeting.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateToolboxMeeting(id: string, companyId: string, dto: any) {
    await this.prisma.toolboxMeeting.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.toolboxMeeting.update({ where: { id }, data: dto });
  }

  async deleteToolboxMeeting(id: string, companyId: string) {
    await this.prisma.toolboxMeeting.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.toolboxMeeting.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Toolbox Attendances ────────────────────────────────────────────────

  async findAllToolboxAttendances(companyId: string, query?: { meetingId?: string; userId?: string }) {
    const where: any = { companyId };
    if (query?.meetingId) where.meetingId = query.meetingId;
    if (query?.userId) where.userId = query.userId;
    const [data, total] = await Promise.all([
      this.prisma.toolboxAttendance.findMany({ where }),
      this.prisma.toolboxAttendance.count({ where }),
    ]);
    return { data, total };
  }

  async createToolboxAttendance(companyId: string, dto: any) {
    return this.prisma.toolboxAttendance.create({ data: { ...dto, companyId } });
  }

  // ─── Certificate Records ────────────────────────────────────────────────

  async findAllCertificates(companyId: string, query?: { userId?: string; status?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.userId) where.userId = query.userId;
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.certificateRecord.findMany({ where, orderBy: { issuedDate: 'desc' } }),
      this.prisma.certificateRecord.count({ where }),
    ]);
    return { data, total };
  }

  async findCertificateById(id: string, companyId: string) {
    return this.prisma.certificateRecord.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async createCertificate(companyId: string, userId: string, dto: any) {
    return this.prisma.certificateRecord.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async updateCertificate(id: string, companyId: string, dto: any) {
    await this.prisma.certificateRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.certificateRecord.update({ where: { id }, data: dto });
  }

  async renewCertificate(id: string, companyId: string, data: { issuedDate: string; expiryDate: string }) {
    await this.prisma.certificateRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.certificateRecord.update({ where: { id }, data: { issuedDate: new Date(data.issuedDate), expiryDate: new Date(data.expiryDate), status: 'active' } });
  }

  async revokeCertificate(id: string, companyId: string) {
    await this.prisma.certificateRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.certificateRecord.update({ where: { id }, data: { status: 'revoked' } });
  }

  async deleteCertificate(id: string, companyId: string) {
    await this.prisma.certificateRecord.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.certificateRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
