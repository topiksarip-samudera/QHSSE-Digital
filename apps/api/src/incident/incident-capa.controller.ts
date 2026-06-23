import { Controller, Get, Post, Param, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { CreateCapaDto, EffectivenessReviewDto } from './dto/capa.dto';

@ApiTags('Incident - CAPA') @ApiBearerAuth() @Controller('incidents')
export class IncidentCapaController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/capa') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get CAPA actions linked to incident' })
  async getCapa(@Param('id') id: string, @Request() req: any) { return this.svc.getCapa(id, req.user.companyId); }

  @Post(':id/capa') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Create corrective/preventive action' })
  async createCapa(@Param('id') id: string, @Body() dto: CreateCapaDto, @Request() req: any) { return this.svc.createCapa(id, dto, req.user.companyId, req.user.id); }

  @Get(':id/capa/effectiveness') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get effectiveness review' })
  async getEffectiveness(@Param('id') id: string, @Request() req: any) { return this.svc.getEffectiveness(id, req.user.companyId); }

  @Post(':id/capa/effectiveness-review') @RequiredPermissions('incident.review') @ApiOperation({ summary: 'Submit effectiveness review' })
  async effectivenessReview(@Param('id') id: string, @Body() dto: EffectivenessReviewDto, @Request() req: any) { return this.svc.createEffectivenessReview(id, dto, req.user.companyId, req.user.id); }
}
