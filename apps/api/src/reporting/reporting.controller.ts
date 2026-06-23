import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ReportingService } from './reporting.service';
import { CreateReportTemplateDto, CreateScheduledReportDto } from './dto/reporting.dto';

@ApiTags('Enterprise Reporting') @ApiBearerAuth() @Controller()
export class ReportingController {
  constructor(private readonly svc: ReportingService) {}

  @Post('report-templates') @RequiredPermissions('enterprise-reporting.create') @ApiOperation({ summary: 'Create report template' })
  async createTemplate(@Body() dto: CreateReportTemplateDto, @Request() req: any) { return this.svc.createTemplate(dto, req.user.companyId, req.user.id); }
  @Get('report-templates') @RequiredPermissions('enterprise-reporting.view') @ApiOperation({ summary: 'List report templates' })
  async getTemplates(@Request() req: any, @Query('type') type?: string) { return this.svc.getTemplates(req.user.companyId, type); }
  @Patch('report-templates/:id') @RequiredPermissions('enterprise-reporting.update') @ApiOperation({ summary: 'Update template' })
  async updateTemplate(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateTemplate(id, d, req.user.companyId); }
  @Delete('report-templates/:id') @RequiredPermissions('enterprise-reporting.delete') @ApiOperation({ summary: 'Delete template' })
  async deleteTemplate(@Param('id') id: string) { return this.svc.deleteTemplate(id); }
  @Post('reports/:id/run') @RequiredPermissions('enterprise-reporting.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Run report' })
  async runReport(@Param('id') id: string, @Request() req: any) { return this.svc.runReport(id, req.user.companyId, req.user.id); }
  @Get('report-runs') @RequiredPermissions('enterprise-reporting.view') @ApiOperation({ summary: 'Get report run history' })
  async getRunHistory(@Request() req: any, @Query('templateId') templateId?: string) { return this.svc.getRunHistory(req.user.companyId, templateId); }

  @Post('scheduled-reports') @RequiredPermissions('enterprise-reporting.create') @ApiOperation({ summary: 'Create scheduled report' })
  async createScheduledReport(@Body() dto: CreateScheduledReportDto, @Request() req: any) { return this.svc.createScheduledReport(dto, req.user.companyId, req.user.id); }
  @Get('scheduled-reports') @RequiredPermissions('enterprise-reporting.view') @ApiOperation({ summary: 'List scheduled reports' })
  async getScheduledReports(@Request() req: any) { return this.svc.getScheduledReports(req.user.companyId); }
  @Delete('scheduled-reports/:id') @RequiredPermissions('enterprise-reporting.delete') @ApiOperation({ summary: 'Delete schedule' })
  async deleteSchedule(@Param('id') id: string) { return this.svc.deleteSchedule(id); }
}
