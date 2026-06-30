import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSecuritySettingsDto } from './dto/security-settings.dto';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/incident.dto';
import { CreateVisitorDto, UpdateVisitorDto, VisitorQueryDto } from './dto/visitor.dto';
import { CreateGatePassDto, UpdateGatePassDto, GatePassQueryDto } from './dto/gate-pass.dto';
import { CreateBadgeDto, UpdateBadgeDto, BadgeQueryDto } from './dto/badge.dto';
import { CreatePatrolDto, UpdatePatrolDto, PatrolQueryDto } from './dto/patrol.dto';
import { CreateLostItemDto, CreateTheftDto, CreateUnauthorizedAccessDto, LostItemQueryDto, TheftQueryDto, UnauthorizedAccessQueryDto } from './dto/lost-theft.dto';
import { CreateInvestigationDto, UpdateInvestigationDto, InvestigationQueryDto } from './dto/investigation.dto';
import { CreateSecurityActionDto, UpdateSecurityActionDto, SecurityActionQueryDto } from './dto/action.dto';
import { CreateSecurityLinkDto, SecurityLinkQueryDto } from './dto/link.dto';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-001';
  }

  // ─── Settings ───────────────────────────────────────────────────────────

  async getSettings(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.securitySetting.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.securitySetting.create({
        data: { companyId: cid, requireBadgeCheck: true, defaultPatrolFrequencyHrs: 4, visitorExpiryHrs: 24, requireInvestigation: true, autoEscalate: true },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateSecuritySettingsDto) {
    return this.prisma.securitySetting.upsert({
      where: { companyId },
      create: {
        companyId,
        requireBadgeCheck: dto.requireBadgeCheck ?? true,
        defaultPatrolFrequencyHrs: dto.defaultPatrolFrequencyHrs || 4,
        visitorExpiryHrs: dto.visitorExpiryHrs || 24,
        requireInvestigation: dto.requireInvestigation ?? true,
        autoEscalate: dto.autoEscalate ?? true,
      },
      update: dto,
    });
  }

  // ─── Incidents ──────────────────────────────────────────────────────────

  async createIncident(dto: CreateIncidentDto, companyId: string, userId: string) {
    return this.prisma.securityIncident.create({
      data: {
        title: dto.title,
        incidentType: dto.incidentType,
        severity: dto.severity || 'low',
        description: dto.description,
        location: dto.location,
        reportedBy: dto.reportedBy || userId,
        assignedTo: dto.assignedTo,
        incidentDate: new Date(dto.incidentDate),
        companyId,
        createdBy: userId,
      },
    });
  }

  async findAllIncidents(companyId: string, query: IncidentQueryDto) {
    const { status, incidentType, severity, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (incidentType) where.incidentType = incidentType;
    if (severity) where.severity = severity;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.securityIncident.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.securityIncident.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findIncident(id: string, companyId: string) {
    const r = await this.prisma.securityIncident.findUnique({ where: { id }, include: { investigations: true, actions: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Incident not found');
    return r;
  }

  async updateIncident(id: string, dto: UpdateIncidentDto, companyId: string) {
    const r = await this.findIncident(id, companyId);
    return this.prisma.securityIncident.update({ where: { id: r.id }, data: dto });
  }

  async deleteIncident(id: string, companyId: string) {
    await this.findIncident(id, companyId);
    return this.prisma.securityIncident.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Visitors ───────────────────────────────────────────────────────────

  async createVisitor(dto: CreateVisitorDto, companyId: string, userId: string) {
    return this.prisma.visitorRecord.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAllVisitors(companyId: string, query: VisitorQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.visitorName = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.visitorRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.visitorRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findVisitor(id: string, companyId: string) {
    const r = await this.prisma.visitorRecord.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Visitor not found');
    return r;
  }

  async updateVisitor(id: string, dto: UpdateVisitorDto, companyId: string) {
    const r = await this.findVisitor(id, companyId);
    return this.prisma.visitorRecord.update({ where: { id: r.id }, data: dto });
  }

  async checkInVisitor(id: string, companyId: string, userId: string) {
    const r = await this.findVisitor(id, companyId);
    return this.prisma.visitorRecord.update({ where: { id: r.id }, data: { checkIn: new Date(), status: 'checked_in' } });
  }

  async checkOutVisitor(id: string, companyId: string) {
    const r = await this.findVisitor(id, companyId);
    return this.prisma.visitorRecord.update({ where: { id: r.id }, data: { checkOut: new Date(), status: 'checked_out' } });
  }

  async deleteVisitor(id: string, companyId: string) {
    await this.findVisitor(id, companyId);
    return this.prisma.visitorRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Gate Passes ────────────────────────────────────────────────────────

  async createGatePass(dto: CreateGatePassDto, companyId: string, userId: string) {
    return this.prisma.gatePass.create({ data: { ...dto, entryTime: dto.entryTime ? new Date(dto.entryTime) : undefined, exitTime: dto.exitTime ? new Date(dto.exitTime) : undefined, companyId, createdBy: userId } });
  }

  async findAllGatePasses(companyId: string, query: GatePassQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.passNumber = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.gatePass.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.gatePass.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findGatePass(id: string, companyId: string) {
    const r = await this.prisma.gatePass.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Gate pass not found');
    return r;
  }

  async updateGatePass(id: string, dto: UpdateGatePassDto, companyId: string) {
    const r = await this.findGatePass(id, companyId);
    return this.prisma.gatePass.update({ where: { id: r.id }, data: { ...dto, entryTime: dto.entryTime ? new Date(dto.entryTime) : undefined, exitTime: dto.exitTime ? new Date(dto.exitTime) : undefined } });
  }

  async checkInGatePass(id: string, companyId: string) {
    await this.findGatePass(id, companyId);
    return this.prisma.gatePass.update({ where: { id }, data: { entryTime: new Date(), status: 'checked_in' } });
  }

  async checkOutGatePass(id: string, companyId: string) {
    await this.findGatePass(id, companyId);
    return this.prisma.gatePass.update({ where: { id }, data: { exitTime: new Date(), status: 'checked_out' } });
  }

  async deleteGatePass(id: string, companyId: string) {
    await this.findGatePass(id, companyId);
    return this.prisma.gatePass.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Badges ─────────────────────────────────────────────────────────────

  async createBadge(dto: CreateBadgeDto, companyId: string, userId: string) {
    return this.prisma.idBadge.create({ data: { ...dto, issuedDate: new Date(dto.issuedDate), expiryDate: new Date(dto.expiryDate), companyId, createdBy: userId } });
  }

  async findAllBadges(companyId: string, query: BadgeQueryDto) {
    const { status, badgeType, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (badgeType) where.badgeType = badgeType;
    if (search) where.badgeNumber = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.idBadge.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.idBadge.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findBadge(id: string, companyId: string) {
    const r = await this.prisma.idBadge.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Badge not found');
    return r;
  }

  async updateBadge(id: string, dto: UpdateBadgeDto, companyId: string) {
    const r = await this.findBadge(id, companyId);
    return this.prisma.idBadge.update({ where: { id: r.id }, data: { ...dto, issuedDate: dto.issuedDate ? new Date(dto.issuedDate) : undefined, expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined } });
  }

  async revokeBadge(id: string, companyId: string) {
    await this.findBadge(id, companyId);
    return this.prisma.idBadge.update({ where: { id }, data: { status: 'suspended' } });
  }

  async deleteBadge(id: string, companyId: string) {
    await this.findBadge(id, companyId);
    return this.prisma.idBadge.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Access Control ─────────────────────────────────────────────────────

  async logAccess(companyId: string, dto: { accessPoint: string; userId?: string; accessType: string; result?: string; reason?: string }) {
    return this.prisma.accessControl.create({ data: { ...dto, accessTime: new Date(), companyId } });
  }

  async findAllAccessLogs(companyId: string, query: { accessPoint?: string; page?: number; limit?: number }) {
    const { accessPoint, page = 1, limit = 20 } = query;
    const where: any = { companyId };
    if (accessPoint) where.accessPoint = accessPoint;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.accessControl.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.accessControl.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Patrol ─────────────────────────────────────────────────────────────

  async createPatrol(dto: CreatePatrolDto, companyId: string, userId: string) {
    return this.prisma.securityPatrol.create({ data: { ...dto, scheduledTime: new Date(dto.scheduledTime), companyId, createdBy: userId } });
  }

  async findAllPatrols(companyId: string, query: PatrolQueryDto) {
    const { status, patrolArea, page = 1, limit = 20 } = query;
    const where: any = { companyId };
    if (status) where.status = status;
    if (patrolArea) where.patrolArea = patrolArea;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.securityPatrol.findMany({ where, skip, take: limit, orderBy: { scheduledTime: 'desc' } }),
      this.prisma.securityPatrol.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findPatrol(id: string, companyId: string) {
    const r = await this.prisma.securityPatrol.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Patrol not found');
    return r;
  }

  async updatePatrol(id: string, dto: UpdatePatrolDto, companyId: string) {
    const r = await this.findPatrol(id, companyId);
    return this.prisma.securityPatrol.update({ where: { id: r.id }, data: { ...dto, actualTime: dto.actualTime ? new Date(dto.actualTime) : undefined } });
  }

  async completePatrol(id: string, companyId: string, notes?: string) {
    await this.findPatrol(id, companyId);
    return this.prisma.securityPatrol.update({ where: { id }, data: { actualTime: new Date(), status: 'completed', notes: notes || undefined } });
  }

  // ─── Lost Items ─────────────────────────────────────────────────────────

  async createLostItem(dto: CreateLostItemDto, companyId: string, userId: string) {
    return this.prisma.lostItem.create({ data: { ...dto, reportDate: new Date(dto.reportDate), companyId, createdBy: userId } });
  }

  async findAllLostItems(companyId: string, query: LostItemQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.itemName = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.lostItem.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.lostItem.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markItemFound(id: string, companyId: string) {
    const r = await this.prisma.lostItem.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Lost item not found');
    return this.prisma.lostItem.update({ where: { id }, data: { status: 'found', foundDate: new Date() } });
  }

  // ─── Theft Records ──────────────────────────────────────────────────────

  async createTheft(dto: CreateTheftDto, companyId: string, userId: string) {
    return this.prisma.theftRecord.create({ data: { ...dto, reportingDate: new Date(dto.reportingDate), companyId, createdBy: userId } });
  }

  async findAllThefts(companyId: string, query: TheftQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.theftRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.theftRecord.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findTheft(id: string, companyId: string) {
    const r = await this.prisma.theftRecord.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Theft record not found');
    return r;
  }

  async updateTheft(id: string, dto: any, companyId: string) {
    const r = await this.findTheft(id, companyId);
    return this.prisma.theftRecord.update({ where: { id: r.id }, data: dto });
  }

  // ─── Unauthorized Access ────────────────────────────────────────────────

  async createUnauthorizedAccess(dto: CreateUnauthorizedAccessDto, companyId: string, userId: string) {
    return this.prisma.unauthorizedAccess.create({ data: { ...dto, attemptTime: new Date(dto.attemptTime), companyId, reportedBy: userId, createdBy: userId } });
  }

  async findAllUnauthorizedAccesses(companyId: string, query: UnauthorizedAccessQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.unauthorizedAccess.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.unauthorizedAccess.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Investigations ─────────────────────────────────────────────────────

  async createInvestigation(dto: CreateInvestigationDto, companyId: string, userId: string) {
    return this.prisma.securityInvestigation.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async findAllInvestigations(companyId: string, query: InvestigationQueryDto) {
    const { status, incidentId, page = 1, limit = 20 } = query;
    const where: any = { companyId };
    if (status) where.status = status;
    if (incidentId) where.incidentId = incidentId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.securityInvestigation.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { incident: { select: { id: true, title: true } } } }),
      this.prisma.securityInvestigation.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findInvestigation(id: string, companyId: string) {
    const r = await this.prisma.securityInvestigation.findUnique({ where: { id }, include: { incident: true, actions: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Investigation not found');
    return r;
  }

  async updateInvestigation(id: string, dto: UpdateInvestigationDto, companyId: string) {
    const r = await this.findInvestigation(id, companyId);
    return this.prisma.securityInvestigation.update({ where: { id: r.id }, data: { ...dto, completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined } });
  }

  async completeInvestigation(id: string, companyId: string, conclusion?: string) {
    await this.findInvestigation(id, companyId);
    return this.prisma.securityInvestigation.update({ where: { id }, data: { status: 'completed', completedAt: new Date(), conclusion: conclusion || undefined } });
  }

  // ─── Actions ────────────────────────────────────────────────────────────

  async createSecurityAction(dto: CreateSecurityActionDto, companyId: string, userId: string) {
    return this.prisma.securityAction.create({ data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, companyId, createdBy: userId } });
  }

  async findAllSecurityActions(companyId: string, query: SecurityActionQueryDto) {
    const { status, incidentId, investigationId, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (incidentId) where.incidentId = incidentId;
    if (investigationId) where.investigationId = investigationId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.securityAction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { incident: { select: { id: true, title: true } } } }),
      this.prisma.securityAction.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findSecurityAction(id: string, companyId: string) {
    const r = await this.prisma.securityAction.findUnique({ where: { id }, include: { incident: true, investigation: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Action not found');
    return r;
  }

  async updateSecurityAction(id: string, dto: UpdateSecurityActionDto, companyId: string) {
    const r = await this.findSecurityAction(id, companyId);
    return this.prisma.securityAction.update({ where: { id: r.id }, data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined } });
  }

  async verifyAction(id: string, verifiedById: string, companyId: string) {
    await this.findSecurityAction(id, companyId);
    return this.prisma.securityAction.update({ where: { id }, data: { verifiedById, status: 'verified' } });
  }

  async closeAction(id: string, companyId: string) {
    await this.findSecurityAction(id, companyId);
    return this.prisma.securityAction.update({ where: { id }, data: { status: 'closed' } });
  }

  async deleteSecurityAction(id: string, companyId: string) {
    await this.findSecurityAction(id, companyId);
    return this.prisma.securityAction.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Links ──────────────────────────────────────────────────────────────

  async createLink(dto: CreateSecurityLinkDto, companyId: string) {
    return this.prisma.securityLink.create({ data: { ...dto, companyId } });
  }

  async findAllLinks(companyId: string, query: SecurityLinkQueryDto) {
    const { securityRecordId, linkedModule, page = 1, limit = 20 } = query;
    const where: any = { companyId };
    if (securityRecordId) where.securityRecordId = securityRecordId;
    if (linkedModule) where.linkedModule = linkedModule;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.securityLink.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.securityLink.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async deleteLink(id: string, companyId: string) {
    const r = await this.prisma.securityLink.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Link not found');
    return this.prisma.securityLink.delete({ where: { id } });
  }

  // ─── Dashboard / Score ──────────────────────────────────────────────────

  async getDashboard(companyId: string) {
    const cid = companyId || await this.getDefaultCompanyId();
    const score = await this.prisma.securityScore.findUnique({ where: { companyId: cid } });
    const incidents = await this.prisma.securityIncident.count({ where: { companyId: cid, deletedAt: null } });
    const openIncidents = await this.prisma.securityIncident.count({ where: { companyId: cid, deletedAt: null, status: 'open' } });
    const activeVisitors = await this.prisma.visitorRecord.count({ where: { companyId: cid, status: 'checked_in', deletedAt: null } });
    const patrols = await this.prisma.securityPatrol.count({ where: { companyId: cid } });
    const completedPatrols = await this.prisma.securityPatrol.count({ where: { companyId: cid, status: 'completed' } });
    const openInvestigations = await this.prisma.securityInvestigation.count({ where: { companyId: cid, status: 'in_progress' } });
    const openActions = await this.prisma.securityAction.count({ where: { companyId: cid, deletedAt: null, status: 'open' } });
    const activeGatePasses = await this.prisma.gatePass.count({ where: { companyId: cid, status: 'checked_in', deletedAt: null } });
    return {
      score: score?.score || 100,
      totalIncidents: incidents,
      openIncidents,
      resolvedIncidents: incidents - openIncidents,
      activeVisitors,
      patrolCompliance: patrols > 0 ? Math.round((completedPatrols / patrols) * 100) : 100,
      openInvestigations,
      openActions,
      activeGatePasses,
    };
  }

  async getScore(companyId: string) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.securityScore.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.securityScore.create({ data: { companyId: cid } });
    }
    return s;
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
      { name: 'Security Incident Type', items: ['Theft', 'Unauthorized Access', 'Vandalism', 'Assault', 'Suspicious Activity', 'Policy Violation', 'Equipment Tampering', 'Data Breach'] },
      { name: 'Security Severity', items: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'Visitor Type', items: ['Guest', 'Contractor', 'Vendor', 'Inspector', 'Auditor', 'Government'] },
      { name: 'Gate Pass Type', items: ['Vehicle', 'Material', 'Personnel', 'Equipment'] },
      { name: 'Vehicle Type', items: ['Car', 'Truck', 'Motorcycle', 'Bus', 'Heavy Equipment'] },
      { name: 'Security Incident Category', items: ['Physical Security', 'Information Security', 'Personnel Security', 'Asset Protection'] },
      { name: 'Investigation Status', items: ['In Progress', 'Completed', 'On Hold'] },
      { name: 'Action Type', items: ['Corrective', 'Preventive', 'Disciplinary', 'Improvement'] },
      { name: 'Access Card Status', items: ['Active', 'Expired', 'Lost', 'Suspended'] },
      { name: 'Patrol Status', items: ['Pending', 'Completed', 'Missed'] },
      { name: 'Checkpoint Result', items: ['OK', 'Finding', 'Issue', 'Critical'] },
      { name: 'Lost Item Status', items: ['Reported', 'Searching', 'Found', 'Closed'] },
      { name: 'Theft Status', items: ['Reported', 'Investigating', 'Resolved', 'Closed'] },
      { name: 'Unauthorized Access Type', items: ['Tailgating', 'Forced Entry', 'Badge Misuse', 'Restricted Area'] },
      { name: 'Action Status', items: ['Open', 'In Progress', 'Verified', 'Closed', 'Overdue'] },
    ];
    let count = 0;
    for (const group of groups) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.name, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.name, code: group.name.toLowerCase().replace(/\s+/g, '_'), description: `Security Management - ${group.name}`, companyId } });
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
