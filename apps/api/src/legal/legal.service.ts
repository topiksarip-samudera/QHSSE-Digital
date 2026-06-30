import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLegalSettingsDto } from './dto/legal-settings.dto';
import { CreateRegulationDto, UpdateRegulationDto, RegulationQueryDto } from './dto/regulation.dto';
import { CreateObligationDto, UpdateObligationDto, CreateEvidenceDto } from './dto/obligation.dto';

@Injectable()
export class LegalService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-001';
  }

  // ─── Settings ───────────────────────────────────────────────────────────

  async getSettings(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.legalSetting.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.legalSetting.create({
        data: { companyId: cid, defaultComplianceDueDays: 90, requireEvidence: true, autoEscalateOverdue: true, escalationDays: 14 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateLegalSettingsDto) {
    return this.prisma.legalSetting.upsert({
      where: { companyId },
      create: { companyId, defaultComplianceDueDays: dto.defaultComplianceDueDays || 90, requireEvidence: dto.requireEvidence ?? true, autoEscalateOverdue: dto.autoEscalateOverdue ?? true, escalationDays: dto.escalationDays || 14 },
      update: dto,
    });
  }

  // ─── Regulations CRUD ───────────────────────────────────────────────────

  async createRegulation(dto: CreateRegulationDto, companyId: string, userId: string) {
    return this.prisma.regulation.create({
      data: { ...dto, effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : undefined, lastAmended: dto.lastAmended ? new Date(dto.lastAmended) : undefined, companyId, createdBy: userId },
    });
  }

  async findAllRegulations(companyId: string, query: RegulationQueryDto) {
    const { status, category, jurisdiction, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (category) where.category = category;
    if (jurisdiction) where.jurisdiction = jurisdiction;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.regulation.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { obligations: { select: { id: true, status: true } } } }),
      this.prisma.regulation.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findRegulation(id: string, companyId: string) {
    const r = await this.prisma.regulation.findUnique({ where: { id }, include: { obligations: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Regulation not found');
    return r;
  }

  async updateRegulation(id: string, dto: UpdateRegulationDto, companyId: string) {
    const r = await this.findRegulation(id, companyId);
    return this.prisma.regulation.update({
      where: { id: r.id },
      data: { ...dto, effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : undefined, lastAmended: dto.lastAmended ? new Date(dto.lastAmended) : undefined },
    });
  }

  async deleteRegulation(id: string, companyId: string) {
    await this.findRegulation(id, companyId);
    return this.prisma.regulation.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Obligations CRUD ──────────────────────────────────────────────────

  async createObligation(dto: CreateObligationDto, companyId: string, userId: string) {
    return this.prisma.legalObligation.create({
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, companyId, createdBy: userId },
    });
  }

  async findObligationsByRegulation(regulationId: string, companyId: string) {
    return this.prisma.legalObligation.findMany({
      where: { regulationId, companyId },
      include: { evidence: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllObligations(companyId: string, query: any) {
    const { status, page = 1, limit = 20 } = query || {};
    const where: any = { companyId };
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.legalObligation.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { regulation: { select: { id: true, title: true } }, evidence: true } }),
      this.prisma.legalObligation.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findObligation(id: string, companyId: string) {
    const o = await this.prisma.legalObligation.findUnique({ where: { id }, include: { regulation: true, evidence: true } });
    if (!o || o.companyId !== companyId) throw new NotFoundException('Obligation not found');
    return o;
  }

  async updateObligation(id: string, dto: UpdateObligationDto, companyId: string) {
    const o = await this.findObligation(id, companyId);
    return this.prisma.legalObligation.update({
      where: { id: o.id },
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined },
    });
  }

  async deleteObligation(id: string, companyId: string) {
    const o = await this.findObligation(id, companyId);
    return this.prisma.legalObligation.delete({ where: { id: o.id } });
  }

  // ─── Evidence CRUD ─────────────────────────────────────────────────────

  async createEvidence(dto: CreateEvidenceDto, companyId: string, userId: string) {
    return this.prisma.legalEvidence.create({
      data: { ...dto, companyId, uploadedBy: userId },
    });
  }

  async findEvidenceByObligation(obligationId: string, companyId: string) {
    return this.prisma.legalEvidence.findMany({
      where: { obligationId, companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteEvidence(id: string, companyId: string) {
    const e = await this.prisma.legalEvidence.findUnique({ where: { id } });
    if (!e || e.companyId !== companyId) throw new NotFoundException('Evidence not found');
    return this.prisma.legalEvidence.delete({ where: { id } });
  }

  // ─── Master Data ────────────────────────────────────────────────────────

  async getMasterData(companyId: string) {
    return this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] },
      include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  }

  async seedDefaults(companyId: string) {
    const groups = [
      { name: 'Legal Category', items: ['Safety', 'Health', 'Environment', 'Quality', 'Security', 'Labor', 'Industry'] },
      { name: 'Legal Jurisdiction', items: ['National', 'Provincial', 'Local', 'International'] },
      { name: 'Obligation Type', items: ['Mandatory', 'Voluntary', 'Recommended'] },
      { name: 'Obligation Frequency', items: ['Once', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Event-Based'] },
      { name: 'Regulation Status', items: ['Active', 'Amended', 'Repealed', 'Superseded'] },
      { name: 'Evidence Type', items: ['Document', 'Record', 'Photo', 'Report', 'Certificate'] },
      { name: 'Compliance Result', items: ['Compliant', 'Non Compliant', 'Partially Compliant', 'Not Applicable'] },
      { name: 'Gap Impact', items: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'Update Type', items: ['New Regulation', 'Amendment', 'Repeal', 'Guidance', 'Enforcement'] },
    ];
    let count = 0;
    for (const group of groups) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.name, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.name, code: group.name.toLowerCase().replace(/\s+/g, '_'), description: `Legal Compliance - ${group.name}`, companyId } });
      }
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\/\s]+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: groups.length };
  }
}
