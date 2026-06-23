import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRiskSettingsDto } from './dto/risk-settings.dto';
import { CreateRiskDto, UpdateRiskDto, RiskQueryDto } from './dto/create-risk.dto';
import { CreateHazardCategoryDto, CreateHazardDto, CreateConsequenceCategoryDto, CreateConsequenceDto, CreateMappingDto, HazardQueryDto } from './dto/hazard.dto';

const DEFAULT_SEVERITY = [
  { level: 1, label: 'Insignificant', code: 'insignificant', description: 'No injury / negligible damage' },
  { level: 2, label: 'Minor', code: 'minor', description: 'First aid / minor damage' },
  { level: 3, label: 'Moderate', code: 'moderate', description: 'Medical treatment / moderate damage' },
  { level: 4, label: 'Major', code: 'major', description: 'Serious injury / major damage' },
  { level: 5, label: 'Catastrophic', code: 'catastrophic', description: 'Fatality / catastrophic damage' },
];
const DEFAULT_LIKELIHOOD = [
  { level: 1, label: 'Rare', code: 'rare', description: 'Almost never occurs' },
  { level: 2, label: 'Unlikely', code: 'unlikely', description: 'Could occur occasionally' },
  { level: 3, label: 'Possible', code: 'possible', description: 'May occur sometimes' },
  { level: 4, label: 'Likely', code: 'likely', description: 'Probably occurs' },
  { level: 5, label: 'Almost Certain', code: 'almost_certain', description: 'Almost always occurs' },
];
const DEFAULT_RISK_LEVELS = [
  { level: 'L', label: 'Low', color: '#22c55e', scoreMin: 1, scoreMax: 6 },
  { level: 'M', label: 'Medium', color: '#eab308', scoreMin: 7, scoreMax: 12 },
  { level: 'H', label: 'High', color: '#f97316', scoreMin: 13, scoreMax: 19 },
  { level: 'E', label: 'Extreme', color: '#ef4444', scoreMin: 20, scoreMax: 25 },
];

const RISK_MASTER_DATA = [
  { group: 'Hazard Category', items: ['Physical', 'Chemical', 'Biological', 'Ergonomic', 'Psychosocial', 'Mechanical', 'Electrical', 'Radiation', 'Noise', 'Vibration', 'Working at Height', 'Confined Space', 'Excavation', 'Lifting Operations', 'Hot Work', 'Pressure System', 'Environmental'] },
  { group: 'Hazard Type', items: ['Slip/Trip/Fall', 'Struck By', 'Caught In/Between', 'Fire/Explosion', 'Chemical Exposure', 'Electrical Shock', 'Overexertion', 'Repetitive Motion', 'Vehicle Accident', 'Equipment Failure', 'Structural Collapse', 'Drowning', 'Asphyxiation', 'Burns', 'Poisoning', 'Radiation Exposure'] },
  { group: 'Consequence Type', items: ['Injury', 'Fatality', 'Property Damage', 'Environmental Damage', 'Production Loss', 'Legal Action', 'Reputation Damage', 'Regulatory Fine', 'Business Interruption', 'Data Loss'] },
  { group: 'Control Type', items: ['Elimination', 'Substitution', 'Engineering Controls', 'Administrative Controls', 'Personal Protective Equipment', 'Warning Systems', 'Procedures', 'Training', 'Supervision', 'Permit to Work'] },
  { group: 'Risk Category', items: ['Safety', 'Health', 'Environment', 'Quality', 'Security', 'Legal', 'Financial', 'Operational', 'Reputation', 'Strategic'] },
  { group: 'Risk Status', items: ['Draft', 'Identified', 'Assessed', 'Under Review', 'Approved', 'Active', 'Monitoring', 'Closed', 'Expired'] },
  { group: 'Review Frequency', items: ['Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually', 'Event-Based'] },
];

@Injectable()
export class RiskService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.riskSetting.findUnique({ where: { companyId } });
    if (!s) {
      s = await this.prisma.riskSetting.create({
        data: { companyId, severityLevels: DEFAULT_SEVERITY, likelihoodLevels: DEFAULT_LIKELIHOOD, riskLevels: DEFAULT_RISK_LEVELS, matrixType: '5x5', requireWorkflow: true, maxReviewDays: 90 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateRiskSettingsDto) {
    return this.prisma.riskSetting.upsert({
      where: { companyId },
      create: { companyId, severityLevels: dto.severityLevels || DEFAULT_SEVERITY, likelihoodLevels: dto.likelihoodLevels || DEFAULT_LIKELIHOOD, riskLevels: dto.riskLevels || DEFAULT_RISK_LEVELS, ...dto },
      update: { ...dto, severityLevels: dto.severityLevels as any, likelihoodLevels: dto.likelihoodLevels as any, riskLevels: dto.riskLevels as any },
    });
  }

  async getMasterData(companyId: string) {
    return this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] },
      include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  }

  async seedDefaults(companyId: string) {
    let count = 0;
    for (const group of RISK_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), description: `Risk Management - ${group.group}`, companyId } });
      }
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\/\s]+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: RISK_MASTER_DATA.length };
  }

  // ─── Risk Register CRUD ─────────────────────────────────────────────────

  async create(dto: CreateRiskDto, companyId: string, userId: string) {
    const score = (dto.initialSeverity || 1) * (dto.initialLikelihood || 1);
    const settings = await this.prisma.riskSetting.findUnique({ where: { companyId } });
    const riskLevels = (settings?.riskLevels as any[]) || [];
    const level = riskLevels.find((l: any) => score >= l.scoreMin && score <= l.scoreMax);
    return this.prisma.risk.create({
      data: { companyId, title: dto.title, description: dto.description, riskOwnerId: dto.riskOwnerId, riskType: dto.riskType, riskCategoryId: dto.riskCategoryId, hazardId: dto.hazardId, consequenceId: dto.consequenceId, siteId: dto.siteId, departmentId: dto.departmentId, initialSeverity: dto.initialSeverity, initialLikelihood: dto.initialLikelihood, initialRiskScore: score, initialRiskLevel: level?.level || null, reviewFrequency: dto.reviewFrequency, createdBy: userId },
    });
  }

  async findAll(companyId: string, query: RiskQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.riskLevel) where.initialRiskLevel = query.riskLevel;
    if (query.siteId) where.siteId = query.siteId;
    if (query.search) where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([this.prisma.risk.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }), this.prisma.risk.count({ where })]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) throw new NotFoundException('Risk not found');
    if (risk.companyId !== companyId) throw new ForbiddenException('Access denied');
    return risk;
  }

  async update(id: string, dto: UpdateRiskDto, companyId: string, userId: string) {
    const risk = await this.findOne(id, companyId);
    if (risk.status !== 'draft') throw new ForbiddenException('Only draft risks can be edited');
    const sev = dto.initialSeverity ?? risk.initialSeverity;
    const lik = dto.initialLikelihood ?? risk.initialLikelihood;
    const score = (sev || 1) * (lik || 1);
    const settings = await this.prisma.riskSetting.findUnique({ where: { companyId } });
    const riskLevels = (settings?.riskLevels as any[]) || [];
    const level = riskLevels.find((l: any) => score >= l.scoreMin && score <= l.scoreMax);
    return this.prisma.risk.update({
      where: { id },
      data: { ...dto, initialSeverity: sev, initialLikelihood: lik, initialRiskScore: score, initialRiskLevel: level?.level || null, updatedBy: userId },
    });
  }

  async softDelete(id: string, companyId: string, userId: string) {
    const risk = await this.findOne(id, companyId);
    if (risk.status !== 'draft') throw new ForbiddenException('Only draft risks can be deleted');
    await this.prisma.risk.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true, id };
  }

  async submit(id: string, companyId: string, userId: string) {
    const risk = await this.findOne(id, companyId);
    if (risk.status !== 'draft') throw new ForbiddenException('Only drafts can be submitted');
    return this.prisma.risk.update({ where: { id }, data: { status: 'submitted' } });
  }

  // ─── Hazard & Consequence Library ──────────────────────────────────────

  async getHazardCategories(companyId: string) {
    return this.prisma.hazardCategory.findMany({ where: { companyId, isActive: true }, include: { _count: { select: { hazards: true } } }, orderBy: { name: 'asc' } });
  }

  async createHazardCategory(dto: CreateHazardCategoryDto, companyId: string) {
    return this.prisma.hazardCategory.create({ data: { companyId, name: dto.name, code: dto.name.toLowerCase().replace(/\s+/g, '_'), description: dto.description } });
  }

  async getHazards(companyId: string, query?: HazardQueryDto) {
    const where: any = { companyId, isActive: true };
    if (query?.categoryId) where.categoryId = query.categoryId;
    if (query?.search) where.name = { contains: query.search, mode: 'insensitive' };
    return this.prisma.hazard.findMany({ where, include: { category: { select: { name: true } }, mappings: { include: { consequence: { select: { name: true } } } } }, orderBy: { name: 'asc' }, take: 100 });
  }

  async createHazard(dto: CreateHazardDto, companyId: string) {
    return this.prisma.hazard.create({ data: { categoryId: dto.categoryId, companyId, name: dto.name, description: dto.description } });
  }

  async toggleHazard(id: string, isActive: boolean) {
    return this.prisma.hazard.update({ where: { id }, data: { isActive } });
  }

  async getConsequenceCategories(companyId: string) {
    return this.prisma.consequenceCategory.findMany({ where: { companyId, isActive: true }, include: { _count: { select: { consequences: true } } }, orderBy: { name: 'asc' } });
  }

  async createConsequenceCategory(dto: CreateConsequenceCategoryDto, companyId: string) {
    return this.prisma.consequenceCategory.create({ data: { companyId, name: dto.name, code: dto.name.toLowerCase().replace(/\s+/g, '_'), description: dto.description } });
  }

  async getConsequences(companyId: string, query?: HazardQueryDto) {
    const where: any = { companyId, isActive: true };
    if (query?.categoryId) where.categoryId = query.categoryId;
    return this.prisma.consequence.findMany({ where, include: { category: { select: { name: true } } }, orderBy: { name: 'asc' }, take: 100 });
  }

  async createConsequence(dto: CreateConsequenceDto, companyId: string) {
    return this.prisma.consequence.create({ data: { categoryId: dto.categoryId, companyId, name: dto.name, description: dto.description } });
  }

  async getMappings(companyId: string) {
    return this.prisma.hazardConsequenceMapping.findMany({ where: { companyId, isActive: true }, include: { hazard: { select: { name: true } }, consequence: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createMapping(dto: CreateMappingDto, companyId: string) {
    return this.prisma.hazardConsequenceMapping.upsert({
      where: { hazardId_consequenceId: { hazardId: dto.hazardId, consequenceId: dto.consequenceId } },
      create: { hazardId: dto.hazardId, consequenceId: dto.consequenceId, companyId, riskDescription: dto.riskDescription },
      update: { riskDescription: dto.riskDescription, isActive: true },
    });
  }

  async deleteMapping(id: string) {
    await this.prisma.hazardConsequenceMapping.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }
}
