import { Controller, Get, Post, Patch, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { CreateEscalationRuleDto, CreateLessonsLearnedDto } from './dto/lessons.dto';

@ApiTags('Incident - Escalation & Lessons') @ApiBearerAuth() @Controller('incident')
export class IncidentLessonsController {
  constructor(private readonly svc: IncidentService) {}

  @Get('escalation-rules') @RequiredPermissions('incident.manage_settings') @ApiOperation({ summary: 'Get escalation rules' })
  async getRules(@Request() req: any) { return this.svc.getEscalationRules(req.user.companyId); }
  @Post('escalation-rules') @RequiredPermissions('incident.manage_settings') @ApiOperation({ summary: 'Create escalation rule' })
  async createRule(@Body() dto: CreateEscalationRuleDto, @Request() req: any) { return this.svc.createEscalationRule(dto, req.user.companyId); }
  @Delete('escalation-rules/:id') @RequiredPermissions('incident.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete rule' })
  async deleteRule(@Param('id') id: string) { return this.svc.deleteEscalationRule(id); }

  @Get('incidents/:id/lessons-learned') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get lessons learned' })
  async getLessons(@Param('id') id: string, @Request() req: any) { return this.svc.getLessonsLearned(id, req.user.companyId); }
  @Post('incidents/:id/lessons-learned') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Create/update lessons learned' })
  async createLessons(@Param('id') id: string, @Body() dto: CreateLessonsLearnedDto, @Request() req: any) { return this.svc.createLessonsLearned(id, dto, req.user.companyId, req.user.id); }
  @Post('incidents/:id/lessons-learned/publish') @RequiredPermissions('incident.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Publish lessons learned' })
  async publishLessons(@Param('id') id: string, @Request() req: any) { return this.svc.publishLessonsLearned(id, req.user.companyId, req.user.id); }
  @Post('incidents/:id/lessons-learned/acknowledge') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Acknowledge lessons learned' })
  async acknowledge(@Param('id') id: string, @Request() req: any) { return this.svc.acknowledgeLessonsLearned(id, req.user.companyId, req.user.id); }
}
