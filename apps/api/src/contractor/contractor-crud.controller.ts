import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ContractorService } from './contractor.service';
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

// ─── Profiles ──────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Profiles') @ApiBearerAuth() @Controller('contractor')
export class ContractorProfileController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create contractor profile' })
  async create(@Body() dto: CreateProfileDto, @Request() req: any) { return this.svc.createProfile(dto, req.user.companyId, req.user.id); }

  @Get('profiles') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List profiles' })
  async list(@Query() query: ProfileQueryDto, @Request() req: any) { return this.svc.findAllProfiles(req.user.companyId, query); }

  @Get('profiles/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get profile detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findProfile(id, req.user.companyId); }

  @Patch('profiles/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update profile' })
  async update(@Param('id') id: string, @Body() dto: UpdateProfileDto, @Request() req: any) { return this.svc.updateProfile(id, dto, req.user.companyId); }

  @Delete('profiles/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete profile' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteProfile(id, req.user.companyId); }

  @Post('profiles/:id/status') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update profile status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateProfileStatusDto, @Request() req: any) { return this.svc.updateProfileStatus(id, dto, req.user.companyId); }
}

// ─── Prequalifications ─────────────────────────────────────────────────────────

@ApiTags('Contractor - Prequalifications') @ApiBearerAuth() @Controller('contractor')
export class ContractorPrequalificationController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/prequalifications') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create prequalification' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreatePrequalificationDto, @Request() req: any) { return this.svc.createPrequalification(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/prequalifications') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List prequalifications' })
  async list(@Param('contractorId') contractorId: string, @Query() query: PrequalificationQueryDto, @Request() req: any) { return this.svc.findAllPrequalifications(contractorId, req.user.companyId, query); }

  @Get('prequalifications/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get prequalification detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findPrequalification(id, req.user.companyId); }

  @Patch('prequalifications/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update prequalification' })
  async update(@Param('id') id: string, @Body() dto: UpdatePrequalificationDto, @Request() req: any) { return this.svc.updatePrequalification(id, dto, req.user.companyId); }

  @Post('prequalifications/:id/status') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Approve/Reject prequalification' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePrequalStatusDto, @Request() req: any) { return this.svc.updatePrequalificationStatus(id, dto, req.user.companyId); }

  @Delete('prequalifications/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete prequalification' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deletePrequalification(id, req.user.companyId); }
}

// ─── Documents ─────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Documents') @ApiBearerAuth() @Controller('contractor')
export class ContractorDocumentController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/documents') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create document' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateDocumentDto, @Request() req: any) { return this.svc.createDocument(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/documents') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List documents' })
  async list(@Param('contractorId') contractorId: string, @Query() query: DocumentQueryDto, @Request() req: any) { return this.svc.findAllDocuments(contractorId, req.user.companyId, query); }

  @Get('documents/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get document detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findDocument(id, req.user.companyId); }

  @Patch('documents/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update document' })
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto, @Request() req: any) { return this.svc.updateDocument(id, dto, req.user.companyId); }

  @Delete('documents/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete document' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteDocument(id, req.user.companyId); }
}

// ─── Workers ────────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Workers') @ApiBearerAuth() @Controller('contractor')
export class ContractorWorkerController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/workers') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create worker' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateWorkerDto, @Request() req: any) { return this.svc.createWorker(contractorId, dto, req.user.companyId); }

  @Get('profiles/:contractorId/workers') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List workers' })
  async list(@Param('contractorId') contractorId: string, @Query() query: WorkerQueryDto, @Request() req: any) { return this.svc.findAllWorkers(contractorId, req.user.companyId, query); }

  @Get('workers/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get worker detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findWorker(id, req.user.companyId); }

  @Patch('workers/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update worker' })
  async update(@Param('id') id: string, @Body() dto: UpdateWorkerDto, @Request() req: any) { return this.svc.updateWorker(id, dto, req.user.companyId); }

  @Post('workers/:id/status') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update worker status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateWorkerStatusDto, @Request() req: any) { return this.svc.updateWorkerStatus(id, dto, req.user.companyId); }

  @Delete('workers/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete worker' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteWorker(id, req.user.companyId); }

  @Post('workers/:workerId/competencies') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Add worker competency' })
  async createCompetency(@Param('workerId') workerId: string, @Body() dto: CreateWorkerCompetencyDto, @Request() req: any) { return this.svc.createWorkerCompetency(workerId, dto, req.user.companyId, req.user.id); }

  @Get('workers/:workerId/competencies') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List worker competencies' })
  async listCompetencies(@Param('workerId') workerId: string, @Query() query: WorkerCompetencyQueryDto, @Request() req: any) { return this.svc.findAllWorkerCompetencies(workerId, req.user.companyId, query); }

  @Get('worker-competencies/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get competency detail' })
  async getCompetency(@Param('id') id: string, @Request() req: any) { return this.svc.findWorkerCompetency(id, req.user.companyId); }

  @Patch('worker-competencies/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update competency' })
  async updateCompetency(@Param('id') id: string, @Body() dto: UpdateWorkerCompetencyDto, @Request() req: any) { return this.svc.updateWorkerCompetency(id, dto, req.user.companyId); }

  @Delete('worker-competencies/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete competency' })
  async deleteCompetency(@Param('id') id: string, @Request() req: any) { return this.svc.deleteWorkerCompetency(id, req.user.companyId); }
}

// ─── Equipment ─────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Equipment') @ApiBearerAuth() @Controller('contractor')
export class ContractorEquipmentController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/equipment') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create equipment' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateEquipmentDto, @Request() req: any) { return this.svc.createEquipment(contractorId, dto, req.user.companyId); }

  @Get('profiles/:contractorId/equipment') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List equipment' })
  async list(@Param('contractorId') contractorId: string, @Query() query: EquipmentQueryDto, @Request() req: any) { return this.svc.findAllEquipment(contractorId, req.user.companyId, query); }

  @Get('equipment/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get equipment detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findEquipment(id, req.user.companyId); }

  @Patch('equipment/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update equipment' })
  async update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto, @Request() req: any) { return this.svc.updateEquipment(id, dto, req.user.companyId); }

  @Post('equipment/:id/status') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update equipment status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateEquipmentStatusDto, @Request() req: any) { return this.svc.updateEquipmentStatus(id, dto, req.user.companyId); }

  @Delete('equipment/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete equipment' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteEquipment(id, req.user.companyId); }
}

// ─── Audits & Inspections ──────────────────────────────────────────────────────

@ApiTags('Contractor - Audits & Inspections') @ApiBearerAuth() @Controller('contractor')
export class ContractorAuditInspectionController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/audits') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create audit/inspection' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateAuditInspectionDto, @Request() req: any) { return this.svc.createAuditInspection(contractorId, dto, req.user.companyId); }

  @Get('profiles/:contractorId/audits') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List audits/inspections' })
  async list(@Param('contractorId') contractorId: string, @Query() query: AuditInspectionQueryDto, @Request() req: any) { return this.svc.findAllAuditInspections(contractorId, req.user.companyId, query); }

  @Get('audits/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get audit/inspection detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findAuditInspection(id, req.user.companyId); }

  @Patch('audits/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update audit/inspection' })
  async update(@Param('id') id: string, @Body() dto: UpdateAuditInspectionDto, @Request() req: any) { return this.svc.updateAuditInspection(id, dto, req.user.companyId); }

  @Delete('audits/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete audit/inspection' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteAuditInspection(id, req.user.companyId); }
}

// ─── Incidents ─────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Incidents') @ApiBearerAuth() @Controller('contractor')
export class ContractorIncidentController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/incidents') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create incident' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateIncidentDto, @Request() req: any) { return this.svc.createIncident(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/incidents') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List incidents' })
  async list(@Param('contractorId') contractorId: string, @Query() query: IncidentQueryDto, @Request() req: any) { return this.svc.findAllIncidents(contractorId, req.user.companyId, query); }

  @Get('incidents/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get incident detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findIncident(id, req.user.companyId); }

  @Patch('incidents/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update incident' })
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto, @Request() req: any) { return this.svc.updateIncident(id, dto, req.user.companyId); }

  @Delete('incidents/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete incident' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteIncident(id, req.user.companyId); }
}

// ─── Suspensions ────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Suspensions') @ApiBearerAuth() @Controller('contractor')
export class ContractorSuspensionController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/suspensions') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Suspend contractor' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateSuspensionDto, @Request() req: any) { return this.svc.createSuspension(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/suspensions') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List suspensions' })
  async list(@Param('contractorId') contractorId: string, @Query() query: SuspensionQueryDto, @Request() req: any) { return this.svc.findAllSuspensions(contractorId, req.user.companyId, query); }

  @Get('suspensions/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get suspension detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findSuspension(id, req.user.companyId); }

  @Post('suspensions/:id/reinstate') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Reinstate contractor' })
  async reinstate(@Param('id') id: string, @Request() req: any) { return this.svc.reinstateSuspension(id, req.user.companyId, req.user.id); }

  @Delete('suspensions/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete suspension' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteSuspension(id, req.user.companyId); }
}

// ─── Watchlists ─────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Watchlists') @ApiBearerAuth() @Controller('contractor')
export class ContractorWatchlistController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/watchlists') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Add to watchlist' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateWatchlistDto, @Request() req: any) { return this.svc.createWatchlist(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/watchlists') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List watchlist entries' })
  async list(@Param('contractorId') contractorId: string, @Query() query: WatchlistQueryDto, @Request() req: any) { return this.svc.findAllWatchlists(contractorId, req.user.companyId, query); }

  @Get('watchlists/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get watchlist detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findWatchlist(id, req.user.companyId); }

  @Post('watchlists/:id/clear') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Clear from watchlist' })
  async clear(@Param('id') id: string, @Request() req: any) { return this.svc.updateWatchlistStatus(id, 'cleared', req.user.companyId); }

  @Delete('watchlists/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete watchlist entry' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteWatchlist(id, req.user.companyId); }
}

// ─── Performance ────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Performance') @ApiBearerAuth() @Controller('contractor')
export class ContractorPerformanceController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/performance') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create performance record' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreatePerformanceDto, @Request() req: any) { return this.svc.createPerformance(contractorId, dto, req.user.companyId, req.user.id); }

  @Get('profiles/:contractorId/performance') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List performance records' })
  async list(@Param('contractorId') contractorId: string, @Query() query: PerformanceQueryDto, @Request() req: any) { return this.svc.findAllPerformance(contractorId, req.user.companyId, query); }

  @Get('performance/:id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get performance record' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findPerformance(id, req.user.companyId); }

  @Patch('performance/:id') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update performance record' })
  async update(@Param('id') id: string, @Body() dto: UpdatePerformanceDto, @Request() req: any) { return this.svc.updatePerformance(id, dto, req.user.companyId); }

  @Delete('performance/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete performance record' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deletePerformance(id, req.user.companyId); }
}

// ─── Links ──────────────────────────────────────────────────────────────────────

@ApiTags('Contractor - Links') @ApiBearerAuth() @Controller('contractor')
export class ContractorLinkController {
  constructor(private readonly svc: ContractorService) {}

  @Post('profiles/:contractorId/links') @RequiredPermissions('contractor.create') @ApiOperation({ summary: 'Create link' })
  async create(@Param('contractorId') contractorId: string, @Body() dto: CreateLinkDto, @Request() req: any) { return this.svc.createLink(contractorId, dto, req.user.companyId); }

  @Get('profiles/:contractorId/links') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List links' })
  async list(@Param('contractorId') contractorId: string, @Query() query: LinkQueryDto, @Request() req: any) { return this.svc.findAllLinks(contractorId, req.user.companyId, query); }

  @Delete('links/:id') @RequiredPermissions('contractor.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete link' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }
}
