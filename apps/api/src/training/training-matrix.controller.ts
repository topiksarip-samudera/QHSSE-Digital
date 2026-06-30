import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TrainingMatrixService } from './training-matrix.service';
import { CreateTrainingMatrixDto, UpdateTrainingMatrixDto, CreateTrainingPlanDto, UpdateTrainingPlanDto, CreateTrainingSessionDto, UpdateTrainingSessionDto, CreateTrainingAttendanceDto, UpdateTrainingAttendanceDto } from './dto/training.dto';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class TrainingMatrixController {
  constructor(private readonly svc: TrainingMatrixService) {}

  // ─── Matrices ───────────────────────────────────────────────────────────

  @Get('matrices') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training matrices' })
  async getMatrices(@Request() req: any, @Query('type') type?: string) { return this.svc.findAllMatrices(req.user.companyId, { type }); }

  @Get('matrices/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training matrix by ID' })
  async getMatrix(@Param('id') id: string, @Request() req: any) { return this.svc.findMatrixById(id, req.user.companyId); }

  @Post('matrices') @RequiredPermissions('training.manage_matrix') @ApiOperation({ summary: 'Create training matrix' })
  async createMatrix(@Body() dto: CreateTrainingMatrixDto, @Request() req: any) { return this.svc.createMatrix(req.user.companyId, req.user.sub, dto); }

  @Patch('matrices/:id') @RequiredPermissions('training.manage_matrix') @ApiOperation({ summary: 'Update training matrix' })
  async updateMatrix(@Param('id') id: string, @Body() dto: UpdateTrainingMatrixDto, @Request() req: any) { return this.svc.updateMatrix(id, req.user.companyId, req.user.sub, dto); }

  @Delete('matrices/:id') @RequiredPermissions('training.manage_matrix') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete training matrix' })
  async deleteMatrix(@Param('id') id: string, @Request() req: any) { return this.svc.deleteMatrix(id, req.user.companyId); }

  // ─── Plans ──────────────────────────────────────────────────────────────

  @Get('plans') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training plans' })
  async getPlans(@Request() req: any, @Query('status') status?: string) { return this.svc.findAllPlans(req.user.companyId, { status }); }

  @Get('plans/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training plan by ID' })
  async getPlan(@Param('id') id: string, @Request() req: any) { return this.svc.findPlanById(id, req.user.companyId); }

  @Post('plans') @RequiredPermissions('training.manage_plan') @ApiOperation({ summary: 'Create training plan' })
  async createPlan(@Body() dto: CreateTrainingPlanDto, @Request() req: any) { return this.svc.createPlan(req.user.companyId, req.user.sub, dto); }

  @Patch('plans/:id') @RequiredPermissions('training.manage_plan') @ApiOperation({ summary: 'Update training plan' })
  async updatePlan(@Param('id') id: string, @Body() dto: UpdateTrainingPlanDto, @Request() req: any) { return this.svc.updatePlan(id, req.user.companyId, req.user.sub, dto); }

  @Delete('plans/:id') @RequiredPermissions('training.manage_plan') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete training plan' })
  async deletePlan(@Param('id') id: string, @Request() req: any) { return this.svc.deletePlan(id, req.user.companyId); }

  // ─── Sessions ───────────────────────────────────────────────────────────

  @Get('sessions') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training sessions' })
  async getSessions(@Request() req: any, @Query('planId') planId?: string, @Query('status') status?: string) { return this.svc.findAllSessions(req.user.companyId, { planId, status }); }

  @Get('sessions/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training session by ID' })
  async getSession(@Param('id') id: string, @Request() req: any) { return this.svc.findSessionById(id, req.user.companyId); }

  @Post('sessions') @RequiredPermissions('training.manage_session') @ApiOperation({ summary: 'Create training session' })
  async createSession(@Body() dto: CreateTrainingSessionDto, @Request() req: any) { return this.svc.createSession(req.user.companyId, req.user.sub, dto); }

  @Patch('sessions/:id') @RequiredPermissions('training.manage_session') @ApiOperation({ summary: 'Update training session' })
  async updateSession(@Param('id') id: string, @Body() dto: UpdateTrainingSessionDto, @Request() req: any) { return this.svc.updateSession(id, req.user.companyId, dto); }

  @Post('sessions/:id/close') @RequiredPermissions('training.manage_session') @ApiOperation({ summary: 'Close training session' })
  async closeSession(@Param('id') id: string, @Request() req: any) { return this.svc.closeSession(id, req.user.companyId); }

  @Delete('sessions/:id') @RequiredPermissions('training.manage_session') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete training session' })
  async deleteSession(@Param('id') id: string, @Request() req: any) { return this.svc.deleteSession(id, req.user.companyId); }

  // ─── Attendances ────────────────────────────────────────────────────────

  @Get('attendances') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training attendances' })
  async getAttendances(@Request() req: any, @Query('sessionId') sessionId?: string, @Query('userId') userId?: string) { return this.svc.findAllAttendances(req.user.companyId, { sessionId, userId }); }

  @Post('attendances') @RequiredPermissions('training.manage_attendance') @ApiOperation({ summary: 'Create training attendance' })
  async createAttendance(@Body() dto: CreateTrainingAttendanceDto, @Request() req: any) { return this.svc.createAttendance(req.user.companyId, dto); }

  @Patch('attendances/:id') @RequiredPermissions('training.manage_attendance') @ApiOperation({ summary: 'Update training attendance' })
  async updateAttendance(@Param('id') id: string, @Body() dto: UpdateTrainingAttendanceDto, @Request() req: any) { return this.svc.updateAttendance(id, req.user.companyId, dto); }
}
