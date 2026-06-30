import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EmergencyService } from './emergency.service';
import { CreatePlanDto, UpdatePlanDto, PlanQueryDto } from './dto/plan.dto';
import { CreateTeamDto, UpdateTeamDto, TeamQueryDto, CreateTeamMemberDto, UpdateTeamMemberDto } from './dto/team.dto';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from './dto/contact.dto';
import { CreateDrillDto, UpdateDrillDto, DrillQueryDto, CreateDrillResultDto } from './dto/drill.dto';
import { CreateEquipmentDto, UpdateEquipmentDto, EquipmentQueryDto } from './dto/equipment.dto';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/incident.dto';
import { CreateResponseDto, UpdateResponseDto, ResponseQueryDto } from './dto/response.dto';
import { CreateLinkDto, LinkQueryDto } from './dto/link.dto';

// ─── Plans ─────────────────────────────────────────────────────────────────

@ApiTags('Emergency - Plans') @ApiBearerAuth() @Controller('emergency')
export class EmergencyPlanController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('plans') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create plan' })
  async create(@Body() dto: CreatePlanDto, @Request() req: any) { return this.svc.createPlan(dto, req.user.companyId, req.user.id); }

  @Get('plans') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List plans' })
  async list(@Query() query: PlanQueryDto, @Request() req: any) { return this.svc.findAllPlans(req.user.companyId, query); }

  @Get('plans/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get plan detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findPlan(id, req.user.companyId); }

  @Patch('plans/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update plan' })
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto, @Request() req: any) { return this.svc.updatePlan(id, dto, req.user.companyId); }

  @Delete('plans/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete plan' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deletePlan(id, req.user.companyId); }

  @Post('plans/:id/submit') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Submit plan' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submitPlan(id, req.user.companyId); }

  @Post('plans/:id/approve') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Approve plan' })
  async approve(@Param('id') id: string, @Request() req: any) { return this.svc.approvePlan(id, req.user.companyId, req.user.id); }

  @Post('plans/:id/activate') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Activate plan' })
  async activate(@Param('id') id: string, @Request() req: any) { return this.svc.activatePlan(id, req.user.companyId); }
}

// ─── Teams ─────────────────────────────────────────────────────────────────

@ApiTags('Emergency - Teams') @ApiBearerAuth() @Controller('emergency')
export class EmergencyTeamController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('teams') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create team' })
  async create(@Body() dto: CreateTeamDto, @Request() req: any) { return this.svc.createTeam(dto, req.user.companyId, req.user.id); }

  @Get('teams') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List teams' })
  async list(@Query() query: TeamQueryDto, @Request() req: any) { return this.svc.findAllTeams(req.user.companyId, query); }

  @Get('teams/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get team detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findTeam(id, req.user.companyId); }

  @Patch('teams/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update team' })
  async update(@Param('id') id: string, @Body() dto: UpdateTeamDto, @Request() req: any) { return this.svc.updateTeam(id, dto, req.user.companyId); }

  @Delete('teams/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete team' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteTeam(id, req.user.companyId); }

  @Post('teams/:id/members') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Add team member' })
  async addMember(@Param('id') id: string, @Body() dto: CreateTeamMemberDto, @Request() req: any) { return this.svc.addTeamMember(id, dto, req.user.companyId); }

  @Patch('teams/:id/members/:memberId') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update team member' })
  async updateMember(@Param('id') id: string, @Param('memberId') memberId: string, @Body() dto: UpdateTeamMemberDto, @Request() req: any) { return this.svc.updateTeamMember(memberId, dto, id, req.user.companyId); }

  @Delete('teams/:id/members/:memberId') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove team member' })
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @Request() req: any) { return this.svc.removeTeamMember(memberId, id, req.user.companyId); }
}

// ─── Contacts ──────────────────────────────────────────────────────────────

@ApiTags('Emergency - Contacts') @ApiBearerAuth() @Controller('emergency')
export class EmergencyContactController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('contacts') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create contact' })
  async create(@Body() dto: CreateContactDto, @Request() req: any) { return this.svc.createContact(dto, req.user.companyId, req.user.id); }

  @Get('contacts') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List contacts' })
  async list(@Query() query: ContactQueryDto, @Request() req: any) { return this.svc.findAllContacts(req.user.companyId, query); }

  @Get('contacts/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get contact detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findContact(id, req.user.companyId); }

  @Patch('contacts/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update contact' })
  async update(@Param('id') id: string, @Body() dto: UpdateContactDto, @Request() req: any) { return this.svc.updateContact(id, dto, req.user.companyId); }

  @Delete('contacts/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete contact' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteContact(id, req.user.companyId); }
}

// ─── Drills ────────────────────────────────────────────────────────────────

@ApiTags('Emergency - Drills') @ApiBearerAuth() @Controller('emergency')
export class EmergencyDrillController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('drills') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create drill' })
  async create(@Body() dto: CreateDrillDto, @Request() req: any) { return this.svc.createDrill(dto, req.user.companyId, req.user.id); }

  @Get('drills') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List drills' })
  async list(@Query() query: DrillQueryDto, @Request() req: any) { return this.svc.findAllDrills(req.user.companyId, query); }

  @Get('drills/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get drill detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findDrill(id, req.user.companyId); }

  @Patch('drills/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update drill' })
  async update(@Param('id') id: string, @Body() dto: UpdateDrillDto, @Request() req: any) { return this.svc.updateDrill(id, dto, req.user.companyId); }

  @Delete('drills/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete drill' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteDrill(id, req.user.companyId); }

  @Post('drills/:id/start') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Start drill execution' })
  async start(@Param('id') id: string, @Request() req: any) { return this.svc.startDrill(id, req.user.companyId, req.user.id); }

  @Post('drills/:id/complete') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Complete drill execution' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.completeDrill(id, req.user.companyId); }

  @Post('drills/:id/results') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Add drill result' })
  async addResult(@Param('id') id: string, @Body() dto: CreateDrillResultDto, @Request() req: any) { return this.svc.addDrillResult(id, dto, req.user.companyId, req.user.id); }

  @Patch('drills/:id/results/:resultId') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update drill result' })
  async updateResult(@Param('id') id: string, @Param('resultId') resultId: string, @Body() dto: CreateDrillResultDto, @Request() req: any) { return this.svc.updateDrillResult(resultId, dto, id, req.user.companyId); }
}

// ─── Equipment ─────────────────────────────────────────────────────────────

@ApiTags('Emergency - Equipment') @ApiBearerAuth() @Controller('emergency')
export class EmergencyEquipmentController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('equipment') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create equipment' })
  async create(@Body() dto: CreateEquipmentDto, @Request() req: any) { return this.svc.createEquipment(dto, req.user.companyId, req.user.id); }

  @Get('equipment') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List equipment' })
  async list(@Query() query: EquipmentQueryDto, @Request() req: any) { return this.svc.findAllEquipment(req.user.companyId, query); }

  @Get('equipment/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get equipment detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findEquipment(id, req.user.companyId); }

  @Patch('equipment/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update equipment' })
  async update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto, @Request() req: any) { return this.svc.updateEquipment(id, dto, req.user.companyId); }

  @Delete('equipment/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete equipment' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteEquipment(id, req.user.companyId); }
}

// ─── Incidents ─────────────────────────────────────────────────────────────

@ApiTags('Emergency - Incidents') @ApiBearerAuth() @Controller('emergency')
export class EmergencyIncidentController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('incidents') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create incident' })
  async create(@Body() dto: CreateIncidentDto, @Request() req: any) { return this.svc.createIncident(dto, req.user.companyId, req.user.id); }

  @Get('incidents') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List incidents' })
  async list(@Query() query: IncidentQueryDto, @Request() req: any) { return this.svc.findAllIncidents(req.user.companyId, query); }

  @Get('incidents/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get incident detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findIncident(id, req.user.companyId); }

  @Patch('incidents/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update incident' })
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto, @Request() req: any) { return this.svc.updateIncident(id, dto, req.user.companyId); }

  @Delete('incidents/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete incident' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteIncident(id, req.user.companyId); }

  @Post('incidents/:id/responses') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Add response to incident' })
  async addResponse(@Param('id') id: string, @Body() dto: CreateResponseDto, @Request() req: any) { return this.svc.createResponse(id, dto, req.user.companyId); }

  @Get('incidents/:id/responses') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List responses for incident' })
  async listResponses(@Param('id') id: string, @Query() query: ResponseQueryDto, @Request() req: any) { return this.svc.findAllResponses(req.user.companyId, id, query); }
}

// ─── Links ─────────────────────────────────────────────────────────────────

@ApiTags('Emergency - Links') @ApiBearerAuth() @Controller('emergency')
export class EmergencyLinkController {
  constructor(private readonly svc: EmergencyService) {}

  @Post('links/:recordId') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Create cross-module link' })
  async create(@Param('recordId') recordId: string, @Body() dto: CreateLinkDto, @Request() req: any) { return this.svc.createLink(recordId, dto, req.user.companyId); }

  @Get('links') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List links' })
  async list(@Query() query: LinkQueryDto, @Request() req: any) { return this.svc.findAllLinks(req.user.companyId, query); }

  @Delete('links/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete link' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }
}
