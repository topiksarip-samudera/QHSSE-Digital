import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateAssetSettingsDto, CreateAssetDto, UpdateAssetDto, AssetQueryDto,
  CreateAssetCategoryDto, UpdateAssetCategoryDto, CreateMaintenanceDto,
  UpdateMaintenanceDto, MaintenanceQueryDto, CreateMaintenanceScheduleDto,
  UpdateMaintenanceScheduleDto, CreateInspectionDto, UpdateInspectionDto,
  InspectionQueryDto, CreateCertificateDto, UpdateCertificateDto, CertificateQueryDto,
  CreateTransferDto, UpdateTransferDto, TransferQueryDto,
  CreateDisposalDto, UpdateDisposalDto, DisposalQueryDto, CreateAssetLinkDto,
} from './dto/asset.dto';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultCompanyId(): Promise<string> {
    const company = await this.prisma.company.findFirst({ where: { status: 'active' } });
    return company?.id || 'comp-001';
  }

  // ─── Settings ───────────────────────────────────────────────────────────────

  async getSettings(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.assetSetting.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.assetSetting.create({
        data: { companyId: cid, enableCriticality: true, enableCertificateExpiry: true, defaultInspectionFreq: 'monthly', defaultMaintenanceFreq: 'monthly', enableQrCode: true, enableLoto: true, requireTransferApproval: true, requireDisposalApproval: true },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateAssetSettingsDto) {
    return this.prisma.assetSetting.upsert({
      where: { companyId },
      create: { companyId, enableCriticality: dto.enableCriticality ?? true, enableCertificateExpiry: dto.enableCertificateExpiry ?? true, defaultInspectionFreq: dto.defaultInspectionFreq ?? 'monthly', defaultMaintenanceFreq: dto.defaultMaintenanceFreq ?? 'monthly', enableQrCode: dto.enableQrCode ?? true, enableLoto: dto.enableLoto ?? true, requireTransferApproval: dto.requireTransferApproval ?? true, requireDisposalApproval: dto.requireDisposalApproval ?? true },
      update: dto,
    });
  }

  async getMasterData(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    const groups = [
      { name: 'Asset Status', code: 'asset_status', items: [{ code: 'ACTIVE', name: 'Active' }, { code: 'INACTIVE', name: 'Inactive' }, { code: 'MAINTENANCE', name: 'Under Maintenance' }, { code: 'DISPOSED', name: 'Disposed' }, { code: 'TRANSFERRED', name: 'Transferred' }] },
      { name: 'Ownership Type', code: 'asset_ownership_type', items: [{ code: 'OWNED', name: 'Owned' }, { code: 'LEASED', name: 'Leased' }, { code: 'RENTED', name: 'Rented' }, { code: 'BORROWED', name: 'Borrowed' }] },
      { name: 'Criticality Level', code: 'asset_criticality', items: [{ code: 'LOW', name: 'Low' }, { code: 'MEDIUM', name: 'Medium' }, { code: 'HIGH', name: 'High' }, { code: 'CRITICAL', name: 'Critical' }] },
      { name: 'Risk Classification', code: 'asset_risk_class', items: [{ code: 'LOW', name: 'Low Risk' }, { code: 'MODERATE', name: 'Moderate Risk' }, { code: 'HIGH', name: 'High Risk' }, { code: 'EXTREME', name: 'Extreme Risk' }] },
      { name: 'Maintenance Type', code: 'asset_maintenance_type', items: [{ code: 'PREVENTIVE', name: 'Preventive' }, { code: 'CORRECTIVE', name: 'Corrective' }, { code: 'PREDICTIVE', name: 'Predictive' }, { code: 'BREAKDOWN', name: 'Breakdown' }] },
      { name: 'Maintenance Frequency', code: 'asset_maintenance_freq', items: [{ code: 'DAILY', name: 'Daily' }, { code: 'WEEKLY', name: 'Weekly' }, { code: 'MONTHLY', name: 'Monthly' }, { code: 'QUARTERLY', name: 'Quarterly' }, { code: 'SEMIANNUAL', name: 'Semi-Annual' }, { code: 'ANNUAL', name: 'Annual' }] },
      { name: 'Inspection Type', code: 'asset_inspection_type', items: [{ code: 'VISUAL', name: 'Visual' }, { code: 'FUNCTIONAL', name: 'Functional' }, { code: 'THOROUGH', name: 'Thorough' }, { code: 'REGULATORY', name: 'Regulatory' }] },
      { name: 'Inspection Result', code: 'asset_inspection_result', items: [{ code: 'PASS', name: 'Pass' }, { code: 'FAIL', name: 'Fail' }, { code: 'CONDITIONAL', name: 'Conditional Pass' }] },
      { name: 'Certificate Type', code: 'asset_certificate_type', items: [{ code: 'CALIBRATION', name: 'Calibration' }, { code: 'LOAD_TEST', name: 'Load Test' }, { code: 'NDT', name: 'NDT' }, { code: 'PRESSURE_TEST', name: 'Pressure Test' }, { code: 'ELECTRICAL', name: 'Electrical Safety' }, { code: 'STATUTORY', name: 'Statutory' }] },
      { name: 'Certificate Status', code: 'asset_cert_status', items: [{ code: 'ACTIVE', name: 'Active' }, { code: 'EXPIRING', name: 'Expiring Soon' }, { code: 'EXPIRED', name: 'Expired' }, { code: 'REVOKED', name: 'Revoked' }] },
      { name: 'Disposal Method', code: 'asset_disposal_method', items: [{ code: 'SALE', name: 'Sale/Auction' }, { code: 'SCRAP', name: 'Scrap' }, { code: 'DONATION', name: 'Donation' }, { code: 'RETURN', name: 'Return to Lessor' }, { code: 'TRANSFER', name: 'Internal Transfer' }] },
      { name: 'Transfer Status', code: 'asset_transfer_status', items: [{ code: 'PENDING', name: 'Pending' }, { code: 'APPROVED', name: 'Approved' }, { code: 'REJECTED', name: 'Rejected' }, { code: 'COMPLETED', name: 'Completed' }] },
      { name: 'Disposal Status', code: 'asset_disposal_status', items: [{ code: 'PENDING', name: 'Pending' }, { code: 'APPROVED', name: 'Approved' }, { code: 'REJECTED', name: 'Rejected' }, { code: 'COMPLETED', name: 'Completed' }] },
    ];
    return groups;
  }

  async seedDefaults(companyId: string | undefined) {
    const cid = companyId || await this.getDefaultCompanyId();
    const groups = await this.getMasterData(cid);
    for (const group of groups) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { code: group.code } });
      if (!mg) mg = await this.prisma.masterDataGroup.create({ data: { name: group.name, code: group.code, description: `Asset ${group.name}`, isSystem: true } });
      for (const item of group.items) {
        const exists = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, code: item.code } });
        if (!exists) await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: item.name, code: item.code, value: item.code.toLowerCase() } });
      }
    }
    return { seeded: groups.reduce((s, g) => s + g.items.length, 0), groups: groups.length };
  }

  // ─── Asset Register CRUD ────────────────────────────────────────────────────

  async createAsset(dto: CreateAssetDto, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    if (dto.purchaseDate) data.purchaseDate = new Date(dto.purchaseDate);
    if (dto.warrantyExpiry) data.warrantyExpiry = new Date(dto.warrantyExpiry);
    return this.prisma.assetRegister.create({ data, include: { category: true, location: true } });
  }

  async findAllAssets(companyId: string, query: AssetQueryDto) {
    const { status, categoryId, locationId, criticalityLevel, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.locationId = locationId;
    if (criticalityLevel) where.criticalityLevel = criticalityLevel;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { assetNumber: { contains: search, mode: 'insensitive' } }, { serialNumber: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetRegister.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { category: true, location: true, _count: { select: { maintenances: true, inspections: true, certificates: true } } } }),
      this.prisma.assetRegister.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAsset(id: string, companyId: string) {
    const r = await this.prisma.assetRegister.findUnique({ where: { id }, include: { category: true, location: true, maintenances: true, inspections: true, certificates: true, transfers: true, disposals: true, links: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Asset not found');
    return r;
  }

  async updateAsset(id: string, dto: UpdateAssetDto, companyId: string) {
    await this.findAsset(id, companyId);
    const data: any = { ...dto };
    if (dto.purchaseDate) data.purchaseDate = new Date(dto.purchaseDate);
    if (dto.warrantyExpiry) data.warrantyExpiry = new Date(dto.warrantyExpiry);
    return this.prisma.assetRegister.update({ where: { id }, data, include: { category: true, location: true } });
  }

  async deleteAsset(id: string, companyId: string) {
    await this.findAsset(id, companyId);
    return this.prisma.assetRegister.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getDashboard(companyId: string) {
    const cid = companyId || await this.getDefaultCompanyId();
    const [total, active, critical, expiring, overdueMaint] = await Promise.all([
      this.prisma.assetRegister.count({ where: { companyId: cid, deletedAt: null } }),
      this.prisma.assetRegister.count({ where: { companyId: cid, status: 'active', deletedAt: null } }),
      this.prisma.assetRegister.count({ where: { companyId: cid, criticalityLevel: { in: ['HIGH', 'CRITICAL'] }, deletedAt: null } }),
      this.prisma.assetCertificate.count({ where: { companyId: cid, status: 'active', expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } } }),
      this.prisma.assetMaintenance.count({ where: { companyId: cid, status: { in: ['scheduled', 'overdue'] }, deletedAt: null } }),
    ]);
    return { totalAssets: total, activeAssets: active, criticalAssets: critical, expiringCertificates: expiring, overdueMaintenance: overdueMaint };
  }

  async getScore(companyId: string) {
    const cid = companyId || await this.getDefaultCompanyId();
    let s = await this.prisma.assetScore.findUnique({ where: { companyId: cid } });
    if (!s) {
      s = await this.prisma.assetScore.create({ data: { companyId: cid, totalAssets: 0, activeAssets: 0, criticalAssets: 0, expiringCert: 0, overdueMaint: 0, overallScore: 0 } });
    }
    return s;
  }

  // ─── Category CRUD ──────────────────────────────────────────────────────────

  async createCategory(dto: CreateAssetCategoryDto, companyId: string) {
    return this.prisma.assetCategory.create({ data: { ...dto, companyId }, include: { parent: true } });
  }

  async findAllCategories(companyId: string) {
    return this.prisma.assetCategory.findMany({ where: { companyId, deletedAt: null }, include: { parent: true, children: true, _count: { select: { assets: true } } }, orderBy: { sortOrder: 'asc' } });
  }

  async findCategory(id: string, companyId: string) {
    const r = await this.prisma.assetCategory.findUnique({ where: { id }, include: { parent: true, children: true, assets: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Category not found');
    return r;
  }

  async updateCategory(id: string, dto: UpdateAssetCategoryDto, companyId: string) {
    await this.findCategory(id, companyId);
    return this.prisma.assetCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string, companyId: string) {
    await this.findCategory(id, companyId);
    return this.prisma.assetCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Maintenance CRUD ───────────────────────────────────────────────────────

  async createMaintenance(dto: CreateMaintenanceDto, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    data.scheduledDate = new Date(dto.scheduledDate);
    if (dto.completedDate) data.completedDate = new Date(dto.completedDate);
    return this.prisma.assetMaintenance.create({ data, include: { asset: true } });
  }

  async findAllMaintenance(companyId: string, query: MaintenanceQueryDto) {
    const { status, assetId, maintenanceType, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (assetId) where.assetId = assetId;
    if (maintenanceType) where.maintenanceType = maintenanceType;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetMaintenance.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { asset: true, schedules: true } }),
      this.prisma.assetMaintenance.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findMaintenance(id: string, companyId: string) {
    const r = await this.prisma.assetMaintenance.findUnique({ where: { id }, include: { asset: true, schedules: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Maintenance not found');
    return r;
  }

  async updateMaintenance(id: string, dto: UpdateMaintenanceDto, companyId: string) {
    await this.findMaintenance(id, companyId);
    const data: any = { ...dto };
    if (dto.scheduledDate) data.scheduledDate = new Date(dto.scheduledDate);
    if (dto.completedDate) data.completedDate = new Date(dto.completedDate);
    return this.prisma.assetMaintenance.update({ where: { id }, data, include: { asset: true } });
  }

  async deleteMaintenance(id: string, companyId: string) {
    await this.findMaintenance(id, companyId);
    return this.prisma.assetMaintenance.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async completeMaintenance(id: string, companyId: string) {
    const r = await this.findMaintenance(id, companyId);
    if (r.status !== 'scheduled' && r.status !== 'in_progress') throw new Error('Only scheduled or in-progress maintenance can be completed');
    return this.prisma.assetMaintenance.update({ where: { id }, data: { status: 'completed', completedDate: new Date() } });
  }

  // ─── Maintenance Schedule CRUD ──────────────────────────────────────────────

  async createMaintenanceSchedule(dto: CreateMaintenanceScheduleDto, companyId: string, userId: string) {
    return this.prisma.maintenanceSchedule.create({
      data: { ...dto, companyId, createdBy: userId, nextDueDate: new Date(dto.nextDueDate), lastDoneDate: dto.lastDoneDate ? new Date(dto.lastDoneDate) : null },
      include: { asset: true, maintenance: true },
    });
  }

  async findAllSchedules(companyId: string) {
    return this.prisma.maintenanceSchedule.findMany({ where: { companyId, isActive: true }, include: { asset: true, maintenance: true }, orderBy: { nextDueDate: 'asc' } });
  }

  async updateSchedule(id: string, dto: UpdateMaintenanceScheduleDto, companyId: string) {
    const data: any = { ...dto };
    if (dto.nextDueDate) data.nextDueDate = new Date(dto.nextDueDate);
    if (dto.lastDoneDate) data.lastDoneDate = new Date(dto.lastDoneDate);
    return this.prisma.maintenanceSchedule.update({ where: { id }, data });
  }

  // ─── Inspection CRUD ────────────────────────────────────────────────────────

  async createInspection(dto: CreateInspectionDto, companyId: string, userId: string) {
    const data: any = { ...dto, companyId, createdBy: userId };
    data.scheduledDate = new Date(dto.scheduledDate);
    if (dto.completedDate) data.completedDate = new Date(dto.completedDate);
    return this.prisma.assetInspection.create({ data, include: { asset: true } });
  }

  async findAllInspections(companyId: string, query: InspectionQueryDto) {
    const { assetId, result, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (assetId) where.assetId = assetId;
    if (result) where.result = result;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { finding: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetInspection.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { asset: true } }),
      this.prisma.assetInspection.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findInspection(id: string, companyId: string) {
    const r = await this.prisma.assetInspection.findUnique({ where: { id }, include: { asset: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Inspection not found');
    return r;
  }

  async updateInspection(id: string, dto: UpdateInspectionDto, companyId: string) {
    await this.findInspection(id, companyId);
    const data: any = { ...dto };
    if (dto.completedDate) data.completedDate = new Date(dto.completedDate);
    return this.prisma.assetInspection.update({ where: { id }, data, include: { asset: true } });
  }

  async deleteInspection(id: string, companyId: string) {
    await this.findInspection(id, companyId);
    return this.prisma.assetInspection.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Certificate CRUD ───────────────────────────────────────────────────────

  async createCertificate(dto: CreateCertificateDto, companyId: string, userId: string) {
    return this.prisma.assetCertificate.create({
      data: { ...dto, companyId, createdBy: userId, issueDate: new Date(dto.issueDate), expiryDate: new Date(dto.expiryDate) },
      include: { asset: true },
    });
  }

  async findAllCertificates(companyId: string, query: CertificateQueryDto) {
    const { assetId, status, search, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (assetId) where.assetId = assetId;
    if (status) where.status = status;
    if (search) where.OR = [{ certificateNo: { contains: search, mode: 'insensitive' } }, { issuedBy: { contains: search, mode: 'insensitive' } }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetCertificate.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { asset: true } }),
      this.prisma.assetCertificate.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findCertificate(id: string, companyId: string) {
    const r = await this.prisma.assetCertificate.findUnique({ where: { id }, include: { asset: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Certificate not found');
    return r;
  }

  async updateCertificate(id: string, dto: UpdateCertificateDto, companyId: string) {
    await this.findCertificate(id, companyId);
    const data: any = { ...dto };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.expiryDate) data.expiryDate = new Date(dto.expiryDate);
    return this.prisma.assetCertificate.update({ where: { id }, data, include: { asset: true } });
  }

  async deleteCertificate(id: string, companyId: string) {
    await this.findCertificate(id, companyId);
    return this.prisma.assetCertificate.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async verifyCertificate(id: string, companyId: string, userId: string) {
    const cert = await this.findCertificate(id, companyId);
    return this.prisma.assetCertificate.update({ where: { id }, data: { verificationDate: new Date(), verifiedBy: userId } });
  }

  // ─── Transfer CRUD ──────────────────────────────────────────────────────────

  async createTransfer(dto: CreateTransferDto, companyId: string, userId: string) {
    return this.prisma.assetTransfer.create({
      data: { ...dto, companyId, createdBy: userId, transferDate: new Date(dto.transferDate) },
      include: { asset: true },
    });
  }

  async findAllTransfers(companyId: string, query: TransferQueryDto) {
    const { assetId, status, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (assetId) where.assetId = assetId;
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetTransfer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { asset: true } }),
      this.prisma.assetTransfer.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findTransfer(id: string, companyId: string) {
    const r = await this.prisma.assetTransfer.findUnique({ where: { id }, include: { asset: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Transfer not found');
    return r;
  }

  async approveTransfer(id: string, companyId: string, userId: string) {
    return this.prisma.assetTransfer.update({ where: { id }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
  }

  async rejectTransfer(id: string, companyId: string) {
    return this.prisma.assetTransfer.update({ where: { id }, data: { status: 'rejected' } });
  }

  async completeTransfer(id: string, companyId: string, userId: string) {
    const tr = await this.prisma.assetTransfer.findUnique({ where: { id } });
    if (!tr || tr.companyId !== companyId) throw new NotFoundException('Transfer not found');
    const data = { status: 'completed', toLocation: tr.toLocation, custody: tr.toCustodian };
    return this.prisma.$transaction([
      this.prisma.assetTransfer.update({ where: { id }, data: { status: 'completed' } }),
      this.prisma.assetRegister.update({ where: { id: tr.assetId }, data: { locationId: tr.toLocation, custodianId: tr.toCustodian } }),
    ]);
  }

  // ─── Disposal CRUD ──────────────────────────────────────────────────────────

  async createDisposal(dto: CreateDisposalDto, companyId: string, userId: string) {
    return this.prisma.assetDisposal.create({
      data: { ...dto, companyId, createdBy: userId, disposalDate: new Date(dto.disposalDate) },
      include: { asset: true },
    });
  }

  async findAllDisposals(companyId: string, query: DisposalQueryDto) {
    const { assetId, status, page = 1, limit = 20 } = query;
    const where: any = { companyId, deletedAt: null };
    if (assetId) where.assetId = assetId;
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.assetDisposal.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { asset: true } }),
      this.prisma.assetDisposal.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findDisposal(id: string, companyId: string) {
    const r = await this.prisma.assetDisposal.findUnique({ where: { id }, include: { asset: true } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Disposal not found');
    return r;
  }

  async approveDisposal(id: string, companyId: string, userId: string) {
    return this.prisma.assetDisposal.update({ where: { id }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
  }

  async rejectDisposal(id: string, companyId: string) {
    return this.prisma.assetDisposal.update({ where: { id }, data: { status: 'rejected' } });
  }

  async completeDisposal(id: string, companyId: string) {
    const disp = await this.prisma.assetDisposal.findUnique({ where: { id } });
    if (!disp || disp.companyId !== companyId) throw new NotFoundException('Disposal not found');
    return this.prisma.$transaction([
      this.prisma.assetDisposal.update({ where: { id }, data: { status: 'completed' } }),
      this.prisma.assetRegister.update({ where: { id: disp.assetId }, data: { status: 'disposed' } }),
    ]);
  }

  // ─── Link CRUD ──────────────────────────────────────────────────────────────

  async createLink(dto: CreateAssetLinkDto, companyId: string) {
    return this.prisma.assetLink.create({ data: { ...dto, companyId }, include: { asset: true } });
  }

  async getLinks(companyId: string, assetId?: string) {
    const where: any = { companyId };
    if (assetId) where.assetId = assetId;
    return this.prisma.assetLink.findMany({ where, include: { asset: true }, orderBy: { createdAt: 'desc' } });
  }

  async deleteLink(id: string, companyId: string) {
    const r = await this.prisma.assetLink.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Link not found');
    return this.prisma.assetLink.delete({ where: { id } });
  }

  // ─── Status Lifecycle ─────────────────────────────────────────────────────

  async changeAssetStatus(id: string, companyId: string, userId: string, status: string, remark?: string) {
    const asset = await this.findAsset(id, companyId);
    await this.prisma.assetStatusHistory.create({ data: { assetId: id, companyId, fromStatus: asset.status, toStatus: status, changedBy: userId, remark } });
    return this.prisma.assetRegister.update({ where: { id }, data: { status } });
  }

  async archiveAsset(id: string, companyId: string) {
    await this.findAsset(id, companyId);
    return this.prisma.assetRegister.update({ where: { id }, data: { status: 'archived', deletedAt: new Date() } });
  }

  async getAssetStatusHistory(id: string, companyId: string) {
    return this.prisma.assetStatusHistory.findMany({ where: { assetId: id, companyId }, orderBy: { createdAt: 'desc' } });
  }

  async getAssetDueList(id: string, companyId: string) {
    const [inspections, maintenance, certificates, calibrations] = await Promise.all([
      this.prisma.assetInspection.findMany({ where: { assetId: id, companyId, deletedAt: null, status: { not: 'completed' } }, orderBy: { scheduledDate: 'asc' }, take: 5 }),
      this.prisma.assetMaintenance.findMany({ where: { assetId: id, companyId, deletedAt: null, status: { in: ['scheduled', 'overdue'] } }, orderBy: { scheduledDate: 'asc' }, take: 5 }),
      this.prisma.assetCertificate.findMany({ where: { assetId: id, companyId, deletedAt: null, expiryDate: { lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) } } }),
      this.prisma.assetCalibration.findMany({ where: { assetId: id, companyId, status: { not: 'completed' } }, orderBy: { nextDueDate: 'asc' } }),
    ]);
    return { inspections, maintenance, certificates, calibrations };
  }

  // ─── Certificate Extra ───────────────────────────────────────────────────

  async getExpiringCertificates(companyId: string, days: number = 30) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    return this.prisma.assetCertificate.findMany({ where: { companyId, deletedAt: null, expiryDate: { lte: threshold, gte: new Date() }, status: 'active' }, include: { asset: { select: { id: true, name: true, assetNumber: true } } }, orderBy: { expiryDate: 'asc' } });
  }

  async getExpiredCertificates(companyId: string) {
    return this.prisma.assetCertificate.findMany({ where: { companyId, deletedAt: null, expiryDate: { lt: new Date() }, status: { not: 'expired' } }, include: { asset: { select: { id: true, name: true } } }, orderBy: { expiryDate: 'asc' } });
  }

  // ─── Inspection Extra ────────────────────────────────────────────────────

  async getInspectionsDue(companyId: string, days: number = 14) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    return this.prisma.assetInspection.findMany({ where: { companyId, deletedAt: null, scheduledDate: { lte: threshold }, status: { not: 'completed' } }, include: { asset: { select: { id: true, name: true, assetNumber: true } } }, orderBy: { scheduledDate: 'asc' } });
  }

  async completeInspection(id: string, companyId: string, userId: string, dto: any) {
    const data: any = { status: 'completed', completedDate: new Date(), result: dto.result, finding: dto.finding, score: dto.score };
    if (dto.completedDate) data.completedDate = new Date(dto.completedDate);
    return this.prisma.assetInspection.update({ where: { id }, data });
  }

  async createInspectionFinding(id: string, companyId: string, userId: string, dto: any) {
    const inspection = await this.prisma.assetInspection.findUnique({ where: { id } });
    return this.prisma.assetInspection.update({ where: { id }, data: { findingCreated: true, finding: dto.description || `Finding from inspection #${inspection?.inspectionNumber || id}` } });
  }

  // ─── KPI & Due List ──────────────────────────────────────────────────────

  async getKpi(companyId: string) {
    const [total, active, critical, maintenanceDue, inspectionDue, calibrationDue, certExpiringNext30d, certExpired] = await Promise.all([
      this.prisma.assetRegister.count({ where: { companyId, deletedAt: null } }),
      this.prisma.assetRegister.count({ where: { companyId, status: 'active', deletedAt: null } }),
      this.prisma.assetRegister.count({ where: { companyId, criticalityLevel: { in: ['HIGH', 'CRITICAL'] }, deletedAt: null } }),
      this.prisma.assetMaintenance.count({ where: { companyId, status: { in: ['scheduled', 'overdue'] }, deletedAt: null } }),
      this.prisma.assetInspection.count({ where: { companyId, status: { not: 'completed' }, deletedAt: null } }),
      this.prisma.assetCalibration.count({ where: { companyId, status: { not: 'completed' } } }),
      this.prisma.assetCertificate.count({ where: { companyId, expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), gte: new Date() }, status: 'active', deletedAt: null } }),
      this.prisma.assetCertificate.count({ where: { companyId, expiryDate: { lt: new Date() }, status: { not: 'expired' }, deletedAt: null } }),
    ]);
    const complianceRate = total > 0 ? Math.round(((total - (certExpired || 0)) / total) * 100) : 100;
    return { totalAssets: total, activeAssets: active, criticalAssets: critical, maintenanceDue, inspectionDue, calibrationDue, certExpiringNext30d, certExpired, complianceRate };
  }

  async getDueList(companyId: string, days: number = 30) {
    const threshold = new Date(); threshold.setDate(threshold.getDate() + days);
    const [inspections, maintenance, certificates, calibrations] = await Promise.all([
      this.prisma.assetInspection.findMany({ where: { companyId, deletedAt: null, scheduledDate: { lte: threshold }, status: { not: 'completed' } }, include: { asset: { select: { id: true, name: true } } }, take: 20 }),
      this.prisma.assetMaintenance.findMany({ where: { companyId, deletedAt: null, scheduledDate: { lte: threshold }, status: { in: ['scheduled', 'overdue'] } }, include: { asset: { select: { id: true, name: true } } }, take: 20 }),
      this.prisma.assetCertificate.findMany({ where: { companyId, deletedAt: null, expiryDate: { lte: threshold }, status: 'active' }, include: { asset: { select: { id: true, name: true } } }, take: 20 }),
      this.prisma.assetCalibration.findMany({ where: { companyId, nextDueDate: { lte: threshold }, status: { not: 'completed' } }, include: { asset: { select: { id: true, name: true } } }, take: 20 }),
    ]);
    return { inspections, maintenance, certificates, calibrations, totalDue: inspections.length + maintenance.length + certificates.length + calibrations.length };
  }

  async getCriticalEquipment(companyId: string) {
    return this.prisma.assetRegister.findMany({ where: { companyId, deletedAt: null, isCritical: true, OR: [{ criticalityLevel: { in: ['HIGH', 'CRITICAL'] } }] }, include: { category: true, location: true, certificates: { where: { status: 'active' } }, inspections: { take: 1, orderBy: { createdAt: 'desc' } }, maintenances: { take: 1, orderBy: { createdAt: 'desc' } }, calibrations: { take: 1, orderBy: { createdAt: 'desc' } } } });
  }

  async getEquipmentReadiness(companyId: string) {
    const equipment = await this.prisma.assetRegister.findMany({ where: { companyId, deletedAt: null, isEmergencyEquipment: true }, select: { id: true, name: true, status: true, criticalityLevel: true, assetNumber: true } });
    const total = equipment.length;
    const ready = equipment.filter(e => e.status === 'active' && e.criticalityLevel !== 'HIGH' && e.criticalityLevel !== 'CRITICAL').length;
    return { totalEmergencyEquipment: total, readyEquipment: ready, readinessPercentage: total > 0 ? Math.round((ready / total) * 100) : 0, items: equipment };
  }

  // ─── QR ──────────────────────────────────────────────────────────────────

  async generateQr(id: string, companyId: string) {
    const asset = await this.findAsset(id, companyId);
    const qrData = JSON.stringify({ id: asset.id, number: asset.assetNumber, name: asset.name, type: 'asset' });
    const qrCode = await this.prisma.assetQrCode.upsert({ where: { assetId: id }, create: { assetId: id, companyId, code: qrData, generatedAt: new Date() }, update: { code: qrData, generatedAt: new Date() } });
    return { qrCode, asset: { id: asset.id, name: asset.name, assetNumber: asset.assetNumber, status: asset.status } };
  }

  async verifyQr(code: string, companyId: string, userId: string) {
    try {
      const parsed = JSON.parse(code);
      const asset = await this.prisma.assetRegister.findFirst({ where: { id: parsed.id, companyId }, include: { category: true, location: true, certificates: { where: { status: 'active' }, take: 3 }, inspections: { take: 1, orderBy: { createdAt: 'desc' } } } });
      if (!asset) return { verified: false, error: 'Asset not found' };
      await this.prisma.assetQrVerification.create({ data: { assetId: asset.id, companyId, verifiedBy: userId, verifiedAt: new Date() } });
      return { verified: true, asset };
    } catch { return { verified: false, error: 'Invalid QR code' }; }
  }

  // ─── Export ──────────────────────────────────────────────────────────────

  async exportAssets(companyId: string, type?: string) {
    let data: any;
    switch (type) {
      case 'certificates': data = await this.prisma.assetCertificate.findMany({ where: { companyId, deletedAt: null }, include: { asset: true } }); break;
      case 'inspections': data = await this.prisma.assetInspection.findMany({ where: { companyId, deletedAt: null }, include: { asset: true } }); break;
      case 'maintenance': data = await this.prisma.assetMaintenance.findMany({ where: { companyId, deletedAt: null }, include: { asset: true } }); break;
      case 'critical': data = await this.getCriticalEquipment(companyId); break;
      default: data = await this.prisma.assetRegister.findMany({ where: { companyId, deletedAt: null }, include: { category: true, location: true } });
    }
    return { type: type || 'register', exportedAt: new Date().toISOString(), count: data.length, data };
  }
}
