import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';
import {
  CreateAssetDto, UpdateAssetDto, AssetQueryDto, CreateAssetCategoryDto, UpdateAssetCategoryDto,
  CreateMaintenanceDto, UpdateMaintenanceDto, MaintenanceQueryDto, CreateMaintenanceScheduleDto,
  UpdateMaintenanceScheduleDto, CreateInspectionDto, UpdateInspectionDto, InspectionQueryDto,
  CreateCertificateDto, UpdateCertificateDto, CertificateQueryDto,
  CreateTransferDto, TransferQueryDto,
  CreateDisposalDto, DisposalQueryDto, CreateAssetLinkDto,
} from './dto/asset.dto';

// ─── Asset Register CRUD ────────────────────────────────────────────────────
@ApiTags('Asset Register') @ApiBearerAuth() @Controller('asset/register')
export class AssetRegisterController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create asset' })
  async create(@Body() dto: CreateAssetDto, @Request() req: any) { return this.svc.createAsset(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List assets' })
  async findAll(@Query() query: AssetQueryDto, @Request() req: any) { return this.svc.findAllAssets(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findAsset(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update asset' })
  async update(@Param('id') id: string, @Body() dto: UpdateAssetDto, @Request() req: any) { return this.svc.updateAsset(id, dto, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete asset' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteAsset(id, req.user.companyId); }
}

// ─── Asset Category CRUD ────────────────────────────────────────────────────
@ApiTags('Asset Category') @ApiBearerAuth() @Controller('asset/categories')
export class AssetCategoryController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create category' })
  async create(@Body() dto: CreateAssetCategoryDto, @Request() req: any) { return this.svc.createCategory(dto, req.user.companyId); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List categories' })
  async findAll(@Request() req: any) { return this.svc.findAllCategories(req.user.companyId); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get category' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findCategory(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: string, @Body() dto: UpdateAssetCategoryDto, @Request() req: any) { return this.svc.updateCategory(id, dto, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete category' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteCategory(id, req.user.companyId); }
}

// ─── Maintenance CRUD ───────────────────────────────────────────────────────
@ApiTags('Asset Maintenance') @ApiBearerAuth() @Controller('asset/maintenance')
export class AssetMaintenanceController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create maintenance' })
  async create(@Body() dto: CreateMaintenanceDto, @Request() req: any) { return this.svc.createMaintenance(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List maintenance' })
  async findAll(@Query() query: MaintenanceQueryDto, @Request() req: any) { return this.svc.findAllMaintenance(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get maintenance' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findMaintenance(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update maintenance' })
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenanceDto, @Request() req: any) { return this.svc.updateMaintenance(id, dto, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete maintenance' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteMaintenance(id, req.user.companyId); }
  @Post(':id/complete') @RequiredPermissions('asset.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete maintenance' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.completeMaintenance(id, req.user.companyId); }
}

// ─── Maintenance Schedule CRUD ──────────────────────────────────────────────
@ApiTags('Asset Maintenance Schedule') @ApiBearerAuth() @Controller('asset/schedules')
export class AssetScheduleController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create schedule' })
  async create(@Body() dto: CreateMaintenanceScheduleDto, @Request() req: any) { return this.svc.createMaintenanceSchedule(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List schedules' })
  async findAll(@Request() req: any) { return this.svc.findAllSchedules(req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update schedule' })
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenanceScheduleDto, @Request() req: any) { return this.svc.updateSchedule(id, dto, req.user.companyId); }
}

// ─── Inspection CRUD ────────────────────────────────────────────────────────
@ApiTags('Asset Inspection') @ApiBearerAuth() @Controller('asset/inspections')
export class AssetInspectionController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create inspection' })
  async create(@Body() dto: CreateInspectionDto, @Request() req: any) { return this.svc.createInspection(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List inspections' })
  async findAll(@Query() query: InspectionQueryDto, @Request() req: any) { return this.svc.findAllInspections(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get inspection' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findInspection(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update inspection' })
  async update(@Param('id') id: string, @Body() dto: UpdateInspectionDto, @Request() req: any) { return this.svc.updateInspection(id, dto, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete inspection' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteInspection(id, req.user.companyId); }
}

// ─── Certificate CRUD ───────────────────────────────────────────────────────
@ApiTags('Asset Certificate') @ApiBearerAuth() @Controller('asset/certificates')
export class AssetCertificateController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create certificate' })
  async create(@Body() dto: CreateCertificateDto, @Request() req: any) { return this.svc.createCertificate(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List certificates' })
  async findAll(@Query() query: CertificateQueryDto, @Request() req: any) { return this.svc.findAllCertificates(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get certificate' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findCertificate(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update certificate' })
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto, @Request() req: any) { return this.svc.updateCertificate(id, dto, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete certificate' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteCertificate(id, req.user.companyId); }
  @Post(':id/verify') @RequiredPermissions('asset.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify certificate' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verifyCertificate(id, req.user.companyId, req.user.id); }
}

// ─── Transfer CRUD ──────────────────────────────────────────────────────────
@ApiTags('Asset Transfer') @ApiBearerAuth() @Controller('asset/transfers')
export class AssetTransferController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create transfer' })
  async create(@Body() dto: CreateTransferDto, @Request() req: any) { return this.svc.createTransfer(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List transfers' })
  async findAll(@Query() query: TransferQueryDto, @Request() req: any) { return this.svc.findAllTransfers(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get transfer' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findTransfer(id, req.user.companyId); }
  @Post(':id/approve') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve transfer' })
  async approve(@Param('id') id: string, @Request() req: any) { return this.svc.approveTransfer(id, req.user.companyId, req.user.id); }
  @Post(':id/reject') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject transfer' })
  async reject(@Param('id') id: string, @Request() req: any) { return this.svc.rejectTransfer(id, req.user.companyId); }
  @Post(':id/complete') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete transfer' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.completeTransfer(id, req.user.companyId, req.user.id); }
}

// ─── Disposal CRUD ──────────────────────────────────────────────────────────
@ApiTags('Asset Disposal') @ApiBearerAuth() @Controller('asset/disposals')
export class AssetDisposalController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create disposal' })
  async create(@Body() dto: CreateDisposalDto, @Request() req: any) { return this.svc.createDisposal(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List disposals' })
  async findAll(@Query() query: DisposalQueryDto, @Request() req: any) { return this.svc.findAllDisposals(req.user.companyId, query); }
  @Get(':id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get disposal' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findDisposal(id, req.user.companyId); }
  @Post(':id/approve') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve disposal' })
  async approve(@Param('id') id: string, @Request() req: any) { return this.svc.approveDisposal(id, req.user.companyId, req.user.id); }
  @Post(':id/reject') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject disposal' })
  async reject(@Param('id') id: string, @Request() req: any) { return this.svc.rejectDisposal(id, req.user.companyId); }
  @Post(':id/complete') @RequiredPermissions('asset.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete disposal' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.completeDisposal(id, req.user.companyId); }
}

// ─── Link CRUD ──────────────────────────────────────────────────────────────
@ApiTags('Asset Link') @ApiBearerAuth() @Controller('asset/links')
export class AssetLinkController {
  constructor(private readonly svc: AssetService) {}
  @Post() @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create link' })
  async create(@Body() dto: CreateAssetLinkDto, @Request() req: any) { return this.svc.createLink(dto, req.user.companyId); }
  @Get() @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List links' })
  async findAll(@Query('assetId') assetId: string, @Request() req: any) { return this.svc.getLinks(req.user.companyId, assetId); }
  @Delete(':id') @RequiredPermissions('asset.delete') @ApiOperation({ summary: 'Delete link' })
  async remove(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }
}
