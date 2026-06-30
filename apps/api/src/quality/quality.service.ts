import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateQualitySettingsDto } from './dto/quality-settings.dto';
import { CreateNcrDto, UpdateNcrDto, NcrQueryDto } from './dto/ncr.dto';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintQueryDto } from './dto/complaint.dto';
import { CreateSupplierQualityDto, UpdateSupplierQualityDto } from './dto/supplier.dto';
import { CreateDispositionDto } from './dto/disposition.dto';

@Injectable()
export class QualityService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-001';
  }

  // ─── Settings ───────────────────────────────────────────────────────────

  async getSettings(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.qualitySetting.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.qualitySetting.create({
        data: { companyId: cid, requireRootCauseMajorNcr: true, defaultNcrDueDays: 14, requireDisposition: true, requireCapaVerification: true },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateQualitySettingsDto) {
    return this.prisma.qualitySetting.upsert({
      where: { companyId },
      create: { companyId, requireRootCauseMajorNcr: dto.requireRootCauseMajorNcr ?? true, defaultNcrDueDays: dto.defaultNcrDueDays ?? 14, requireDisposition: dto.requireDisposition ?? true, requireCapaVerification: dto.requireCapaVerification ?? true },
      update: dto,
    });
  }

  async getMasterData(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    const groups = [
      { name: 'Quality Category', code: 'quality_category', items: [{ code: 'PRODUCT', name: 'Product' }, { code: 'PROCESS', name: 'Process' }, { code: 'SERVICE', name: 'Service' }, { code: 'SYSTEM', name: 'System' }] },
      { name: 'Quality Severity', code: 'quality_severity', items: [{ code: 'MINOR', name: 'Minor' }, { code: 'MAJOR', name: 'Major' }, { code: 'CRITICAL', name: 'Critical' }] },
      { name: 'NCR Type', code: 'ncr_type', items: [{ code: 'PRODUCT', name: 'Product Nonconformance' }, { code: 'PROCESS', name: 'Process Nonconformance' }, { code: 'MATERIAL', name: 'Material Nonconformance' }, { code: 'SYSTEM', name: 'System Nonconformance' }] },
      { name: 'NCR Source', code: 'ncr_source', items: [{ code: 'INSPECTION', name: 'Inspection' }, { code: 'AUDIT', name: 'Audit' }, { code: 'COMPLAINT', name: 'Customer Complaint' }, { code: 'SUPPLIER', name: 'Supplier' }, { code: 'INTERNAL', name: 'Internal Observation' }] },
      { name: 'Disposition Type', code: 'disposition_type', items: [{ code: 'REPAIR', name: 'Repair' }, { code: 'REWORK', name: 'Rework' }, { code: 'USE_AS_IS', name: 'Use As Is' }, { code: 'SCRAP', name: 'Scrap' }, { code: 'RETURN_TO_SUPPLIER', name: 'Return to Supplier' }] },
      { name: 'Root Cause Category', code: 'root_cause_category', items: [{ code: 'HUMAN_ERROR', name: 'Human Error' }, { code: 'PROCEDURE', name: 'Procedure Gap' }, { code: 'TRAINING', name: 'Training Deficiency' }, { code: 'EQUIPMENT', name: 'Equipment Failure' }, { code: 'MATERIAL', name: 'Material Defect' }, { code: 'ENVIRONMENT', name: 'Environmental Factor' }] },
      { name: 'CAPA Type', code: 'capa_type', items: [{ code: 'CORRECTIVE', name: 'Corrective Action' }, { code: 'PREVENTIVE', name: 'Preventive Action' }, { code: 'CORRECTION', name: 'Immediate Correction' }] },
      { name: 'Complaint Type', code: 'complaint_type', items: [{ code: 'PRODUCT', name: 'Product Quality' }, { code: 'SERVICE', name: 'Service Quality' }, { code: 'DELIVERY', name: 'Delivery Issue' }, { code: 'COMMUNICATION', name: 'Communication' }, { code: 'OTHER', name: 'Other' }] },
      { name: 'Supplier Issue Type', code: 'supplier_issue_type', items: [{ code: 'QUALITY', name: 'Quality Defect' }, { code: 'DELIVERY', name: 'Late Delivery' }, { code: 'DOCUMENTATION', name: 'Documentation Gap' }, { code: 'CERTIFICATION', name: 'Certification Issue' }] },
      { name: 'Inspection Type', code: 'inspection_type', items: [{ code: 'INCOMING', name: 'Incoming Inspection' }, { code: 'IN_PROCESS', name: 'In-Process Inspection' }, { code: 'FINAL', name: 'Final Inspection' }, { code: 'HOLD_POINT', name: 'Hold Point' }, { code: 'WITNESS_POINT', name: 'Witness Point' }] },
      { name: 'Defect Type', code: 'defect_type', items: [{ code: 'DIMENSIONAL', name: 'Dimensional' }, { code: 'COSMETIC', name: 'Cosmetic/Surface' }, { code: 'FUNCTIONAL', name: 'Functional' }, { code: 'ELECTRICAL', name: 'Electrical' }, { code: 'STRUCTURAL', name: 'Structural' }, { code: 'PACKAGING', name: 'Packaging' }, { code: 'DOCUMENTATION', name: 'Documentation' }] },
      { name: 'Calibration Status', code: 'calibration_status', items: [{ code: 'CALIBRATED', name: 'Calibrated' }, { code: 'DUE', name: 'Due for Calibration' }, { code: 'OVERDUE', name: 'Overdue' }, { code: 'OUT_OF_SERVICE', name: 'Out of Service' }] },
      { name: 'Cost Category', code: 'cost_category', items: [{ code: 'PREVENTION', name: 'Prevention Cost' }, { code: 'APPRAISAL', name: 'Appraisal Cost' }, { code: 'INTERNAL_FAILURE', name: 'Internal Failure' }, { code: 'EXTERNAL_FAILURE', name: 'External Failure' }] },
    ];
    return groups;
  }

  async seedDefaults(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    const groups = await this.getMasterData(cid);

    for (const group of groups) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { code: group.code } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.name, code: group.code, description: `Quality ${group.name}`, isSystem: true } });
      }
      for (const item of group.items) {
        const exists = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, code: item.code } });
        if (!exists) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: item.name, code: item.code, value: item.code.toLowerCase() } });
        }
      }
    }
    return { seeded: groups.reduce((s, g) => s + g.items.length, 0), groups: groups.length };
  }

  // ─── NCR CRUD ────────────────────────────────────────────────────────────

  async createNcr(dto: CreateNcrDto, companyId: string, userId: string) {
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return this.prisma.ncrRecord.create({
      data: { ...dto, dueDate, companyId, createdBy: userId },
    });
  }

  async findAllNcr(companyId: string, query: NcrQueryDto) {
    const { status, severity, ncrType, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (ncrType) where.ncrType = ncrType;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.ncrRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { dispositions: true, capaRecords: true, complaints: true, _count: { select: { dispositions: true, capaRecords: true } } } }),
      this.prisma.ncrRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findNcr(id: string, companyId: string) {
    const r = await this.prisma.ncrRecord.findUnique({ where: { id }, include: { dispositions: true, capaRecords: true, complaints: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('NCR not found');
    return r;
  }

  async updateNcr(id: string, dto: UpdateNcrDto, companyId: string) {
    await this.findNcr(id, companyId);
    return this.prisma.ncrRecord.update({ where: { id }, data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined } });
  }

  async deleteNcr(id: string, companyId: string) {
    await this.findNcr(id, companyId);
    return this.prisma.ncrRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async submitNcr(id: string, companyId: string) {
    const r = await this.findNcr(id, companyId);
    if (r.status !== 'draft') throw new Error('Only draft NCR can be submitted');
    return this.prisma.ncrRecord.update({ where: { id }, data: { status: 'submitted' } });
  }

  async reviewNcr(id: string, companyId: string) {
    const r = await this.findNcr(id, companyId);
    if (r.status !== 'submitted') throw new Error('Only submitted NCR can be reviewed');
    return this.prisma.ncrRecord.update({ where: { id }, data: { status: 'in_review' } });
  }

  async verifyNcr(id: string, companyId: string) {
    const r = await this.findNcr(id, companyId);
    if (r.status !== 'in_review') throw new Error('Only reviewed NCR can be verified');
    return this.prisma.ncrRecord.update({ where: { id }, data: { status: 'verified' } });
  }

  async closeNcr(id: string, companyId: string) {
    const r = await this.findNcr(id, companyId);
    return this.prisma.ncrRecord.update({ where: { id }, data: { status: 'closed', closedAt: new Date() } });
  }

  // ─── Customer Complaint CRUD ─────────────────────────────────────────────

  async createComplaint(dto: CreateComplaintDto, companyId: string, userId: string) {
    return this.prisma.customerComplaint.create({
      data: { ...dto, complaintDate: new Date(dto.complaintDate), companyId, createdBy: userId },
    });
  }

  async findAllComplaints(companyId: string, query: ComplaintQueryDto) {
    const { status, severity, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { customerName: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.customerComplaint.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { ncr: true, _count: { select: { capaRecords: true } } } }),
      this.prisma.customerComplaint.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findComplaint(id: string, companyId: string) {
    const r = await this.prisma.customerComplaint.findUnique({ where: { id }, include: { ncr: true, capaRecords: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Complaint not found');
    return r;
  }

  async updateComplaint(id: string, dto: UpdateComplaintDto, companyId: string) {
    await this.findComplaint(id, companyId);
    return this.prisma.customerComplaint.update({ where: { id }, data: dto });
  }

  async deleteComplaint(id: string, companyId: string) {
    await this.findComplaint(id, companyId);
    return this.prisma.customerComplaint.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Supplier Quality CRUD ───────────────────────────────────────────────

  async createSupplierQuality(dto: CreateSupplierQualityDto, companyId: string, userId: string) {
    return this.prisma.supplierQualityRecord.create({
      data: { ...dto, receivingDate: new Date(dto.receivingDate), companyId, createdBy: userId },
    });
  }

  async findAllSupplierQuality(companyId: string, query: any) {
    const { result, search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (result) where.result = result;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { supplierName: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.supplierQualityRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { ncr: true } }),
      this.prisma.supplierQualityRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findSupplierQuality(id: string, companyId: string) {
    const r = await this.prisma.supplierQualityRecord.findUnique({ where: { id }, include: { ncr: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Supplier quality record not found');
    return r;
  }

  async updateSupplierQuality(id: string, dto: UpdateSupplierQualityDto, companyId: string) {
    await this.findSupplierQuality(id, companyId);
    return this.prisma.supplierQualityRecord.update({ where: { id }, data: dto });
  }

  async deleteSupplierQuality(id: string, companyId: string) {
    await this.findSupplierQuality(id, companyId);
    return this.prisma.supplierQualityRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Disposition CRUD ────────────────────────────────────────────────────

  async createDisposition(dto: CreateDispositionDto, companyId: string, userId: string) {
    return this.prisma.disposition.create({
      data: { ...dto, companyId, createdBy: userId, approvedAt: new Date() },
    });
  }

  async findDispositionsByNcr(ncrId: string, companyId: string) {
    return this.prisma.disposition.findMany({ where: { ncrId, companyId }, orderBy: { createdAt: 'desc' } });
  }
}
