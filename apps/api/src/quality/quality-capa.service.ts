import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCapaDto, UpdateCapaDto, CreateCalibrationDto, UpdateCalibrationDto } from './dto/capa.dto';

@Injectable()
export class QualityCapaService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-001';
  }

  // ─── CAPA CRUD ───────────────────────────────────────────────────────────

  async createCapa(dto: CreateCapaDto, companyId: string, userId: string) {
    return this.prisma.qualityCapaRecord.create({
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, companyId, createdBy: userId },
    });
  }

  async findAllCapa(companyId: string, query: any) {
    const { status, capaType, search, overdue, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (capaType) where.capaType = capaType;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (overdue === 'true') where.dueDate = { lt: new Date() };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.qualityCapaRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { ncr: { select: { id: true, title: true } }, defect: { select: { id: true, title: true } }, complaint: { select: { id: true, title: true } } } }),
      this.prisma.qualityCapaRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findCapa(id: string, companyId: string) {
    const r = await this.prisma.qualityCapaRecord.findUnique({ where: { id }, include: { ncr: true, defect: true, complaint: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('CAPA not found');
    return r;
  }

  async updateCapa(id: string, dto: UpdateCapaDto, companyId: string) {
    await this.findCapa(id, companyId);
    return this.prisma.qualityCapaRecord.update({ where: { id }, data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined } });
  }

  async deleteCapa(id: string, companyId: string) {
    await this.findCapa(id, companyId);
    return this.prisma.qualityCapaRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async verifyCapa(id: string, companyId: string, userId: string) {
    const r = await this.findCapa(id, companyId);
    return this.prisma.qualityCapaRecord.update({ where: { id }, data: { status: 'verified', verifiedById: userId } });
  }

  async rejectVerification(id: string, companyId: string) {
    const r = await this.findCapa(id, companyId);
    return this.prisma.qualityCapaRecord.update({ where: { id }, data: { status: 'in_progress', verifiedById: null } });
  }

  // ─── Calibration Equipment CRUD ──────────────────────────────────────────

  async createCalibration(dto: CreateCalibrationDto, companyId: string, userId: string) {
    return this.prisma.calibrationEquipment.create({
      data: { ...dto, calibrationDate: new Date(dto.calibrationDate), calibrationDue: new Date(dto.calibrationDue), companyId, createdBy: userId },
    });
  }

  async findAllCalibration(companyId: string, query: any) {
    const { result, overdue, search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (result) where.result = result;
    if (overdue === 'true') where.calibrationDue = { lt: new Date() };
    if (search) where.OR = [{ equipmentName: { contains: search, mode: 'insensitive' } }, { serialNumber: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.calibrationEquipment.findMany({ where, skip, take: limit, orderBy: { calibrationDue: 'asc' } }),
      this.prisma.calibrationEquipment.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findCalibration(id: string, companyId: string) {
    const r = await this.prisma.calibrationEquipment.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Calibration equipment not found');
    return r;
  }

  async updateCalibration(id: string, dto: UpdateCalibrationDto, companyId: string) {
    await this.findCalibration(id, companyId);
    return this.prisma.calibrationEquipment.update({
      where: { id },
      data: { ...dto, calibrationDate: dto.calibrationDate ? new Date(dto.calibrationDate) : undefined, calibrationDue: dto.calibrationDue ? new Date(dto.calibrationDue) : undefined },
    });
  }

  async deleteCalibration(id: string, companyId: string) {
    await this.findCalibration(id, companyId);
    return this.prisma.calibrationEquipment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Quality Score ───────────────────────────────────────────────────────

  async getScore(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.qualityScore.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.qualityScore.create({ data: { companyId: cid } });
    }

    const [ncrCount, complaintCount, supplierRejectionCount, auditFindings, capaCount] = await Promise.all([
      this.prisma.ncrRecord.count({ where: { companyId: cid, deletedAt: null } }),
      this.prisma.customerComplaint.count({ where: { companyId: cid, deletedAt: null } }),
      this.prisma.supplierQualityRecord.count({ where: { companyId: cid, deletedAt: null, result: 'reject' } }),
      this.prisma.ncrRecord.count({ where: { companyId: cid, deletedAt: null, sourceType: 'AUDIT' } }),
      this.prisma.qualityCapaRecord.count({ where: { companyId: cid, deletedAt: null } }),
    ]);

    const penalty = ncrCount * 2 + complaintCount * 3 + supplierRejectionCount * 5 + auditFindings + capaCount;
    const score = Math.max(0, 100 - penalty);
    const percentage = Math.max(0, 100 - penalty);

    const updated = await this.prisma.qualityScore.update({
      where: { companyId: cid },
      data: { ncrCount, customerComplaintCount: complaintCount, supplierRejectionCount, auditFindings, capaCount, score, percentage },
    });

    return updated;
  }

  // ─── Dashboard KPI ───────────────────────────────────────────────────────

  async getDashboard(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    const now = new Date();

    const [openNcr, overdueCapa, ncrBySeverity, calibrationDue, complaints, supplierIssues, defects, openPunchLists] = await Promise.all([
      this.prisma.ncrRecord.count({ where: { companyId: cid, deletedAt: null, status: { in: ['draft','submitted','in_review','verified'] } } }),
      this.prisma.qualityCapaRecord.count({ where: { companyId: cid, deletedAt: null, dueDate: { lt: now }, status: { not: 'closed' } } }),
      this.prisma.ncrRecord.groupBy({ by: ['severity'], where: { companyId: cid, deletedAt: null }, _count: true }),
      this.prisma.calibrationEquipment.count({ where: { companyId: cid, deletedAt: null, calibrationDue: { lt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) }, result: 'pass' } }),
      this.prisma.customerComplaint.count({ where: { companyId: cid, deletedAt: null, status: { not: 'closed' } } }),
      this.prisma.supplierQualityRecord.count({ where: { companyId: cid, deletedAt: null } }),
      this.prisma.defectRecord.count({ where: { companyId: cid, deletedAt: null, status: { not: 'closed' } } }),
      this.prisma.punchList.count({ where: { companyId: cid, deletedAt: null, status: { not: 'closed' } } }),
    ]);

    return {
      openNcr,
      overdueCapa,
      ncrBySeverity: ncrBySeverity.map(s => ({ severity: s.severity, count: s._count })),
      calibrationDue,
      openComplaints: complaints,
      supplierIssues,
      openDefects: defects,
      openPunchLists,
    };
  }
}
