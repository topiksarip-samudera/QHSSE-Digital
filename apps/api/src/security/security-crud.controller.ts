import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SecurityService } from './security.service';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/incident.dto';
import { CreateVisitorDto, UpdateVisitorDto, VisitorQueryDto } from './dto/visitor.dto';
import { CreateGatePassDto, UpdateGatePassDto, GatePassQueryDto } from './dto/gate-pass.dto';
import { CreateBadgeDto, UpdateBadgeDto, BadgeQueryDto } from './dto/badge.dto';
import { CreatePatrolDto, UpdatePatrolDto, PatrolQueryDto } from './dto/patrol.dto';
import { CreateLostItemDto, CreateTheftDto, CreateUnauthorizedAccessDto, LostItemQueryDto, TheftQueryDto, UnauthorizedAccessQueryDto } from './dto/lost-theft.dto';
import { CreateInvestigationDto, UpdateInvestigationDto, InvestigationQueryDto } from './dto/investigation.dto';
import { CreateSecurityActionDto, UpdateSecurityActionDto, SecurityActionQueryDto } from './dto/action.dto';
import { CreateSecurityLinkDto, SecurityLinkQueryDto } from './dto/link.dto';

// ─── Incidents ────────────────────────────────────────────────────────────────

@ApiTags('Security - Incidents') @ApiBearerAuth() @Controller('security')
export class SecurityIncidentController {
  constructor(private readonly svc: SecurityService) {}

  @Post('incidents') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create incident' })
  async create(@Body() dto: CreateIncidentDto, @Request() req: any) { return this.svc.createIncident(dto, req.user.companyId, req.user.id); }

  @Get('incidents') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List incidents' })
  async list(@Query() query: IncidentQueryDto, @Request() req: any) { return this.svc.findAllIncidents(req.user.companyId, query); }

  @Get('incidents/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get incident detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findIncident(id, req.user.companyId); }

  @Patch('incidents/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update incident' })
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto, @Request() req: any) { return this.svc.updateIncident(id, dto, req.user.companyId); }

  @Delete('incidents/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete incident' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteIncident(id, req.user.companyId); }
}

// ─── Visitors ─────────────────────────────────────────────────────────────────

@ApiTags('Security - Visitors') @ApiBearerAuth() @Controller('security')
export class SecurityVisitorController {
  constructor(private readonly svc: SecurityService) {}

  @Post('visitors') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create visitor' })
  async create(@Body() dto: CreateVisitorDto, @Request() req: any) { return this.svc.createVisitor(dto, req.user.companyId, req.user.id); }

  @Get('visitors') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List visitors' })
  async list(@Query() query: VisitorQueryDto, @Request() req: any) { return this.svc.findAllVisitors(req.user.companyId, query); }

  @Get('visitors/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get visitor detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findVisitor(id, req.user.companyId); }

  @Patch('visitors/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update visitor' })
  async update(@Param('id') id: string, @Body() dto: UpdateVisitorDto, @Request() req: any) { return this.svc.updateVisitor(id, dto, req.user.companyId); }

  @Post('visitors/:id/check-in') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check in visitor' })
  async checkIn(@Param('id') id: string, @Request() req: any) { return this.svc.checkInVisitor(id, req.user.companyId, req.user.id); }

  @Post('visitors/:id/check-out') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check out visitor' })
  async checkOut(@Param('id') id: string, @Request() req: any) { return this.svc.checkOutVisitor(id, req.user.companyId); }

  @Delete('visitors/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete visitor' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteVisitor(id, req.user.companyId); }
}

// ─── Gate Passes ──────────────────────────────────────────────────────────────

@ApiTags('Security - Gate Passes') @ApiBearerAuth() @Controller('security')
export class SecurityGatePassController {
  constructor(private readonly svc: SecurityService) {}

  @Post('gate-passes') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create gate pass' })
  async create(@Body() dto: CreateGatePassDto, @Request() req: any) { return this.svc.createGatePass(dto, req.user.companyId, req.user.id); }

  @Get('gate-passes') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List gate passes' })
  async list(@Query() query: GatePassQueryDto, @Request() req: any) { return this.svc.findAllGatePasses(req.user.companyId, query); }

  @Get('gate-passes/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get gate pass detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findGatePass(id, req.user.companyId); }

  @Patch('gate-passes/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update gate pass' })
  async update(@Param('id') id: string, @Body() dto: UpdateGatePassDto, @Request() req: any) { return this.svc.updateGatePass(id, dto, req.user.companyId); }

  @Post('gate-passes/:id/check-in') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check in gate pass' })
  async checkIn(@Param('id') id: string, @Request() req: any) { return this.svc.checkInGatePass(id, req.user.companyId); }

  @Post('gate-passes/:id/check-out') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check out gate pass' })
  async checkOut(@Param('id') id: string, @Request() req: any) { return this.svc.checkOutGatePass(id, req.user.companyId); }

  @Delete('gate-passes/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete gate pass' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteGatePass(id, req.user.companyId); }
}

// ─── Badges ───────────────────────────────────────────────────────────────────

@ApiTags('Security - Badges') @ApiBearerAuth() @Controller('security')
export class SecurityBadgeController {
  constructor(private readonly svc: SecurityService) {}

  @Post('badges') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create badge' })
  async create(@Body() dto: CreateBadgeDto, @Request() req: any) { return this.svc.createBadge(dto, req.user.companyId, req.user.id); }

  @Get('badges') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List badges' })
  async list(@Query() query: BadgeQueryDto, @Request() req: any) { return this.svc.findAllBadges(req.user.companyId, query); }

  @Get('badges/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get badge detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findBadge(id, req.user.companyId); }

  @Patch('badges/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update badge' })
  async update(@Param('id') id: string, @Body() dto: UpdateBadgeDto, @Request() req: any) { return this.svc.updateBadge(id, dto, req.user.companyId); }

  @Post('badges/:id/revoke') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Revoke badge' })
  async revoke(@Param('id') id: string, @Request() req: any) { return this.svc.revokeBadge(id, req.user.companyId); }

  @Delete('badges/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete badge' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteBadge(id, req.user.companyId); }
}

// ─── Access Control ───────────────────────────────────────────────────────────

@ApiTags('Security - Access Control') @ApiBearerAuth() @Controller('security')
export class SecurityAccessController {
  constructor(private readonly svc: SecurityService) {}

  @Post('access-logs') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Log access' })
  async log(@Body() dto: { accessPoint: string; userId?: string; accessType: string; result?: string; reason?: string }, @Request() req: any) { return this.svc.logAccess(req.user.companyId, dto); }

  @Get('access-logs') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List access logs' })
  async list(@Query() query: { accessPoint?: string; page?: number; limit?: number }, @Request() req: any) { return this.svc.findAllAccessLogs(req.user.companyId, query); }
}

// ─── Patrol ───────────────────────────────────────────────────────────────────

@ApiTags('Security - Patrol') @ApiBearerAuth() @Controller('security')
export class SecurityPatrolController {
  constructor(private readonly svc: SecurityService) {}

  @Post('patrols') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create patrol' })
  async create(@Body() dto: CreatePatrolDto, @Request() req: any) { return this.svc.createPatrol(dto, req.user.companyId, req.user.id); }

  @Get('patrols') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List patrols' })
  async list(@Query() query: PatrolQueryDto, @Request() req: any) { return this.svc.findAllPatrols(req.user.companyId, query); }

  @Get('patrols/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get patrol detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findPatrol(id, req.user.companyId); }

  @Patch('patrols/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update patrol' })
  async update(@Param('id') id: string, @Body() dto: UpdatePatrolDto, @Request() req: any) { return this.svc.updatePatrol(id, dto, req.user.companyId); }

  @Post('patrols/:id/complete') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Complete patrol' })
  async complete(@Param('id') id: string, @Body('notes') notes: string, @Request() req: any) { return this.svc.completePatrol(id, req.user.companyId, notes); }
}

// ─── Lost Items ───────────────────────────────────────────────────────────────

@ApiTags('Security - Lost & Found') @ApiBearerAuth() @Controller('security')
export class SecurityLostFoundController {
  constructor(private readonly svc: SecurityService) {}

  @Post('lost-items') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create lost item' })
  async createLost(@Body() dto: CreateLostItemDto, @Request() req: any) { return this.svc.createLostItem(dto, req.user.companyId, req.user.id); }

  @Get('lost-items') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List lost items' })
  async listLost(@Query() query: LostItemQueryDto, @Request() req: any) { return this.svc.findAllLostItems(req.user.companyId, query); }

  @Post('lost-items/:id/found') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Mark item as found' })
  async markFound(@Param('id') id: string, @Request() req: any) { return this.svc.markItemFound(id, req.user.companyId); }

  @Post('thefts') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create theft record' })
  async createTheft(@Body() dto: CreateTheftDto, @Request() req: any) { return this.svc.createTheft(dto, req.user.companyId, req.user.id); }

  @Get('thefts') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List thefts' })
  async listThefts(@Query() query: TheftQueryDto, @Request() req: any) { return this.svc.findAllThefts(req.user.companyId, query); }

  @Get('thefts/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get theft detail' })
  async getTheft(@Param('id') id: string, @Request() req: any) { return this.svc.findTheft(id, req.user.companyId); }

  @Patch('thefts/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update theft record' })
  async updateTheft(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.updateTheft(id, dto, req.user.companyId); }

  @Post('unauthorized-access') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create unauthorized access record' })
  async createUA(@Body() dto: CreateUnauthorizedAccessDto, @Request() req: any) { return this.svc.createUnauthorizedAccess(dto, req.user.companyId, req.user.id); }

  @Get('unauthorized-access') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List unauthorized accesses' })
  async listUA(@Query() query: UnauthorizedAccessQueryDto, @Request() req: any) { return this.svc.findAllUnauthorizedAccesses(req.user.companyId, query); }
}

// ─── Investigations ───────────────────────────────────────────────────────────

@ApiTags('Security - Investigations') @ApiBearerAuth() @Controller('security')
export class SecurityInvestigationController {
  constructor(private readonly svc: SecurityService) {}

  @Post('investigations') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create investigation' })
  async create(@Body() dto: CreateInvestigationDto, @Request() req: any) { return this.svc.createInvestigation(dto, req.user.companyId, req.user.id); }

  @Get('investigations') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List investigations' })
  async list(@Query() query: InvestigationQueryDto, @Request() req: any) { return this.svc.findAllInvestigations(req.user.companyId, query); }

  @Get('investigations/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get investigation detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findInvestigation(id, req.user.companyId); }

  @Patch('investigations/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update investigation' })
  async update(@Param('id') id: string, @Body() dto: UpdateInvestigationDto, @Request() req: any) { return this.svc.updateInvestigation(id, dto, req.user.companyId); }

  @Post('investigations/:id/complete') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Complete investigation' })
  async complete(@Param('id') id: string, @Body('conclusion') conclusion: string, @Request() req: any) { return this.svc.completeInvestigation(id, req.user.companyId, conclusion); }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

@ApiTags('Security - Actions') @ApiBearerAuth() @Controller('security')
export class SecurityActionController {
  constructor(private readonly svc: SecurityService) {}

  @Post('actions') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create security action' })
  async create(@Body() dto: CreateSecurityActionDto, @Request() req: any) { return this.svc.createSecurityAction(dto, req.user.companyId, req.user.id); }

  @Get('actions') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List security actions' })
  async list(@Query() query: SecurityActionQueryDto, @Request() req: any) { return this.svc.findAllSecurityActions(req.user.companyId, query); }

  @Get('actions/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get action detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findSecurityAction(id, req.user.companyId); }

  @Patch('actions/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update action' })
  async update(@Param('id') id: string, @Body() dto: UpdateSecurityActionDto, @Request() req: any) { return this.svc.updateSecurityAction(id, dto, req.user.companyId); }

  @Post('actions/:id/verify') @RequiredPermissions('security.verify') @ApiOperation({ summary: 'Verify action' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verifyAction(id, req.user.id, req.user.companyId); }

  @Post('actions/:id/close') @RequiredPermissions('security.close') @ApiOperation({ summary: 'Close action' })
  async close(@Param('id') id: string, @Request() req: any) { return this.svc.closeAction(id, req.user.companyId); }

  @Delete('actions/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete action' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteSecurityAction(id, req.user.companyId); }
}

// ─── Links ────────────────────────────────────────────────────────────────────

@ApiTags('Security - Links') @ApiBearerAuth() @Controller('security')
export class SecurityLinkController {
  constructor(private readonly svc: SecurityService) {}

  @Post('links') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create security link' })
  async create(@Body() dto: CreateSecurityLinkDto, @Request() req: any) { return this.svc.createLink(dto, req.user.companyId); }

  @Get('links') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List security links' })
  async list(@Query() query: SecurityLinkQueryDto, @Request() req: any) { return this.svc.findAllLinks(req.user.companyId, query); }

  @Delete('links/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete security link' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }
}
