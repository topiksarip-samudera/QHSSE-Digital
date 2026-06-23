import { Controller, Get, Patch, Post, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { UpdateRcaDto, Add5WhyDto, AddFishboneDto, AddFactorDto, ReviewRcaDto } from './dto/rca.dto';

@ApiTags('Incident - RCA') @ApiBearerAuth() @Controller('incidents')
export class IncidentRcaController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/rca') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get RCA data' })
  async getRca(@Param('id') id: string, @Request() req: any) { return this.svc.getRca(id, req.user.companyId); }

  @Patch(':id/rca') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Update root cause' })
  async updateRca(@Param('id') id: string, @Body() dto: UpdateRcaDto, @Request() req: any) { return this.svc.updateRca(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/rca/5why') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add 5-Why entry' })
  async add5Why(@Param('id') id: string, @Body() dto: Add5WhyDto, @Request() req: any) { return this.svc.add5Why(id, dto, req.user.companyId); }

  @Post(':id/rca/fishbone') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add Fishbone entry' })
  async addFishbone(@Param('id') id: string, @Body() dto: AddFishboneDto, @Request() req: any) { return this.svc.addFishbone(id, dto, req.user.companyId); }

  @Post(':id/rca/factors') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Add cause factor' })
  async addFactor(@Param('id') id: string, @Body() dto: AddFactorDto, @Request() req: any) { return this.svc.addFactor(id, dto, req.user.companyId); }

  @Post(':id/rca/submit') @RequiredPermissions('incident.investigate') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit RCA → CAPA in progress' })
  async submitRca(@Param('id') id: string, @Request() req: any) { return this.svc.submitRca(id, req.user.companyId, req.user.id); }

  @Post(':id/rca/review') @RequiredPermissions('incident.review') @ApiOperation({ summary: 'Review RCA' })
  async reviewRca(@Param('id') id: string, @Body() dto: ReviewRcaDto, @Request() req: any) { return this.svc.reviewRca(id, dto, req.user.companyId, req.user.id); }
}
