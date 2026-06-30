import { Controller, Get, Post, Patch, Param, Body, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalAssessmentService } from './legal-assessment.service';
import { CreateAssessmentDto, CreateGapAnalysisDto, UpdateGapDto } from './dto/assessment.dto';

@ApiTags('Legal - Assessments') @ApiBearerAuth() @Controller('legal')
export class LegalAssessmentController {
  constructor(private readonly svc: LegalAssessmentService) {}

  @Post('assessments') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create compliance assessment' })
  async createAssessment(@Body() dto: CreateAssessmentDto, @Request() req: any) { return this.svc.createAssessment(dto, req.user.companyId, req.user.id); }

  @Get('assessments') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List assessments' })
  async listAssessments(@Query() query: any, @Request() req: any) { return this.svc.findAllAssessments(req.user.companyId, query); }

  @Get('assessments/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get assessment detail' })
  async getAssessment(@Param('id') id: string, @Request() req: any) { return this.svc.findAssessment(id, req.user.companyId); }

  @Get('score') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get compliance score' })
  async getScore(@Request() req: any) { return this.svc.getScore(req.user.companyId); }
}

@ApiTags('Legal - Gaps') @ApiBearerAuth() @Controller('legal')
export class LegalGapController {
  constructor(private readonly svc: LegalAssessmentService) {}

  @Post('gaps') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create gap analysis' })
  async createGap(@Body() dto: CreateGapAnalysisDto, @Request() req: any) { return this.svc.createGap(dto, req.user.companyId, req.user.id); }

  @Get('gaps') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List gap analyses' })
  async listGaps(@Query() query: any, @Request() req: any) { return this.svc.findAllGaps(req.user.companyId, query); }

  @Get('gaps/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get gap detail' })
  async getGap(@Param('id') id: string, @Request() req: any) { return this.svc.findGap(id, req.user.companyId); }

  @Patch('gaps/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update gap' })
  async updateGap(@Param('id') id: string, @Body() dto: UpdateGapDto, @Request() req: any) { return this.svc.updateGap(id, dto, req.user.companyId); }
}
