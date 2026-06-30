import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContractorSettingsDto } from './dto/contractor-settings.dto';
import { CreateProfileDto, UpdateProfileDto, ProfileQueryDto, UpdateProfileStatusDto } from './dto/profile.dto';
import { CreatePrequalificationDto, UpdatePrequalificationDto, UpdatePrequalStatusDto, PrequalificationQueryDto } from './dto/prequalification.dto';
import { CreateDocumentDto, UpdateDocumentDto, DocumentQueryDto } from './dto/document.dto';
import { CreateWorkerDto, UpdateWorkerDto, WorkerQueryDto, UpdateWorkerStatusDto, CreateWorkerCompetencyDto, UpdateWorkerCompetencyDto, WorkerCompetencyQueryDto } from './dto/worker.dto';
import { CreateEquipmentDto, UpdateEquipmentDto, EquipmentQueryDto, UpdateEquipmentStatusDto } from './dto/equipment.dto';
import { CreateAuditInspectionDto, UpdateAuditInspectionDto, AuditInspectionQueryDto } from './dto/audit.dto';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/incident.dto';
import { CreateSuspensionDto, UpdateSuspensionDto, SuspensionQueryDto } from './dto/suspension.dto';
import { CreateWatchlistDto, UpdateWatchlistDto, WatchlistQueryDto } from './dto/watchlist.dto';
import { CreatePerformanceDto, UpdatePerformanceDto, PerformanceQueryDto } from './dto/performance.dto';
import { CreateLinkDto, LinkQueryDto } from './dto/link.dto';

@Injectable()
export class ContractorService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-default';
  }

  private async ensureCompanyId(companyId?: string): Promise<string> {
    return companyId || this.getDefaultCompanyId();
  }

  // ─── Settings ───────────────────────────────────────────────────────────

  async getSettings(companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    let s = await this.prisma.contractorSetting.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.contractorSetting.create({ data: { companyId: cid } });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateContractorSettingsDto) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorSetting.upsert({
      where: { companyId: cid },
      create: { companyId: cid, ...dto },
      update: dto,
    });
  }

  // ─── Profiles ───────────────────────────────────────────────────────────

  async createProfile(dto: CreateProfileDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorProfile.create({
      data: { ...dto, companyId: cid, createdBy: userId },
    });
  }

  async findAllProfiles(companyId: string, query: ProfileQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId: cid, deletedAt: null };
    if (status) where.status = status;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { contractorCode: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorProfile.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorProfile.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findProfile(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const profile = await this.prisma.contractorProfile.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!profile) throw new NotFoundException('Contractor profile not found');
    return profile;
  }

  async updateProfile(id: string, dto: UpdateProfileDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    await this.findProfile(id, cid);
    return this.prisma.contractorProfile.update({ where: { id }, data: dto });
  }

  async deleteProfile(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    await this.findProfile(id, cid);
    return this.prisma.contractorProfile.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async updateProfileStatus(id: string, dto: UpdateProfileStatusDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    await this.findProfile(id, cid);
    return this.prisma.contractorProfile.update({ where: { id }, data: { status: dto.status } });
  }

  // ─── Prequalifications ──────────────────────────────────────────────────

  async createPrequalification(contractorId: string, dto: CreatePrequalificationDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    await this.findProfile(contractorId, cid);
    return this.prisma.contractorPrequalification.create({
      data: { ...dto, contractorId, companyId: cid, assessedBy: userId, assessedDate: new Date() },
    });
  }

  async findAllPrequalifications(contractorId: string, companyId: string, query: PrequalificationQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, riskLevel, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    if (riskLevel) where.riskLevel = riskLevel;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorPrequalification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorPrequalification.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findPrequalification(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const pq = await this.prisma.contractorPrequalification.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!pq) throw new NotFoundException('Prequalification not found');
    return pq;
  }

  async updatePrequalification(id: string, dto: UpdatePrequalificationDto, companyId: string) {
    await this.findPrequalification(id, companyId);
    return this.prisma.contractorPrequalification.update({ where: { id }, data: dto });
  }

  async updatePrequalificationStatus(id: string, dto: UpdatePrequalStatusDto, companyId: string) {
    await this.findPrequalification(id, companyId);
    return this.prisma.contractorPrequalification.update({ where: { id }, data: { status: dto.status, ...(dto.score !== undefined ? { score: dto.score } : {}) } });
  }

  async deletePrequalification(id: string, companyId: string) {
    await this.findPrequalification(id, companyId);
    return this.prisma.contractorPrequalification.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Documents ──────────────────────────────────────────────────────────

  async createDocument(contractorId: string, dto: CreateDocumentDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorDocument.create({
      data: { ...dto, contractorId, companyId: cid, uploadedBy: userId },
    });
  }

  async findAllDocuments(contractorId: string, companyId: string, query: DocumentQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { documentType, status, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (documentType) where.documentType = documentType;
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorDocument.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorDocument.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findDocument(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const doc = await this.prisma.contractorDocument.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async updateDocument(id: string, dto: UpdateDocumentDto, companyId: string) {
    await this.findDocument(id, companyId);
    return this.prisma.contractorDocument.update({ where: { id }, data: dto });
  }

  async deleteDocument(id: string, companyId: string) {
    await this.findDocument(id, companyId);
    return this.prisma.contractorDocument.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Workers ────────────────────────────────────────────────────────────

  async createWorker(contractorId: string, dto: CreateWorkerDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorWorker.create({
      data: { ...dto, contractorId, companyId: cid },
    });
  }

  async findAllWorkers(contractorId: string, companyId: string, query: WorkerQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    if (search) where.fullName = { contains: search, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorWorker.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorWorker.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findWorker(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const worker = await this.prisma.contractorWorker.findFirst({ where: { id, companyId: cid, deletedAt: null }, include: { competencies: true } });
    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }

  async updateWorker(id: string, dto: UpdateWorkerDto, companyId: string) {
    await this.findWorker(id, companyId);
    return this.prisma.contractorWorker.update({ where: { id }, data: dto });
  }

  async updateWorkerStatus(id: string, dto: UpdateWorkerStatusDto, companyId: string) {
    await this.findWorker(id, companyId);
    return this.prisma.contractorWorker.update({ where: { id }, data: { status: dto.status } });
  }

  async deleteWorker(id: string, companyId: string) {
    await this.findWorker(id, companyId);
    return this.prisma.contractorWorker.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Worker Competencies ────────────────────────────────────────────────

  async createWorkerCompetency(workerId: string, dto: CreateWorkerCompetencyDto, companyId: string, userId: string) {
    await this.findWorker(workerId, companyId);
    return this.prisma.contractorWorkerCompetency.create({
      data: { ...dto, workerId, verifiedById: userId, verifiedAt: new Date() },
    });
  }

  async findAllWorkerCompetencies(workerId: string, companyId: string, query: WorkerCompetencyQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, competencyType, page = 1, limit = 20 } = query;
    const where: any = { workerId, deletedAt: null };
    if (status) where.status = status;
    if (competencyType) where.competencyType = competencyType;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorWorkerCompetency.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorWorkerCompetency.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findWorkerCompetency(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const comp = await this.prisma.contractorWorkerCompetency.findFirst({ where: { id, deletedAt: null } });
    if (!comp) throw new NotFoundException('Worker competency not found');
    return comp;
  }

  async updateWorkerCompetency(id: string, dto: UpdateWorkerCompetencyDto, companyId: string) {
    await this.findWorkerCompetency(id, companyId);
    return this.prisma.contractorWorkerCompetency.update({ where: { id }, data: dto });
  }

  async deleteWorkerCompetency(id: string, companyId: string) {
    await this.findWorkerCompetency(id, companyId);
    return this.prisma.contractorWorkerCompetency.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Equipment ──────────────────────────────────────────────────────────

  async createEquipment(contractorId: string, dto: CreateEquipmentDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorEquipment.create({
      data: { ...dto, contractorId, companyId: cid },
    });
  }

  async findAllEquipment(contractorId: string, companyId: string, query: EquipmentQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, equipmentType, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    if (equipmentType) where.equipmentType = equipmentType;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorEquipment.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorEquipment.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findEquipment(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const equip = await this.prisma.contractorEquipment.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!equip) throw new NotFoundException('Equipment not found');
    return equip;
  }

  async updateEquipment(id: string, dto: UpdateEquipmentDto, companyId: string) {
    await this.findEquipment(id, companyId);
    return this.prisma.contractorEquipment.update({ where: { id }, data: dto });
  }

  async updateEquipmentStatus(id: string, dto: UpdateEquipmentStatusDto, companyId: string) {
    await this.findEquipment(id, companyId);
    return this.prisma.contractorEquipment.update({ where: { id }, data: { status: dto.status } });
  }

  async deleteEquipment(id: string, companyId: string) {
    await this.findEquipment(id, companyId);
    return this.prisma.contractorEquipment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Audits & Inspections ───────────────────────────────────────────────

  async createAuditInspection(contractorId: string, dto: CreateAuditInspectionDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorAuditInspection.create({
      data: { ...dto, contractorId, companyId: cid, date: dto.date ? new Date(dto.date) : new Date() },
    });
  }

  async findAllAuditInspections(contractorId: string, companyId: string, query: AuditInspectionQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { result, auditInspectionType, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (result) where.result = result;
    if (auditInspectionType) where.auditInspectionType = auditInspectionType;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorAuditInspection.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
      this.prisma.contractorAuditInspection.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findAuditInspection(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const audit = await this.prisma.contractorAuditInspection.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!audit) throw new NotFoundException('Audit/Inspection not found');
    return audit;
  }

  async updateAuditInspection(id: string, dto: UpdateAuditInspectionDto, companyId: string) {
    await this.findAuditInspection(id, companyId);
    return this.prisma.contractorAuditInspection.update({ where: { id }, data: dto });
  }

  async deleteAuditInspection(id: string, companyId: string) {
    await this.findAuditInspection(id, companyId);
    return this.prisma.contractorAuditInspection.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Incidents ──────────────────────────────────────────────────────────

  async createIncident(contractorId: string, dto: CreateIncidentDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorIncident.create({
      data: { ...dto, contractorId, companyId: cid, reportedBy: userId, incidentDate: dto.incidentDate ? new Date(dto.incidentDate) : new Date() },
    });
  }

  async findAllIncidents(contractorId: string, companyId: string, query: IncidentQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, severity, incidentType, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (incidentType) where.incidentType = incidentType;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorIncident.findMany({ where, skip, take: limit, orderBy: { incidentDate: 'desc' } }),
      this.prisma.contractorIncident.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findIncident(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const incident = await this.prisma.contractorIncident.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async updateIncident(id: string, dto: UpdateIncidentDto, companyId: string) {
    await this.findIncident(id, companyId);
    return this.prisma.contractorIncident.update({ where: { id }, data: dto });
  }

  async deleteIncident(id: string, companyId: string) {
    await this.findIncident(id, companyId);
    return this.prisma.contractorIncident.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Suspensions ────────────────────────────────────────────────────────

  async createSuspension(contractorId: string, dto: CreateSuspensionDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const suspension = await this.prisma.contractorSuspension.create({
      data: { ...dto, contractorId, companyId: cid, suspendedBy: userId },
    });
    await this.prisma.contractorProfile.update({ where: { id: contractorId }, data: { status: 'suspended' } });
    return suspension;
  }

  async findAllSuspensions(contractorId: string, companyId: string, query: SuspensionQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorSuspension.findMany({ where, skip, take: limit, orderBy: { suspendedAt: 'desc' } }),
      this.prisma.contractorSuspension.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findSuspension(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const s = await this.prisma.contractorSuspension.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!s) throw new NotFoundException('Suspension not found');
    return s;
  }

  async reinstateSuspension(id: string, companyId: string, userId: string) {
    const s = await this.findSuspension(id, companyId);
    await this.prisma.contractorSuspension.update({ where: { id }, data: { status: 'resolved', reinstatedBy: userId, reinstatedAt: new Date() } });
    return this.prisma.contractorProfile.update({ where: { id: s.contractorId }, data: { status: 'approved' } });
  }

  async deleteSuspension(id: string, companyId: string) {
    await this.findSuspension(id, companyId);
    return this.prisma.contractorSuspension.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Watchlists ─────────────────────────────────────────────────────────

  async createWatchlist(contractorId: string, dto: CreateWatchlistDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorWatchlist.create({
      data: { ...dto, contractorId, companyId: cid, addedBy: userId },
    });
  }

  async findAllWatchlists(contractorId: string, companyId: string, query: WatchlistQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { status, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorWatchlist.findMany({ where, skip, take: limit, orderBy: { addedAt: 'desc' } }),
      this.prisma.contractorWatchlist.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findWatchlist(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const w = await this.prisma.contractorWatchlist.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!w) throw new NotFoundException('Watchlist entry not found');
    return w;
  }

  async updateWatchlistStatus(id: string, status: string, companyId: string) {
    await this.findWatchlist(id, companyId);
    return this.prisma.contractorWatchlist.update({ where: { id }, data: { status } });
  }

  async deleteWatchlist(id: string, companyId: string) {
    await this.findWatchlist(id, companyId);
    return this.prisma.contractorWatchlist.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Performance ────────────────────────────────────────────────────────

  async createPerformance(contractorId: string, dto: CreatePerformanceDto, companyId: string, userId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorPerformanceRecord.create({
      data: { ...dto, contractorId, companyId: cid, ratedBy: userId },
    });
  }

  async findAllPerformance(contractorId: string, companyId: string, query: PerformanceQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { rating, ratingPeriod, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid, deletedAt: null };
    if (rating) where.rating = rating;
    if (ratingPeriod) where.ratingPeriod = ratingPeriod;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorPerformanceRecord.findMany({ where, skip, take: limit, orderBy: { ratedAt: 'desc' } }),
      this.prisma.contractorPerformanceRecord.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findPerformance(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const p = await this.prisma.contractorPerformanceRecord.findFirst({ where: { id, companyId: cid, deletedAt: null } });
    if (!p) throw new NotFoundException('Performance record not found');
    return p;
  }

  async updatePerformance(id: string, dto: UpdatePerformanceDto, companyId: string) {
    await this.findPerformance(id, companyId);
    return this.prisma.contractorPerformanceRecord.update({ where: { id }, data: dto });
  }

  async deletePerformance(id: string, companyId: string) {
    await this.findPerformance(id, companyId);
    return this.prisma.contractorPerformanceRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Links ──────────────────────────────────────────────────────────────

  async createLink(contractorId: string, dto: CreateLinkDto, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    return this.prisma.contractorLink.create({
      data: { ...dto, contractorId, companyId: cid },
    });
  }

  async findAllLinks(contractorId: string, companyId: string, query: LinkQueryDto) {
    const cid = await this.ensureCompanyId(companyId);
    const { linkedModule, page = 1, limit = 20 } = query;
    const where: any = { contractorId, companyId: cid };
    if (linkedModule) where.linkedModule = linkedModule;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contractorLink.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contractorLink.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async deleteLink(id: string, companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const link = await this.prisma.contractorLink.findFirst({ where: { id, companyId: cid } });
    if (!link) throw new NotFoundException('Link not found');
    return this.prisma.contractorLink.delete({ where: { id } });
  }

  // ─── Score & Dashboard ──────────────────────────────────────────────────

  async getScore(companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    let s = await this.prisma.contractorScore.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.contractorScore.create({ data: { companyId: cid } });
    }
    return this.recalculateScore(cid);
  }

  async recalculateScore(companyId: string) {
    const cid = await this.ensureCompanyId(companyId);
    const [totalContractors, approvedCount, suspendedCount, highRiskCount, prequals] = await Promise.all([
      this.prisma.contractorProfile.count({ where: { companyId: cid, deletedAt: null } }),
      this.prisma.contractorProfile.count({ where: { companyId: cid, status: 'approved', deletedAt: null } }),
      this.prisma.contractorProfile.count({ where: { companyId: cid, status: 'suspended', deletedAt: null } }),
      this.prisma.contractorPrequalification.count({ where: { companyId: cid, riskLevel: 'high', deletedAt: null } }),
      this.prisma.contractorPrequalification.aggregate({ where: { companyId: cid, deletedAt: null }, _avg: { score: true }, _count: true }),
    ]);
    const passCount = await this.prisma.contractorPrequalification.count({ where: { companyId: cid, status: 'approved', deletedAt: null } });
    const prequalTotal = prequals._count;
    const prequalPassRate = prequalTotal > 0 ? (passCount / prequalTotal) * 100 : 0;
    const overallScore = calculateOverall(totalContractors, approvedCount, suspendedCount, highRiskCount, prequalPassRate);

    return this.prisma.contractorScore.upsert({
      where: { companyId: cid },
      create: { companyId: cid, totalContractors, approvedCount, suspendedCount, highRiskCount, prequalPassRate, overallScore },
      update: { totalContractors, approvedCount, suspendedCount, highRiskCount, prequalPassRate, overallScore },
    });
  }
}

function calculateOverall(total: number, approved: number, suspended: number, highRisk: number, passRate: number): number {
  const totalWeight = 100;
  let score = totalWeight;
  if (total > 0) {
    score -= (suspended / total) * 30;
    score -= (highRisk / total) * 20;
  }
  score += (approved / Math.max(total, 1)) * 10;
  score += (passRate / 100) * 20;
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}
