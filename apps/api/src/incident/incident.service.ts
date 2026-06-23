import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateIncidentSettingsDto } from './dto/incident-settings.dto';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/create-incident.dto';
import { ClassifyIncidentDto } from './dto/classify-incident.dto';
import { AddPersonDto, AddInjuryDto, AddAssetDto, AddPropertyDamageDto, AddEnvironmentalImpactDto } from './dto/incident-people.dto';
import { ReviewIncidentDto, AssignInvestigatorDto } from './dto/incident-review.dto';
import { UpdateInvestigationDto, AddTeamMemberDto, AddChronologyDto, AddInterviewDto, AddBarrierDto, AddFindingDto } from './dto/investigation.dto';
import { UpdateRcaDto, Add5WhyDto, AddFishboneDto, AddFactorDto, ReviewRcaDto } from './dto/rca.dto';
import { CreateCapaDto, EffectivenessReviewDto } from './dto/capa.dto';
import { CreateEscalationRuleDto, CreateLessonsLearnedDto } from './dto/lessons.dto';

const DEFAULT_SEVERITY_MATRIX = [
  { level: 'low', label: 'Low', color: '#22c55e', slaHours: 72 },
  { level: 'medium', label: 'Medium', color: '#eab308', slaHours: 48 },
  { level: 'high', label: 'High', color: '#f97316', slaHours: 24 },
  { level: 'critical', label: 'Critical', color: '#ef4444', slaHours: 4 },
];

const INCIDENT_MASTER_DATA = [
  { group: 'Incident Type', items: ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time Injury', 'Fatality', 'Property Damage', 'Environmental Release', 'Security Breach', 'Process Safety', 'Vehicle Accident'] },
  { group: 'Incident Category', items: ['People', 'Asset', 'Environment', 'Reputation', 'Legal', 'Quality', 'Security', 'Process'] },
  { group: 'Injury Classification', items: ['No Injury', 'First Aid', 'Medical Treatment', 'Lost Time', 'Fatality', 'Occupational Illness'] },
  { group: 'Loss Type', items: ['Production Loss', 'Equipment Damage', 'Environmental Damage', 'Legal Cost', 'Medical Cost', 'Reputation Damage', 'Regulatory Fine'] },
  { group: 'Root Cause Category', items: ['Human Error', 'Procedure Gap', 'Training Gap', 'Equipment Failure', 'Design Flaw', 'Management Failure', 'External Factor', 'Communication Gap'] },
  { group: 'Incident Consequence', items: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'] },
  { group: 'Incident Status', items: ['Draft', 'Submitted', 'Under Review', 'Investigation', 'RCA Completed', 'CAPA In Progress', 'Closed', 'Cancelled'] },
];

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.incidentSetting.findUnique({ where: { companyId } });
    if (!s) {
      s = await this.prisma.incidentSetting.create({
        data: { companyId, severityMatrix: DEFAULT_SEVERITY_MATRIX, requireWorkflow: true, maxReportDays: 30 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, userId: string, dto: UpdateIncidentSettingsDto) {
    return this.prisma.incidentSetting.upsert({
      where: { companyId },
      create: { companyId, severityMatrix: (dto.severityMatrix || DEFAULT_SEVERITY_MATRIX) as any, ...dto },
      update: { ...dto, severityMatrix: dto.severityMatrix as any },
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
    for (const group of INCIDENT_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({
          data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), description: `Incident Management - ${group.group}`, companyId },
        });
      }
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/\s+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: INCIDENT_MASTER_DATA.length };
  }

  async getModuleStatus(companyId: string) {
    const module = await this.prisma.module.findFirst({ where: { code: 'incident' } });
    if (!module) throw new NotFoundException('Incident module not registered');
    const companyRecord = await this.prisma.company.findUnique({ where: { id: companyId } });
    const tenantModule = companyRecord?.tenantId
      ? await this.prisma.tenantModule.findFirst({ where: { tenantId: companyRecord.tenantId, moduleId: module.id } })
      : null;
    return { moduleId: module.id, name: module.name, code: module.code, isActive: module.isActive, isEnabled: tenantModule?.isEnabled ?? true };
  }

  // ─── Incident CRUD ─────────────────────────────────────────────────────

  async create(dto: CreateIncidentDto, companyId: string, userId: string) {
    const incident = await this.prisma.incident.create({
      data: { companyId, title: dto.title, description: dto.description, incidentDate: new Date(dto.incidentDate), reportedById: userId, siteId: dto.siteId, departmentId: dto.departmentId, locationId: dto.locationId, immediateAction: dto.immediateAction, createdBy: userId },
    });
    await this.logStatus(incident.id, companyId, userId, null, 'draft');
    return this.findOne(incident.id, companyId);
  }

  async findAll(companyId: string, query: IncidentQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.siteId) where.siteId = query.siteId;
    if (query.search) where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
    if (query.fromDate || query.toDate) { where.incidentDate = {}; if (query.fromDate) where.incidentDate.gte = new Date(query.fromDate); if (query.toDate) where.incidentDate.lte = new Date(query.toDate); }
    const [data, total] = await Promise.all([this.prisma.incident.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }), this.prisma.incident.count({ where })]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id }, include: { statusHistories: { orderBy: { createdAt: 'desc' } } } });
    if (!incident) throw new NotFoundException('Incident not found');
    if (incident.companyId !== companyId) throw new ForbiddenException('Access denied');
    return incident;
  }

  async update(id: string, dto: UpdateIncidentDto, companyId: string, userId: string) {
    const incident = await this.findOne(id, companyId);
    if (incident.status !== 'draft') throw new BadRequestException('Only draft incidents can be edited');
    const updated = await this.prisma.incident.update({ where: { id }, data: { ...dto, incidentDate: dto.incidentDate ? new Date(dto.incidentDate) : undefined, updatedBy: userId } });
    return updated;
  }

  async softDelete(id: string, companyId: string, userId: string) {
    const incident = await this.findOne(id, companyId);
    if (incident.status !== 'draft') throw new BadRequestException('Only draft incidents can be deleted');
    await this.prisma.incident.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    await this.logStatus(id, companyId, userId, incident.status, 'cancelled');
    return { success: true, id };
  }

  async submit(id: string, companyId: string, userId: string) {
    const incident = await this.findOne(id, companyId);
    if (incident.status !== 'draft') throw new BadRequestException('Only draft incidents can be submitted');
    const updated = await this.prisma.incident.update({ where: { id }, data: { status: 'submitted' } });
    await this.logStatus(id, companyId, userId, incident.status, 'submitted');
    return updated;
  }

  private async logStatus(incidentId: string, companyId: string, userId: string, oldStatus: string | null, newStatus: string) {
    return this.prisma.incidentStatusHistory.create({ data: { incidentId, companyId, oldStatus, newStatus, changedBy: userId } });
  }

  // ─── Classification ────────────────────────────────────────────────────

  async getClassification(incidentId: string, companyId: string) {
    const incident = await this.findOne(incidentId, companyId);
    const classification = await this.prisma.incidentClassification.findFirst({ where: { incidentId } });
    const impacts = await this.prisma.incidentImpact.findMany({ where: { incidentId } });
    const repeatLinks = await this.prisma.incidentRepeatLink.findMany({ where: { incidentId } });
    return { incident: { id: incident.id, incidentTypeId: incident.incidentTypeId, categoryId: incident.categoryId, actualSeverity: incident.actualSeverity, potentialSeverity: incident.potentialSeverity, actualConsequence: incident.actualConsequence, potentialConsequence: incident.potentialConsequence, isHighSeverity: incident.isHighSeverity, isRepeat: incident.isRepeat }, classification, impacts, repeatLinks };
  }

  async classify(incidentId: string, dto: ClassifyIncidentDto, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    const isHigh = ['high', 'critical'].includes(dto.actualSeverity || '') || ['high', 'critical'].includes(dto.potentialSeverity || '');
    const updated = await this.prisma.incident.update({
      where: { id: incidentId },
      data: { incidentTypeId: dto.incidentTypeId || incident.incidentTypeId, categoryId: dto.categoryId || incident.categoryId, actualSeverity: dto.actualSeverity || incident.actualSeverity, potentialSeverity: dto.potentialSeverity || incident.potentialSeverity, actualConsequence: dto.actualConsequence || incident.actualConsequence, potentialConsequence: dto.potentialConsequence || incident.potentialConsequence, isHighSeverity: isHigh, status: incident.status === 'draft' ? 'submitted' : incident.status },
    });

    const existingClass = await this.prisma.incidentClassification.findFirst({ where: { incidentId } });
    if (existingClass) {
      await this.prisma.incidentClassification.update({ where: { id: existingClass.id }, data: { classifiedBy: userId, notes: dto.notes } });
    } else {
      await this.prisma.incidentClassification.create({ data: { incidentId, companyId, classifiedBy: userId, notes: dto.notes } });
    }

    if (dto.impacts) {
      await this.prisma.incidentImpact.deleteMany({ where: { incidentId } });
      for (const impact of dto.impacts) {
        await this.prisma.incidentImpact.create({ data: { incidentId, companyId, impactType: impact.impactType, severity: impact.severity, description: impact.description } });
      }
    }

    return this.getClassification(incidentId, companyId);
  }

  async reviewClassification(incidentId: string, companyId: string, userId: string) {
    await this.findOne(incidentId, companyId);
    const classification = await this.prisma.incidentClassification.findFirst({ where: { incidentId } });
    if (!classification) throw new NotFoundException('Classification not found');
    await this.prisma.incidentClassification.update({ where: { id: classification.id }, data: { reviewedBy: userId, reviewedAt: new Date() } });
    return { reviewed: true, incidentId };
  }

  async getRelatedIncidents(incidentId: string, companyId: string) {
    const links = await this.prisma.incidentRepeatLink.findMany({ where: { OR: [{ incidentId }, { relatedIncidentId: incidentId }], companyId } });
    const incidentIds = [...new Set(links.flatMap(l => [l.incidentId, l.relatedIncidentId]))];
    return this.prisma.incident.findMany({ where: { id: { in: incidentIds }, companyId }, take: 10 });
  }

  // ─── People, Injury, Witness, Asset ────────────────────────────────────

  async getPeople(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentPerson.findMany({ where: { incidentId, companyId } });
  }

  async addPerson(incidentId: string, dto: AddPersonDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentPerson.create({ data: { incidentId, companyId, ...dto } });
  }

  async updatePerson(incidentId: string, personId: string, data: any, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentPerson.update({ where: { id: personId }, data });
  }

  async deletePerson(incidentId: string, personId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    await this.prisma.incidentPerson.delete({ where: { id: personId } });
    return { success: true };
  }

  async getInjuries(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentInjury.findMany({ where: { incidentId, companyId }, include: { person: { select: { fullName: true } } } });
  }

  async addInjury(incidentId: string, dto: AddInjuryDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentInjury.create({ data: { incidentId, companyId, ...dto } });
  }

  async getAssets(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentAsset.findMany({ where: { incidentId, companyId } });
  }

  async addAsset(incidentId: string, dto: AddAssetDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentAsset.create({ data: { incidentId, companyId, ...dto } });
  }

  async deleteAsset(incidentId: string, assetId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    await this.prisma.incidentAsset.delete({ where: { id: assetId } });
    return { success: true };
  }

  async getPropertyDamages(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentPropertyDamage.findMany({ where: { incidentId, companyId } });
  }

  async addPropertyDamage(incidentId: string, dto: AddPropertyDamageDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentPropertyDamage.create({ data: { incidentId, companyId, ...dto } });
  }

  async getEnvironmentalImpacts(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentEnvironmentalImpact.findMany({ where: { incidentId, companyId } });
  }

  async addEnvironmentalImpact(incidentId: string, dto: AddEnvironmentalImpactDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentEnvironmentalImpact.create({ data: { incidentId, companyId, ...dto } });
  }

  // ─── Review & Workflow ──────────────────────────────────────────────────

  async getReviewQueue(companyId: string) {
    return this.prisma.incident.findMany({ where: { companyId, deletedAt: null, status: { in: ['submitted'] } }, orderBy: { createdAt: 'asc' }, take: 50 });
  }

  async review(incidentId: string, dto: ReviewIncidentDto, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (incident.status !== 'submitted') throw new BadRequestException('Only submitted incidents can be reviewed');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'under_review' } });
    await this.prisma.incidentReviewRecord.create({ data: { incidentId, companyId, reviewerId: userId, action: 'reviewed', comment: dto.comment, oldStatus: 'submitted', newStatus: 'under_review' } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'under_review');
    return { status: 'under_review', incidentId };
  }

  async reject(incidentId: string, dto: ReviewIncidentDto, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (!['submitted', 'under_review'].includes(incident.status)) throw new BadRequestException('Cannot reject in current status');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'draft' } });
    await this.prisma.incidentReviewRecord.create({ data: { incidentId, companyId, reviewerId: userId, action: 'rejected', comment: dto.comment, oldStatus: incident.status, newStatus: 'draft' } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'draft');
    return { status: 'draft', incidentId };
  }

  async requestRevision(incidentId: string, dto: ReviewIncidentDto, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (!['submitted', 'under_review'].includes(incident.status)) throw new BadRequestException('Cannot request revision');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'draft' } });
    await this.prisma.incidentReviewRecord.create({ data: { incidentId, companyId, reviewerId: userId, action: 'revision_requested', comment: dto.comment, oldStatus: incident.status, newStatus: 'draft' } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'draft');
    return { status: 'draft', incidentId };
  }

  async assignInvestigator(incidentId: string, dto: AssignInvestigatorDto, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (incident.status !== 'under_review') throw new BadRequestException('Incident must be under review to assign investigator');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'investigation' } });
    const assignment = await this.prisma.incidentInvestigatorAssignment.create({ data: { incidentId, companyId, investigatorId: dto.investigatorId, dueDate: dto.dueDate ? new Date(dto.dueDate) : null, notes: dto.notes, assignedBy: userId } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'investigation');
    return assignment;
  }

  async getWorkflow(incidentId: string, companyId: string) {
    const incident = await this.findOne(incidentId, companyId);
    const reviewRecords = await this.prisma.incidentReviewRecord.findMany({ where: { incidentId }, orderBy: { createdAt: 'desc' } });
    const assignments = await this.prisma.incidentInvestigatorAssignment.findMany({ where: { incidentId }, orderBy: { createdAt: 'desc' } });
    return { incident: { id: incident.id, status: incident.status }, reviewRecords, assignments, statusHistory: incident.statusHistories };
  }

  // ─── Investigation ──────────────────────────────────────────────────────

  async getInvestigation(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    const [investigation, chronologies, interviews, barriers, findings] = await Promise.all([
      this.prisma.incidentInvestigation.findFirst({ where: { incidentId }, include: { team: true } }),
      this.prisma.incidentChronology.findMany({ where: { incidentId }, orderBy: { eventTime: 'asc' } }),
      this.prisma.incidentInterview.findMany({ where: { incidentId }, orderBy: { date: 'desc' } }),
      this.prisma.incidentFailedBarrier.findMany({ where: { incidentId } }),
      this.prisma.incidentInvestigationFinding.findMany({ where: { incidentId } }),
    ]);
    return investigation ? { ...investigation, chronologies, interviews, barriers, findings } : null;
  }

  async startInvestigation(incidentId: string, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (incident.status !== 'investigation') throw new BadRequestException('Incident must be in investigation status');
    const existing = await this.prisma.incidentInvestigation.findFirst({ where: { incidentId } });
    if (existing) throw new BadRequestException('Investigation already started');
    const investigation = await this.prisma.incidentInvestigation.create({ data: { incidentId, companyId, startedBy: userId } });
    await this.prisma.incidentInvestigationTeam.create({ data: { investigationId: investigation.id, incidentId, companyId, userId, role: 'team_leader' } });
    return this.getInvestigation(incidentId, companyId);
  }

  async updateInvestigation(incidentId: string, dto: UpdateInvestigationDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    const inv = await this.prisma.incidentInvestigation.findFirst({ where: { incidentId } });
    if (!inv) throw new NotFoundException('Investigation not started');
    return this.prisma.incidentInvestigation.update({ where: { id: inv.id }, data: dto });
  }

  async addTeamMember(incidentId: string, dto: AddTeamMemberDto, companyId: string) {
    const inv = await this.prisma.incidentInvestigation.findFirst({ where: { incidentId } });
    if (!inv) throw new NotFoundException('Investigation not started');
    return this.prisma.incidentInvestigationTeam.create({ data: { investigationId: inv.id, incidentId, companyId, userId: dto.userId, role: dto.role } });
  }

  async addChronology(incidentId: string, dto: AddChronologyDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentChronology.create({ data: { incidentId, companyId, eventTime: new Date(dto.eventTime), description: dto.description, source: dto.source } });
  }

  async addInterview(incidentId: string, dto: AddInterviewDto, companyId: string, userId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentInterview.create({ data: { incidentId, companyId, interviewee: dto.interviewee, interviewer: userId, date: dto.date ? new Date(dto.date) : new Date(), summary: dto.summary, notes: dto.notes } });
  }

  async addBarrier(incidentId: string, dto: AddBarrierDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentFailedBarrier.create({ data: { incidentId, companyId, barrierType: dto.barrierType, description: dto.description, consequence: dto.consequence } });
  }

  async addFinding(incidentId: string, dto: AddFindingDto, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.incidentInvestigationFinding.create({ data: { incidentId, companyId, description: dto.description, category: dto.category, severity: dto.severity } });
  }

  async submitInvestigation(incidentId: string, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (incident.status !== 'investigation') throw new BadRequestException('Must be in investigation status');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'rca_completed' } });
    const inv = await this.prisma.incidentInvestigation.findFirst({ where: { incidentId } });
    if (inv) await this.prisma.incidentInvestigation.update({ where: { id: inv.id }, data: { completedAt: new Date() } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'rca_completed');
    return { status: 'rca_completed', incidentId };
  }

  // ─── Root Cause Analysis ────────────────────────────────────────────────

  async getRca(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    const rootCauses = await this.prisma.incidentRootCause.findMany({ where: { incidentId }, include: { fiveWhys: { orderBy: { stepOrder: 'asc' } }, fishbones: true, factors: true } });
    const reviews = await this.prisma.incidentRcaReview.findMany({ where: { incidentId }, orderBy: { createdAt: 'desc' } });
    return { rootCauses, reviews };
  }

  async updateRca(incidentId: string, dto: UpdateRcaDto, companyId: string, userId: string) {
    await this.findOne(incidentId, companyId);
    const existing = await this.prisma.incidentRootCause.findFirst({ where: { incidentId } });
    if (existing) {
      return this.prisma.incidentRootCause.update({ where: { id: existing.id }, data: dto });
    }
    return this.prisma.incidentRootCause.create({ data: { incidentId, companyId, causeCategoryId: dto.causeCategoryId, rootCause: dto.rootCause || '', systemCause: dto.systemCause, summary: dto.summary, createdBy: userId } });
  }

  async add5Why(incidentId: string, dto: Add5WhyDto, companyId: string) {
    return this.prisma.incident5Why.create({ data: { rootCauseId: dto.rootCauseId, incidentId, companyId, stepOrder: dto.stepOrder, question: dto.question, answer: dto.answer } });
  }

  async addFishbone(incidentId: string, dto: AddFishboneDto, companyId: string) {
    return this.prisma.incidentFishbone.create({ data: { rootCauseId: dto.rootCauseId, incidentId, companyId, category: dto.category, cause: dto.cause } });
  }

  async addFactor(incidentId: string, dto: AddFactorDto, companyId: string) {
    return this.prisma.incidentCauseFactor.create({ data: { rootCauseId: dto.rootCauseId, incidentId, companyId, factorType: dto.factorType, description: dto.description, contribution: dto.contribution } });
  }

  async submitRca(incidentId: string, companyId: string, userId: string) {
    const incident = await this.findOne(incidentId, companyId);
    if (incident.status !== 'rca_completed') throw new BadRequestException('Must complete investigation first');
    await this.prisma.incident.update({ where: { id: incidentId }, data: { status: 'capa_in_progress' } });
    await this.logStatus(incidentId, companyId, userId, incident.status, 'capa_in_progress');
    return { status: 'capa_in_progress', incidentId };
  }

  async reviewRca(incidentId: string, dto: ReviewRcaDto, companyId: string, userId: string) {
    return this.prisma.incidentRcaReview.create({ data: { incidentId, companyId, reviewerId: userId, status: dto.status, comment: dto.comment } });
  }

  // ─── CAPA / Corrective & Preventive Action ─────────────────────────────

  async getCapa(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    const links = await this.prisma.incidentActionLink.findMany({ where: { incidentId, companyId } });
    const actionIds = links.map(l => l.actionId);
    const actions = actionIds.length > 0 ? await this.prisma.action.findMany({ where: { id: { in: actionIds } }, include: { _count: { select: { comments: true, evidences: true } } } }) : [];
    const effectiveness = await this.prisma.incidentCapaEffectivenessReview.findUnique({ where: { incidentId } });
    return { links, actions, effectiveness };
  }

  async createCapa(incidentId: string, dto: CreateCapaDto, companyId: string, userId: string) {
    await this.findOne(incidentId, companyId);
    const action = await this.prisma.action.create({
      data: { companyId, title: dto.title, description: dto.description, assignedTo: dto.assignedTo, priority: dto.priority || 'medium', dueDate: dto.dueDate ? new Date(dto.dueDate) : null, createdBy: userId, status: 'draft' },
    });
    await this.prisma.incidentActionLink.create({ data: { incidentId, actionId: action.id, companyId, actionType: dto.actionType, rootCauseId: dto.rootCauseId } });
    return { action, link: { incidentId, actionId: action.id, actionType: dto.actionType } };
  }

  async getEffectiveness(incidentId: string, companyId: string) {
    return this.prisma.incidentCapaEffectivenessReview.findUnique({ where: { incidentId } });
  }

  async createEffectivenessReview(incidentId: string, dto: EffectivenessReviewDto, companyId: string, userId: string) {
    return this.prisma.incidentCapaEffectivenessReview.upsert({
      where: { incidentId },
      create: { incidentId, companyId, reviewedBy: userId, effective: dto.effective, notes: dto.notes },
      update: { reviewedBy: userId, effective: dto.effective, notes: dto.notes },
    });
  }

  // ─── Timeline & Evidence Bridge ────────────────────────────────────────

  async getTimeline(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    const events = await this.prisma.incidentTimelineEvent.findMany({ where: { incidentId }, orderBy: { createdAt: 'desc' }, take: 100 });
    return events;
  }

  async addTimelineEvent(incidentId: string, eventType: string, title: string, description: string | null, userId: string, companyId: string) {
    return this.prisma.incidentTimelineEvent.create({ data: { incidentId, companyId, eventType, title, description, actorId: userId } });
  }

  async getAttachments(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.attachment.findMany({ where: { recordType: 'incident', recordId: incidentId, companyId, deletedAt: null }, include: { file: true } });
  }

  async getComments(incidentId: string, companyId: string) {
    await this.findOne(incidentId, companyId);
    return this.prisma.comment.findMany({ where: { module: 'incident', recordType: 'incidents', recordId: incidentId, companyId, deletedAt: null }, include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, replies: { include: { user: { select: { email: true, firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'desc' } });
  }

  async getAuditLogs(incidentId: string, companyId: string) {
    return this.prisma.auditLog.findMany({ where: { OR: [{ recordId: incidentId }, { recordType: 'incident' }], companyId }, orderBy: { createdAt: 'desc' }, take: 50, include: { actor: { select: { email: true, firstName: true, lastName: true } } } });
  }

  // ─── Escalation & Lessons Learned ──────────────────────────────────────

  async getEscalationRules(companyId: string) {
    return this.prisma.incidentEscalationRule.findMany({ where: { companyId, isActive: true } });
  }

  async createEscalationRule(dto: CreateEscalationRuleDto, companyId: string) {
    return this.prisma.incidentEscalationRule.create({ data: { companyId, ...dto } });
  }

  async deleteEscalationRule(id: string) {
    await this.prisma.incidentEscalationRule.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async getLessonsLearned(incidentId: string, companyId: string) {
    const lesson = await this.prisma.incidentLessonsLearned.findUnique({ where: { incidentId }, include: { acknowledgements: true } });
    return lesson || null;
  }

  async createLessonsLearned(incidentId: string, dto: CreateLessonsLearnedDto, companyId: string, userId: string) {
    return this.prisma.incidentLessonsLearned.upsert({
      where: { incidentId },
      create: { incidentId, companyId, title: dto.title, description: dto.description, category: dto.category, createdBy: userId },
      update: { title: dto.title, description: dto.description, category: dto.category },
    });
  }

  async publishLessonsLearned(incidentId: string, companyId: string, userId: string) {
    const lesson = await this.prisma.incidentLessonsLearned.findUnique({ where: { incidentId } });
    if (!lesson) throw new NotFoundException('Lessons learned not created');
    if (lesson.isPublished) throw new BadRequestException('Already published');
    return this.prisma.incidentLessonsLearned.update({ where: { incidentId }, data: { isPublished: true, publishedBy: userId, publishedAt: new Date() } });
  }

  async acknowledgeLessonsLearned(incidentId: string, companyId: string, userId: string) {
    const lesson = await this.prisma.incidentLessonsLearned.findUnique({ where: { incidentId } });
    if (!lesson) throw new NotFoundException('Lessons learned not found');
    return this.prisma.incidentLessonsLearnedAck.create({ data: { lessonId: lesson.id, userId, companyId } });
  }

  // ─── Dashboard & KPI ────────────────────────────────────────────────────

  async getDashboard(companyId: string) {
    const [total, open, highSeverity, byType, bySeverity, bySite, openInvestigations, openCapa] = await Promise.all([
      this.prisma.incident.count({ where: { companyId, deletedAt: null } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, status: { notIn: ['closed', 'cancelled'] } } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, isHighSeverity: true } }),
      this.prisma.incident.groupBy({ by: ['incidentTypeId'], where: { companyId, deletedAt: null }, _count: true, orderBy: { _count: { id: 'desc' } }, take: 10 }),
      this.prisma.incident.groupBy({ by: ['actualSeverity'], where: { companyId, deletedAt: null }, _count: true, orderBy: { _count: { id: 'desc' } } }),
      this.prisma.incident.groupBy({ by: ['siteId'], where: { companyId, deletedAt: null }, _count: true, orderBy: { _count: { id: 'desc' } }, take: 10 }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, status: 'investigation' } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, status: 'capa_in_progress' } }),
    ]);
    return {
      total, open, highSeverity, openInvestigations, openCapa,
      byType: byType.map(t => ({ type: t.incidentTypeId, count: t._count })),
      bySeverity: bySeverity.map(s => ({ severity: s.actualSeverity, count: s._count })),
      bySite: bySite.map(s => ({ siteId: s.siteId, count: s._count })),
    };
  }

  async getKpi(companyId: string, year?: number) {
    const y = year || new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    const [totalIncidents, highSeverity, injuries, lostTimeDays, fatalities] = await Promise.all([
      this.prisma.incident.count({ where: { companyId, deletedAt: null, incidentDate: { gte: start, lt: end } } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, incidentDate: { gte: start, lt: end }, isHighSeverity: true } }),
      this.prisma.incidentInjury.count({ where: { companyId, incident: { deletedAt: null, incidentDate: { gte: start, lt: end } } } }),
      this.prisma.incidentInjury.aggregate({ where: { companyId, incident: { deletedAt: null } }, _sum: { lostTimeDays: true } }),
      this.prisma.incident.count({ where: { companyId, deletedAt: null, incidentDate: { gte: start, lt: end }, incidentTypeId: 'fatality' } }),
    ]);
    return { year: y, totalIncidents, highSeverity, injuries, lostTimeDays: lostTimeDays._sum?.lostTimeDays || 0, fatalities };
  }

  async getTrends(companyId: string) {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await this.prisma.incident.count({ where: { companyId, deletedAt: null, incidentDate: { gte: start, lt: end } } });
      months.push({ month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`, count });
    }
    return { trends: months };
  }

  async exportIncidents(companyId: string, format: string) {
    const incidents = await this.prisma.incident.findMany({ where: { companyId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 1000 });
    return { format, count: incidents.length, data: incidents };
  }
}
