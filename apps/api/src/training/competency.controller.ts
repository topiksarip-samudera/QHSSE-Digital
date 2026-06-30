import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { CompetencyService } from './competency.service';
import { CreateCompetencyMatrixDto, UpdateCompetencyMatrixDto, CreateCompetencyAssessmentDto, UpdateCompetencyAssessmentDto } from './dto/training.dto';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class CompetencyController {
  constructor(private readonly svc: CompetencyService) {}

  // ─── Competency Matrices ────────────────────────────────────────────────

  @Get('competency-matrices') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List competency matrices' })
  async getMatrices(@Request() req: any, @Query('positionId') positionId?: string) { return this.svc.findAllMatrices(req.user.companyId, { positionId }); }

  @Get('competency-matrices/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get competency matrix by ID' })
  async getMatrix(@Param('id') id: string, @Request() req: any) { return this.svc.findMatrixById(id, req.user.companyId); }

  @Post('competency-matrices') @RequiredPermissions('training.manage_competency') @ApiOperation({ summary: 'Create competency matrix' })
  async createMatrix(@Body() dto: CreateCompetencyMatrixDto, @Request() req: any) { return this.svc.createMatrix(req.user.companyId, req.user.sub, dto); }

  @Patch('competency-matrices/:id') @RequiredPermissions('training.manage_competency') @ApiOperation({ summary: 'Update competency matrix' })
  async updateMatrix(@Param('id') id: string, @Body() dto: UpdateCompetencyMatrixDto, @Request() req: any) { return this.svc.updateMatrix(id, req.user.companyId, dto); }

  @Delete('competency-matrices/:id') @RequiredPermissions('training.manage_competency') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete competency matrix' })
  async deleteMatrix(@Param('id') id: string, @Request() req: any) { return this.svc.deleteMatrix(id, req.user.companyId); }

  // ─── Competency Assessments ─────────────────────────────────────────────

  @Get('competency-assessments') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List competency assessments' })
  async getAssessments(@Request() req: any, @Query('userId') userId?: string, @Query('result') result?: string) { return this.svc.findAllAssessments(req.user.companyId, { userId, result }); }

  @Get('competency-assessments/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get competency assessment by ID' })
  async getAssessment(@Param('id') id: string, @Request() req: any) { return this.svc.findAssessmentById(id, req.user.companyId); }

  @Post('competency-assessments') @RequiredPermissions('training.manage_assessment') @ApiOperation({ summary: 'Create competency assessment' })
  async createAssessment(@Body() dto: CreateCompetencyAssessmentDto, @Request() req: any) { return this.svc.createAssessment(req.user.companyId, req.user.sub, dto); }

  @Patch('competency-assessments/:id') @RequiredPermissions('training.manage_assessment') @ApiOperation({ summary: 'Update competency assessment' })
  async updateAssessment(@Param('id') id: string, @Body() dto: UpdateCompetencyAssessmentDto, @Request() req: any) { return this.svc.updateAssessment(id, req.user.companyId, dto); }

  @Delete('competency-assessments/:id') @RequiredPermissions('training.manage_assessment') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete competency assessment' })
  async deleteAssessment(@Param('id') id: string, @Request() req: any) { return this.svc.deleteAssessment(id, req.user.companyId); }
}
