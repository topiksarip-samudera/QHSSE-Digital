import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalService } from './legal.service';
import { CreateRegulationDto, UpdateRegulationDto, RegulationQueryDto } from './dto/regulation.dto';
import { CreateObligationDto, UpdateObligationDto, CreateEvidenceDto } from './dto/obligation.dto';

@ApiTags('Legal - Regulations') @ApiBearerAuth() @Controller('legal')
export class LegalRegulationController {
  constructor(private readonly svc: LegalService) {}

  @Post('regulations') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create regulation' })
  async createRegulation(@Body() dto: CreateRegulationDto, @Request() req: any) { return this.svc.createRegulation(dto, req.user.companyId, req.user.id); }

  @Get('regulations') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List regulations' })
  async listRegulations(@Query() query: RegulationQueryDto, @Request() req: any) { return this.svc.findAllRegulations(req.user.companyId, query); }

  @Get('regulations/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get regulation detail' })
  async getRegulation(@Param('id') id: string, @Request() req: any) { return this.svc.findRegulation(id, req.user.companyId); }

  @Patch('regulations/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update regulation' })
  async updateRegulation(@Param('id') id: string, @Body() dto: UpdateRegulationDto, @Request() req: any) { return this.svc.updateRegulation(id, dto, req.user.companyId); }

  @Delete('regulations/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete regulation' })
  async deleteRegulation(@Param('id') id: string, @Request() req: any) { return this.svc.deleteRegulation(id, req.user.companyId); }
}

@ApiTags('Legal - Obligations') @ApiBearerAuth() @Controller('legal')
export class LegalObligationController {
  constructor(private readonly svc: LegalService) {}

  @Post('obligations') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create obligation' })
  async createObligation(@Body() dto: CreateObligationDto, @Request() req: any) { return this.svc.createObligation(dto, req.user.companyId, req.user.id); }

  @Get('obligations') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List all obligations' })
  async listObligations(@Query() query: any, @Request() req: any) { return this.svc.findAllObligations(req.user.companyId, query); }

  @Get('obligations/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get obligation detail' })
  async getObligation(@Param('id') id: string, @Request() req: any) { return this.svc.findObligation(id, req.user.companyId); }

  @Patch('obligations/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update obligation' })
  async updateObligation(@Param('id') id: string, @Body() dto: UpdateObligationDto, @Request() req: any) { return this.svc.updateObligation(id, dto, req.user.companyId); }

  @Delete('obligations/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete obligation' })
  async deleteObligation(@Param('id') id: string, @Request() req: any) { return this.svc.deleteObligation(id, req.user.companyId); }

  @Get('regulations/:regulationId/obligations') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List obligations for regulation' })
  async listByRegulation(@Param('regulationId') regulationId: string, @Request() req: any) { return this.svc.findObligationsByRegulation(regulationId, req.user.companyId); }
}

@ApiTags('Legal - Evidence') @ApiBearerAuth() @Controller('legal')
export class LegalEvidenceController {
  constructor(private readonly svc: LegalService) {}

  @Post('evidence') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Add evidence to obligation' })
  async createEvidence(@Body() dto: CreateEvidenceDto, @Request() req: any) { return this.svc.createEvidence(dto, req.user.companyId, req.user.id); }

  @Get('obligations/:obligationId/evidence') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List evidence for obligation' })
  async listEvidence(@Param('obligationId') obligationId: string, @Request() req: any) { return this.svc.findEvidenceByObligation(obligationId, req.user.companyId); }

  @Delete('evidence/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete evidence' })
  async deleteEvidence(@Param('id') id: string, @Request() req: any) { return this.svc.deleteEvidence(id, req.user.companyId); }
}
