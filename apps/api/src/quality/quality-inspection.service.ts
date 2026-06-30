import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialReceivingDto, UpdateMaterialReceivingDto } from './dto/supplier.dto';
import { CreateItpDto, UpdateItpDto, CreateInspectionResultDto, UpdateInspectionResultDto } from './dto/inspection.dto';
import { CreatePunchListDto, UpdatePunchListDto, CreateDefectDto, UpdateDefectDto } from './dto/punch.dto';

@Injectable()
export class QualityInspectionService {
  constructor(private prisma: PrismaService) {}

  // ─── Material Receiving CRUD ─────────────────────────────────────────────

  async createMaterialReceiving(dto: CreateMaterialReceivingDto, companyId: string, userId: string) {
    return this.prisma.materialReceivingRecord.create({
      data: { ...dto, receivingDate: new Date(dto.receivingDate), companyId, createdBy: userId },
    });
  }

  async findAllMaterialReceiving(companyId: string, query: any) {
    const { search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { supplierName: { contains: search, mode: 'insensitive' } }, { materialName: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.materialReceivingRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.materialReceivingRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findMaterialReceiving(id: string, companyId: string) {
    const r = await this.prisma.materialReceivingRecord.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Material receiving record not found');
    return r;
  }

  async updateMaterialReceiving(id: string, dto: UpdateMaterialReceivingDto, companyId: string) {
    await this.findMaterialReceiving(id, companyId);
    return this.prisma.materialReceivingRecord.update({ where: { id }, data: dto });
  }

  async deleteMaterialReceiving(id: string, companyId: string) {
    await this.findMaterialReceiving(id, companyId);
    return this.prisma.materialReceivingRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── ITP CRUD ────────────────────────────────────────────────────────────

  async createItp(dto: CreateItpDto, companyId: string, userId: string) {
    return this.prisma.inspectionTestPlan.create({
      data: { ...dto, companyId, createdBy: userId },
    });
  }

  async findAllItp(companyId: string, query: any) {
    const { status, search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { itpNumber: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.inspectionTestPlan.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { results: true, _count: { select: { results: true } } } }),
      this.prisma.inspectionTestPlan.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findItp(id: string, companyId: string) {
    const r = await this.prisma.inspectionTestPlan.findUnique({ where: { id }, include: { results: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('ITP not found');
    return r;
  }

  async updateItp(id: string, dto: UpdateItpDto, companyId: string) {
    await this.findItp(id, companyId);
    return this.prisma.inspectionTestPlan.update({ where: { id }, data: dto });
  }

  async deleteItp(id: string, companyId: string) {
    await this.findItp(id, companyId);
    return this.prisma.inspectionTestPlan.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Inspection Results CRUD ─────────────────────────────────────────────

  async createInspectionResult(dto: CreateInspectionResultDto, companyId: string, userId: string) {
    return this.prisma.inspectionResult.create({
      data: { ...dto, inspectedAt: new Date(dto.inspectedAt), companyId, createdBy: userId },
    });
  }

  async findResultsByItp(itpId: string, companyId: string) {
    return this.prisma.inspectionResult.findMany({ where: { itpId, companyId }, orderBy: { createdAt: 'desc' } });
  }

  async findAllResults(companyId: string, query: any) {
    const { passFail, page = 1, limit = 20 } = query || {};
    const where: any = { companyId };
    if (passFail) where.passFail = passFail;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.inspectionResult.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { itp: { select: { id: true, title: true, itpNumber: true } } } }),
      this.prisma.inspectionResult.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findResult(id: string, companyId: string) {
    const r = await this.prisma.inspectionResult.findUnique({ where: { id }, include: { itp: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Inspection result not found');
    return r;
  }

  async updateResult(id: string, dto: UpdateInspectionResultDto, companyId: string) {
    await this.findResult(id, companyId);
    return this.prisma.inspectionResult.update({ where: { id }, data: dto });
  }

  // ─── Punch List CRUD ─────────────────────────────────────────────────────

  async createPunchList(dto: CreatePunchListDto, companyId: string, userId: string) {
    return this.prisma.punchList.create({
      data: { ...dto, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined, companyId, createdBy: userId },
    });
  }

  async findAllPunchLists(companyId: string, query: any) {
    const { status, priority, search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { location: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.punchList.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.punchList.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findPunchList(id: string, companyId: string) {
    const r = await this.prisma.punchList.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Punch list not found');
    return r;
  }

  async updatePunchList(id: string, dto: UpdatePunchListDto, companyId: string) {
    await this.findPunchList(id, companyId);
    return this.prisma.punchList.update({ where: { id }, data: { ...dto, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined } });
  }

  async deletePunchList(id: string, companyId: string) {
    await this.findPunchList(id, companyId);
    return this.prisma.punchList.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Defect CRUD ─────────────────────────────────────────────────────────

  async createDefect(dto: CreateDefectDto, companyId: string, userId: string) {
    return this.prisma.defectRecord.create({
      data: { ...dto, foundDate: new Date(dto.foundDate), companyId, createdBy: userId },
    });
  }

  async findAllDefects(companyId: string, query: any) {
    const { status, severity, defectType, search, page = 1, limit = 20 } = query || {};
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (defectType) where.defectType = defectType;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { location: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.defectRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { capaRecords: true } }),
      this.prisma.defectRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findDefect(id: string, companyId: string) {
    const r = await this.prisma.defectRecord.findUnique({ where: { id }, include: { capaRecords: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Defect not found');
    return r;
  }

  async updateDefect(id: string, dto: UpdateDefectDto, companyId: string) {
    await this.findDefect(id, companyId);
    return this.prisma.defectRecord.update({ where: { id }, data: dto });
  }

  async deleteDefect(id: string, companyId: string) {
    await this.findDefect(id, companyId);
    return this.prisma.defectRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
