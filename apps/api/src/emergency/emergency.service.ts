import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const EMERGENCY_MASTER_DATA = [
  { group: 'Emergency Type', items: ['Fire', 'Explosion', 'Chemical Spill', 'Hazardous Waste Spill', 'Medical Emergency', 'Mass Casualty', 'Confined Space Rescue', 'Working at Height Rescue', 'Electrical Emergency', 'Environmental Emergency', 'Natural Disaster', 'Flood', 'Earthquake', 'Security Threat', 'Evacuation', 'Community Disturbance', 'Vehicle Accident', 'Gas Leak', 'Process Safety Event'] },
  { group: 'Drill Type', items: ['Fire Drill', 'Evacuation Drill', 'Chemical Spill Drill', 'Medical Drill', 'Earthquake Drill', 'Combined Drill', 'Tabletop Exercise'] },
  { group: 'Equipment Type', items: ['Fire Extinguisher', 'Fire Hydrant', 'Fire Alarm', 'AED', 'Rescue Kit', 'Spill Kit', 'First Aid Kit', 'Evacuation Chair', 'Emergency Light', 'PA System', 'Stretcher', 'Other'] },
  { group: 'Team Role', items: ['Incident Commander', 'Safety Officer', 'Operations Officer', 'Logistics Officer', 'Planning Officer', 'Finance Officer', 'Liaison Officer', 'Public Information Officer', 'First Aider', 'Fire Warden', 'Evacuation Marshal', 'Search & Rescue', 'Spill Response', 'ERT Member'] },
  { group: 'Contact Type', items: ['Internal', 'External', 'Emergency Services', 'Government', 'Contractor'] },
  { group: 'Plan Status', items: ['draft', 'submitted', 'under_review', 'approved', 'active', 'review_due', 'revised', 'obsolete', 'archived'] },
  { group: 'Drill Status', items: ['planned', 'scheduled', 'in_progress', 'conducted', 'evaluation_in_progress', 'finding_action_assigned', 'report_draft', 'report_approved', 'closed', 'cancelled'] },
  { group: 'Equipment Status', items: ['available', 'ready', 'not_ready', 'under_maintenance', 'expired', 'inspection_due', 'inspection_overdue', 'out_of_service'] },
  { group: 'Incident Severity', items: ['low', 'medium', 'high', 'critical'] },
  { group: 'Incident Status', items: ['reported', 'responding', 'contained', 'under_control', 'resolved', 'closed'] },
];

type QueryParams = Record<string, any>;

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  // ─── Settings ────────────────────────────────────────────────────────────
  async getSettings(companyId: string) {
    let s = await this.prisma.emergencySetting.findUnique({ where: { companyId } });
    if (!s) s = await this.prisma.emergencySetting.create({ data: { companyId } });
    return s;
  }

  async updateSettings(companyId: string, dto: any) {
    return this.prisma.emergencySetting.upsert({
      where: { companyId }, create: { companyId, ...dto }, update: dto,
    });
  }

  // ─── Master Data ─────────────────────────────────────────────────────────
  async getMasterData(companyId: string) {
    const items = await this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] },
      include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { name: 'asc' },
    });
    return items;
  }

  async seedDefaults(companyId: string) {
    let count = 0;
    for (const group of EMERGENCY_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), companyId } });
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) { await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\s\/]+/g, '_'), sortOrder: i, companyId } }); count++; }
      }
    }
    return { seeded: count, groups: EMERGENCY_MASTER_DATA.length };
  }

  // ─── Plans ───────────────────────────────────────────────────────────────
  async createPlan(dto: any, companyId: string, userId: string) {
    return this.prisma.emergencyPlan.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAllPlans(companyId: string, query: QueryParams) {
    const { status, emergencyType, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (emergencyType) where.emergencyType = emergencyType;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyPlan.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyPlan.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findPlan(id: string, companyId: string) {
    return this.prisma.emergencyPlan.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async updatePlan(id: string, dto: any, companyId: string) {
    return this.prisma.emergencyPlan.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async deletePlan(id: string, companyId: string) {
    return this.prisma.emergencyPlan.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  async submitPlan(id: string, companyId: string) {
    return this.prisma.emergencyPlan.updateMany({ where: { id, companyId, status: 'draft' }, data: { status: 'submitted' } });
  }

  async approvePlan(id: string, companyId: string, userId: string) {
    return this.prisma.emergencyPlan.updateMany({ where: { id, companyId, status: { in: ['submitted', 'under_review'] } }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
  }

  async activatePlan(id: string, companyId: string) {
    return this.prisma.emergencyPlan.updateMany({ where: { id, companyId, status: 'approved' }, data: { status: 'active' } });
  }

  // ─── Teams ───────────────────────────────────────────────────────────────
  async createTeam(dto: any, companyId: string, userId: string) {
    return this.prisma.emergencyTeam.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAllTeams(companyId: string, query: QueryParams) {
    const { status, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyTeam.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { members: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyTeam.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findTeam(id: string, companyId: string) {
    return this.prisma.emergencyTeam.findFirst({ where: { id, companyId, deletedAt: null }, include: { members: true } });
  }

  async updateTeam(id: string, dto: any, companyId: string) {
    return this.prisma.emergencyTeam.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async deleteTeam(id: string, companyId: string) {
    return this.prisma.emergencyTeam.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  async addTeamMember(teamId: string, dto: any, companyId: string) {
    const team = await this.prisma.emergencyTeam.findFirst({ where: { id: teamId, companyId } });
    if (!team) throw new Error('Team not found');
    return this.prisma.emergencyTeamMember.create({ data: { teamId, ...dto } });
  }

  async updateTeamMember(memberId: string, dto: any, teamId: string, companyId: string) {
    const team = await this.prisma.emergencyTeam.findFirst({ where: { id: teamId, companyId } });
    if (!team) throw new Error('Team not found');
    return this.prisma.emergencyTeamMember.update({ where: { id: memberId }, data: dto });
  }

  async removeTeamMember(memberId: string, teamId: string, companyId: string) {
    const team = await this.prisma.emergencyTeam.findFirst({ where: { id: teamId, companyId } });
    if (!team) throw new Error('Team not found');
    return this.prisma.emergencyTeamMember.delete({ where: { id: memberId } });
  }

  // ─── Contacts ────────────────────────────────────────────────────────────
  async createContact(dto: any, companyId: string, userId: string) {
    return this.prisma.emergencyContact.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAllContacts(companyId: string, query: QueryParams) {
    const { status, contactType, siteId, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (contactType) where.contactType = contactType;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [items, total] = await Promise.all([
      this.prisma.emergencyContact.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyContact.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findContact(id: string, companyId: string) {
    return this.prisma.emergencyContact.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async updateContact(id: string, dto: any, companyId: string) {
    return this.prisma.emergencyContact.updateMany({ where: { id, companyId, deletedAt: null }, data: dto });
  }

  async deleteContact(id: string, companyId: string) {
    return this.prisma.emergencyContact.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  // ─── Drills ──────────────────────────────────────────────────────────────
  async createDrill(dto: any, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    if (dto.scheduledDate) data.scheduledDate = new Date(dto.scheduledDate);
    return this.prisma.emergencyDrill.create({ data });
  }

  async findAllDrills(companyId: string, query: QueryParams) {
    const { status, drillType, siteId, search, fromDate, toDate, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (drillType) where.drillType = drillType;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (fromDate || toDate) {
      where.scheduledDate = {};
      if (fromDate) where.scheduledDate.gte = new Date(fromDate);
      if (toDate) where.scheduledDate.lte = new Date(toDate);
    }
    const [items, total] = await Promise.all([
      this.prisma.emergencyDrill.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { results: true }, orderBy: { scheduledDate: 'desc' } }),
      this.prisma.emergencyDrill.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findDrill(id: string, companyId: string) {
    return this.prisma.emergencyDrill.findFirst({ where: { id, companyId, deletedAt: null }, include: { results: true } });
  }

  async updateDrill(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    if (dto.scheduledDate) data.scheduledDate = new Date(dto.scheduledDate);
    return this.prisma.emergencyDrill.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async deleteDrill(id: string, companyId: string) {
    return this.prisma.emergencyDrill.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  async startDrill(id: string, companyId: string, userId: string) {
    return this.prisma.emergencyDrill.updateMany({ where: { id, companyId, status: { in: ['planned', 'scheduled'] } }, data: { status: 'in_progress', executedAt: new Date() } });
  }

  async completeDrill(id: string, companyId: string) {
    return this.prisma.emergencyDrill.updateMany({ where: { id, companyId, status: 'in_progress' }, data: { status: 'conducted', completedAt: new Date() } });
  }

  async addDrillResult(drillId: string, dto: any, companyId: string, userId: string) {
    const drill = await this.prisma.emergencyDrill.findFirst({ where: { id: drillId, companyId } });
    if (!drill) throw new Error('Drill not found');
    return this.prisma.drillResult.create({ data: { drillId, companyId, ...dto, executedBy: userId } });
  }

  async updateDrillResult(resultId: string, dto: any, drillId: string, companyId: string) {
    const drill = await this.prisma.emergencyDrill.findFirst({ where: { id: drillId, companyId } });
    if (!drill) throw new Error('Drill not found');
    return this.prisma.drillResult.update({ where: { id: resultId }, data: dto });
  }

  // ─── Equipment ───────────────────────────────────────────────────────────
  async createEquipment(dto: any, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    ['installDate', 'lastInspection', 'nextInspection', 'expiryDate'].forEach(k => { if (data[k]) data[k] = new Date(data[k]); });
    return this.prisma.emergencyEquipment.create({ data });
  }

  async findAllEquipment(companyId: string, query: QueryParams) {
    const { equipmentType, inspectionStatus, siteId, search, inspectionOverdue, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (equipmentType) where.equipmentType = equipmentType;
    if (inspectionStatus) where.inspectionStatus = inspectionStatus;
    if (siteId) where.siteId = siteId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (inspectionOverdue === 'true') where.nextInspection = { lte: new Date() };
    const [items, total] = await Promise.all([
      this.prisma.emergencyEquipment.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyEquipment.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findEquipment(id: string, companyId: string) {
    return this.prisma.emergencyEquipment.findFirst({ where: { id, companyId, deletedAt: null } });
  }

  async updateEquipment(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    ['installDate', 'lastInspection', 'nextInspection', 'expiryDate'].forEach(k => { if (data[k]) data[k] = new Date(data[k]); });
    return this.prisma.emergencyEquipment.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async deleteEquipment(id: string, companyId: string) {
    return this.prisma.emergencyEquipment.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  // ─── Incidents ───────────────────────────────────────────────────────────
  async createIncident(dto: any, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId, reportedBy: userId };
    if (dto.incidentDate) data.incidentDate = new Date(dto.incidentDate);
    return this.prisma.emergencyIncident.create({ data });
  }

  async findAllIncidents(companyId: string, query: QueryParams) {
    const { status, severity, incidentType, siteId, search, fromDate, toDate, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (incidentType) where.incidentType = incidentType;
    if (siteId) where.siteId = siteId;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (fromDate || toDate) {
      where.incidentDate = {};
      if (fromDate) where.incidentDate.gte = new Date(fromDate);
      if (toDate) where.incidentDate.lte = new Date(toDate);
    }
    const [items, total] = await Promise.all([
      this.prisma.emergencyIncident.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { responses: true }, orderBy: { incidentDate: 'desc' } }),
      this.prisma.emergencyIncident.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async findIncident(id: string, companyId: string) {
    return this.prisma.emergencyIncident.findFirst({ where: { id, companyId, deletedAt: null }, include: { responses: true } });
  }

  async updateIncident(id: string, dto: any, companyId: string) {
    const data: any = { ...dto };
    if (dto.incidentDate) data.incidentDate = new Date(dto.incidentDate);
    if (dto.resolvedAt) data.resolvedAt = new Date(dto.resolvedAt);
    return this.prisma.emergencyIncident.updateMany({ where: { id, companyId, deletedAt: null }, data });
  }

  async deleteIncident(id: string, companyId: string) {
    return this.prisma.emergencyIncident.updateMany({ where: { id, companyId }, data: { deletedAt: new Date() } });
  }

  // ─── Responses ───────────────────────────────────────────────────────────
  async createResponse(incidentId: string, dto: any, companyId: string) {
    const incident = await this.prisma.emergencyIncident.findFirst({ where: { id: incidentId, companyId } });
    if (!incident) throw new Error('Incident not found');
    return this.prisma.emergencyResponse.create({ data: { incidentId, companyId, ...dto } });
  }

  async findAllResponses(companyId: string, incidentId: string, query: QueryParams) {
    const { page = 1, limit = 20 } = query;
    const where: any = { companyId, incidentId };
    const [items, total] = await Promise.all([
      this.prisma.emergencyResponse.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { actionAt: 'desc' } }),
      this.prisma.emergencyResponse.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async updateResponse(id: string, dto: any, incidentId: string, companyId: string) {
    const incident = await this.prisma.emergencyIncident.findFirst({ where: { id: incidentId, companyId } });
    if (!incident) throw new Error('Incident not found');
    return this.prisma.emergencyResponse.update({ where: { id }, data: dto });
  }

  // ─── Links ───────────────────────────────────────────────────────────────
  async createLink(emergencyRecordId: string, dto: any, companyId: string) {
    return this.prisma.emergencyLink.create({ data: { emergencyRecordId, companyId, ...dto } });
  }

  async findAllLinks(companyId: string, query: QueryParams) {
    const { emergencyRecordId, emergencyRecordType, linkedModule, page = 1, limit = 20 } = query;
    const where: any = { companyId };
    if (emergencyRecordId) where.emergencyRecordId = emergencyRecordId;
    if (emergencyRecordType) where.emergencyRecordType = emergencyRecordType;
    if (linkedModule) where.linkedModule = linkedModule;
    const [items, total] = await Promise.all([
      this.prisma.emergencyLink.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.emergencyLink.count({ where }),
    ]);
    return { items, total, page: +page, limit: +limit };
  }

  async deleteLink(id: string, companyId: string) {
    return this.prisma.emergencyLink.deleteMany({ where: { id, companyId } });
  }

  // ─── Dashboard & Score ────────────────────────────────────────────────────
  async getDashboard(companyId: string) {
    const score = await this.calculateScore(companyId);
    const [plans, drills, equipment, incidents, planStats, drillStats, equipmentStats, incidentStats] = await Promise.all([
      this.prisma.emergencyPlan.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyDrill.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyEquipment.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyIncident.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyPlan.groupBy({ by: ['status'], where: { companyId, deletedAt: null }, _count: true }),
      this.prisma.emergencyDrill.groupBy({ by: ['status'], where: { companyId, deletedAt: null }, _count: true }),
      this.prisma.emergencyEquipment.groupBy({ by: ['inspectionStatus'], where: { companyId, deletedAt: null }, _count: true }),
      this.prisma.emergencyIncident.groupBy({ by: ['status'], where: { companyId, deletedAt: null }, _count: true }),
    ]);
    return {
      totalPlans: plans, totalDrills: drills, totalEquipment: equipment, totalIncidents: incidents,
      planByStatus: planStats, drillByStatus: drillStats, equipmentByStatus: equipmentStats, incidentByStatus: incidentStats,
      score,
    };
  }

  async calculateScore(companyId: string) {
    const [plans, drills, equipment, incidents, readyEquipment, completedDrills, resolvedIncidents] = await Promise.all([
      this.prisma.emergencyPlan.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyDrill.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyEquipment.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyIncident.count({ where: { companyId, deletedAt: null } }),
      this.prisma.emergencyEquipment.count({ where: { companyId, deletedAt: null, inspectionStatus: { in: ['available', 'ready'] } } }),
      this.prisma.emergencyDrill.count({ where: { companyId, deletedAt: null, status: { in: ['conducted', 'report_approved', 'closed'] } } }),
      this.prisma.emergencyIncident.count({ where: { companyId, deletedAt: null, status: { in: ['resolved', 'closed'] } } }),
    ]);

    const drillCompletionRate = drills > 0 ? (completedDrills / drills) * 100 : 0;
    const equipmentReadyRate = equipment > 0 ? (readyEquipment / equipment) * 100 : 0;
    const incidentResolveRate = incidents > 0 ? (resolvedIncidents / incidents) * 100 : 0;
    const readinessScore = Math.round((drillCompletionRate + equipmentReadyRate + incidentResolveRate) / 3);

    const result = await this.prisma.emergencyScore.upsert({
      where: { companyId },
      create: {
        companyId, totalPlans: plans, approvedPlans: 0, activePlans: 0,
        totalDrills: drills, completedDrills, totalEquipment: equipment,
        readyEquipment, totalIncidents: incidents, resolvedIncidents,
        readinessScore, drillCompletionRate, equipmentReadyRate, avgResponseTimeMin: 0,
      },
      update: {
        totalPlans: plans, totalDrills: drills, completedDrills,
        totalEquipment: equipment, readyEquipment, totalIncidents: incidents,
        resolvedIncidents, readinessScore, drillCompletionRate, equipmentReadyRate,
      },
    });
    return result;
  }
}
