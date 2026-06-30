import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TrainingNeedService } from './training-need.service';
import { TrainingService } from './training.service';
import { CreateTrainingNeedDto, UpdateTrainingNeedDto, CreateInductionDto, UpdateInductionDto, CreateToolboxMeetingDto, UpdateToolboxMeetingDto, CreateToolboxAttendanceDto, CreateCertificateDto, UpdateCertificateDto, RenewCertificateDto, CreateTrainingLinkDto } from './dto/training.dto';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class TrainingNeedController {
  constructor(private readonly svc: TrainingNeedService, private readonly linkSvc: TrainingService) {}

  // ─── Training Needs ─────────────────────────────────────────────────────

  @Get('needs') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training needs' })
  async getNeeds(@Request() req: any, @Query('userId') userId?: string, @Query('status') status?: string, @Query('priority') priority?: string) { return this.svc.findAllNeeds(req.user.companyId, { userId, status, priority }); }

  @Get('needs/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training need by ID' })
  async getNeed(@Param('id') id: string, @Request() req: any) { return this.svc.findNeedById(id, req.user.companyId); }

  @Post('needs') @RequiredPermissions('training.manage_need') @ApiOperation({ summary: 'Create training need' })
  async createNeed(@Body() dto: CreateTrainingNeedDto, @Request() req: any) { return this.svc.createNeed(req.user.companyId, req.user.sub, dto); }

  @Patch('needs/:id') @RequiredPermissions('training.manage_need') @ApiOperation({ summary: 'Update training need' })
  async updateNeed(@Param('id') id: string, @Body() dto: UpdateTrainingNeedDto, @Request() req: any) { return this.svc.updateNeed(id, req.user.companyId, dto); }

  @Post('needs/:id/waive') @RequiredPermissions('training.manage_need') @ApiOperation({ summary: 'Waive training need' })
  async waiveNeed(@Param('id') id: string, @Request() req: any) { return this.svc.waiveNeed(id, req.user.companyId, req.user.sub); }

  @Delete('needs/:id') @RequiredPermissions('training.manage_need') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete training need' })
  async deleteNeed(@Param('id') id: string, @Request() req: any) { return this.svc.deleteNeed(id, req.user.companyId); }

  // ─── Inductions ─────────────────────────────────────────────────────────

  @Get('inductions') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List induction records' })
  async getInductions(@Request() req: any, @Query('userId') userId?: string, @Query('inductionType') inductionType?: string, @Query('status') status?: string) { return this.svc.findAllInductions(req.user.companyId, { userId, inductionType, status }); }

  @Get('inductions/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get induction record by ID' })
  async getInduction(@Param('id') id: string, @Request() req: any) { return this.svc.findInductionById(id, req.user.companyId); }

  @Post('inductions') @RequiredPermissions('training.manage_induction') @ApiOperation({ summary: 'Create induction record' })
  async createInduction(@Body() dto: CreateInductionDto, @Request() req: any) { return this.svc.createInduction(req.user.companyId, req.user.sub, dto); }

  @Patch('inductions/:id') @RequiredPermissions('training.manage_induction') @ApiOperation({ summary: 'Update induction record' })
  async updateInduction(@Param('id') id: string, @Body() dto: UpdateInductionDto, @Request() req: any) { return this.svc.updateInduction(id, req.user.companyId, dto); }

  @Delete('inductions/:id') @RequiredPermissions('training.manage_induction') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete induction record' })
  async deleteInduction(@Param('id') id: string, @Request() req: any) { return this.svc.deleteInduction(id, req.user.companyId); }

  // ─── Toolbox Meetings ───────────────────────────────────────────────────

  @Get('toolbox') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List toolbox meetings' })
  async getToolboxMeetings(@Request() req: any, @Query('date') date?: string) { return this.svc.findAllToolboxMeetings(req.user.companyId, { date }); }

  @Get('toolbox/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get toolbox meeting by ID' })
  async getToolboxMeeting(@Param('id') id: string, @Request() req: any) { return this.svc.findToolboxMeetingById(id, req.user.companyId); }

  @Post('toolbox') @RequiredPermissions('training.manage_toolbox') @ApiOperation({ summary: 'Create toolbox meeting' })
  async createToolboxMeeting(@Body() dto: CreateToolboxMeetingDto, @Request() req: any) { return this.svc.createToolboxMeeting(req.user.companyId, req.user.sub, dto); }

  @Patch('toolbox/:id') @RequiredPermissions('training.manage_toolbox') @ApiOperation({ summary: 'Update toolbox meeting' })
  async updateToolboxMeeting(@Param('id') id: string, @Body() dto: UpdateToolboxMeetingDto, @Request() req: any) { return this.svc.updateToolboxMeeting(id, req.user.companyId, dto); }

  @Delete('toolbox/:id') @RequiredPermissions('training.manage_toolbox') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete toolbox meeting' })
  async deleteToolboxMeeting(@Param('id') id: string, @Request() req: any) { return this.svc.deleteToolboxMeeting(id, req.user.companyId); }

  // ─── Toolbox Attendances ────────────────────────────────────────────────

  @Get('toolbox-attendances') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List toolbox attendances' })
  async getToolboxAttendances(@Request() req: any, @Query('meetingId') meetingId?: string, @Query('userId') userId?: string) { return this.svc.findAllToolboxAttendances(req.user.companyId, { meetingId, userId }); }

  @Post('toolbox-attendances') @RequiredPermissions('training.manage_toolbox') @ApiOperation({ summary: 'Create toolbox attendance' })
  async createToolboxAttendance(@Body() dto: CreateToolboxAttendanceDto, @Request() req: any) { return this.svc.createToolboxAttendance(req.user.companyId, dto); }

  // ─── Certificates ───────────────────────────────────────────────────────

  @Get('certificates') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List certificates' })
  async getCertificates(@Request() req: any, @Query('userId') userId?: string, @Query('status') status?: string) { return this.svc.findAllCertificates(req.user.companyId, { userId, status }); }

  @Get('certificates/:id') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get certificate by ID' })
  async getCertificate(@Param('id') id: string, @Request() req: any) { return this.svc.findCertificateById(id, req.user.companyId); }

  @Post('certificates') @RequiredPermissions('training.manage_certificate') @ApiOperation({ summary: 'Create certificate' })
  async createCertificate(@Body() dto: CreateCertificateDto, @Request() req: any) { return this.svc.createCertificate(req.user.companyId, req.user.sub, dto); }

  @Patch('certificates/:id') @RequiredPermissions('training.manage_certificate') @ApiOperation({ summary: 'Update certificate' })
  async updateCertificate(@Param('id') id: string, @Body() dto: UpdateCertificateDto, @Request() req: any) { return this.svc.updateCertificate(id, req.user.companyId, dto); }

  @Post('certificates/:id/renew') @RequiredPermissions('training.manage_certificate') @ApiOperation({ summary: 'Renew certificate' })
  async renewCertificate(@Param('id') id: string, @Body() dto: RenewCertificateDto, @Request() req: any) { return this.svc.renewCertificate(id, req.user.companyId, dto); }

  @Post('certificates/:id/revoke') @RequiredPermissions('training.manage_certificate') @ApiOperation({ summary: 'Revoke certificate' })
  async revokeCertificate(@Param('id') id: string, @Request() req: any) { return this.svc.revokeCertificate(id, req.user.companyId); }

  @Delete('certificates/:id') @RequiredPermissions('training.manage_certificate') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete certificate' })
  async deleteCertificate(@Param('id') id: string, @Request() req: any) { return this.svc.deleteCertificate(id, req.user.companyId); }

  // ─── Training Links (cross-module) ──────────────────────────────────────

  @Get('links') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List training links' })
  async getLinks(@Request() req: any, @Query('trainingId') trainingId?: string, @Query('linkedModule') linkedModule?: string) { return this.linkSvc.findAllLinks(req.user.companyId, { trainingId, linkedModule }); }

  @Post('links') @RequiredPermissions('training.manage_link') @ApiOperation({ summary: 'Create training link' })
  async createLink(@Body() dto: CreateTrainingLinkDto, @Request() req: any) { return this.linkSvc.createLink(req.user.companyId, req.user.sub, dto); }

  @Delete('links/:id') @RequiredPermissions('training.manage_link') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete training link' })
  async deleteLink(@Param('id') id: string, @Request() req: any) { return this.linkSvc.deleteLink(id, req.user.companyId); }
}
