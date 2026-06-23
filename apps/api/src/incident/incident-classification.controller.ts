import { Controller, Get, Patch, Post, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { ClassifyIncidentDto } from './dto/classify-incident.dto';

@ApiTags('Incident Classification') @ApiBearerAuth() @Controller('incidents')
export class IncidentClassificationController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/classification') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident classification' })
  async getClassification(@Param('id') id: string, @Request() req: any) { return this.svc.getClassification(id, req.user.companyId); }

  @Patch(':id/classification') @RequiredPermissions('incident.classify') @ApiOperation({ summary: 'Classify incident' })
  async classify(@Param('id') id: string, @Body() dto: ClassifyIncidentDto, @Request() req: any) { return this.svc.classify(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/classification/review') @RequiredPermissions('incident.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Review classification' })
  async reviewClassification(@Param('id') id: string, @Request() req: any) { return this.svc.reviewClassification(id, req.user.companyId, req.user.id); }

  @Get(':id/related-incidents') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get related/repeat incidents' })
  async getRelated(@Param('id') id: string, @Request() req: any) { return this.svc.getRelatedIncidents(id, req.user.companyId); }
}
