import { Controller, Get, Post, Patch, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { UpdateInvestigationDto, AddTeamMemberDto, AddChronologyDto, AddInterviewDto, AddBarrierDto, AddFindingDto } from './dto/investigation.dto';

@ApiTags('Incident - Investigation') @ApiBearerAuth() @Controller('incidents')
export class IncidentInvestigationController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/investigation') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get investigation detail' })
  async getInvestigation(@Param('id') id: string, @Request() req: any) { return this.svc.getInvestigation(id, req.user.companyId); }

  @Post(':id/investigation/start') @RequiredPermissions('incident.investigate') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Start investigation' })
  async start(@Param('id') id: string, @Request() req: any) { return this.svc.startInvestigation(id, req.user.companyId, req.user.id); }

  @Patch(':id/investigation') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Update investigation' })
  async update(@Param('id') id: string, @Body() dto: UpdateInvestigationDto, @Request() req: any) { return this.svc.updateInvestigation(id, dto, req.user.companyId); }

  @Post(':id/investigation/team') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add team member' })
  async addTeam(@Param('id') id: string, @Body() dto: AddTeamMemberDto, @Request() req: any) { return this.svc.addTeamMember(id, dto, req.user.companyId); }

  @Post(':id/investigation/chronology') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add chronology event' })
  async addChronology(@Param('id') id: string, @Body() dto: AddChronologyDto, @Request() req: any) { return this.svc.addChronology(id, dto, req.user.companyId); }

  @Post(':id/investigation/interviews') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add interview record' })
  async addInterview(@Param('id') id: string, @Body() dto: AddInterviewDto, @Request() req: any) { return this.svc.addInterview(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/investigation/barriers') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add failed barrier' })
  async addBarrier(@Param('id') id: string, @Body() dto: AddBarrierDto, @Request() req: any) { return this.svc.addBarrier(id, dto, req.user.companyId); }

  @Post(':id/investigation/findings') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add finding' })
  async addFinding(@Param('id') id: string, @Body() dto: AddFindingDto, @Request() req: any) { return this.svc.addFinding(id, dto, req.user.companyId); }

  @Post(':id/investigation/submit') @RequiredPermissions('incident.investigate') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit investigation → RCA completed' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submitInvestigation(id, req.user.companyId, req.user.id); }
}
