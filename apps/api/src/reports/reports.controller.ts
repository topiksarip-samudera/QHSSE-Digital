import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ReportsService } from './reports.service';
import { DashboardsService } from './dashboards.service';
import {
  CreateReportTemplateDto, UpdateReportTemplateDto, ReportTemplateQueryDto,
  CreateReportScheduleDto, UpdateReportScheduleDto,
  CreateReportRunDto, ReportRunQueryDto,
  CreateDashboardDto, UpdateDashboardDto, DashboardQueryDto,
  DashboardWidgetDto, DashboardFilterDto,
  UpdateReportSettingDto,
} from './dto/reports.dto';

@ApiTags('Reports & Analytics') @ApiBearerAuth() @Controller()
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
    private readonly dashboards: DashboardsService,
  ) {}

  // ─── Report Templates ─────────────────────────────────────────────────────

  @Post('report-templates') @RequiredPermissions('enterprise-reporting.create')
  @ApiOperation({ summary: 'Create report template' })
  createTemplate(@Body() dto: CreateReportTemplateDto, @Request() req: any) {
    return this.reports.createTemplate(dto, req.user.companyId, req.user.id);
  }

  @Get('report-templates') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'List report templates' })
  getTemplates(@Request() req: any, @Query() query: ReportTemplateQueryDto) {
    return this.reports.getTemplates(req.user.companyId, query);
  }

  @Get('report-templates/:id') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get report template by ID' })
  getTemplate(@Param('id') id: string, @Request() req: any) {
    return this.reports.getTemplate(id, req.user.companyId);
  }

  @Patch('report-templates/:id') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update report template' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateReportTemplateDto, @Request() req: any) {
    return this.reports.updateTemplate(id, dto, req.user.companyId);
  }

  @Delete('report-templates/:id') @RequiredPermissions('enterprise-reporting.delete')
  @ApiOperation({ summary: 'Delete report template' })
  deleteTemplate(@Param('id') id: string, @Request() req: any) {
    return this.reports.deleteTemplate(id, req.user.companyId);
  }

  // ─── Report Runs ──────────────────────────────────────────────────────────

  @Post('reports/:id/run') @RequiredPermissions('enterprise-reporting.view') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run report' })
  runReport(@Param('id') id: string, @Body() dto: CreateReportRunDto, @Request() req: any) {
    return this.reports.runReport(id, dto, req.user.companyId, req.user.id);
  }

  @Get('report-runs') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get report run history' })
  getRunHistory(@Request() req: any, @Query() query: ReportRunQueryDto) {
    return this.reports.getRunHistory(req.user.companyId, query);
  }

  @Get('report-runs/:id') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get report run detail' })
  getRun(@Param('id') id: string, @Request() req: any) {
    return this.reports.getRun(id, req.user.companyId);
  }

  // ─── Report Schedules ─────────────────────────────────────────────────────

  @Post('report-schedules') @RequiredPermissions('enterprise-reporting.create')
  @ApiOperation({ summary: 'Create report schedule' })
  createSchedule(@Body() dto: CreateReportScheduleDto, @Request() req: any) {
    return this.reports.createSchedule(dto, req.user.companyId, req.user.id);
  }

  @Get('report-schedules') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'List report schedules' })
  getSchedules(@Request() req: any, @Query('templateId') templateId?: string) {
    return this.reports.getSchedules(req.user.companyId, templateId);
  }

  @Get('report-schedules/:id') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get schedule detail' })
  getSchedule(@Param('id') id: string, @Request() req: any) {
    return this.reports.getSchedule(id, req.user.companyId);
  }

  @Patch('report-schedules/:id') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update schedule' })
  updateSchedule(@Param('id') id: string, @Body() dto: UpdateReportScheduleDto, @Request() req: any) {
    return this.reports.updateSchedule(id, dto, req.user.companyId);
  }

  @Delete('report-schedules/:id') @RequiredPermissions('enterprise-reporting.delete')
  @ApiOperation({ summary: 'Delete schedule' })
  deleteSchedule(@Param('id') id: string, @Request() req: any) {
    return this.reports.deleteSchedule(id, req.user.companyId);
  }

  // ─── Report Settings ──────────────────────────────────────────────────────

  @Get('report-settings') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get report settings' })
  getSettings(@Request() req: any) {
    return this.reports.getSettings(req.user.companyId);
  }

  @Patch('report-settings') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update report settings' })
  updateSettings(@Body() dto: UpdateReportSettingDto, @Request() req: any) {
    return this.reports.updateSettings(req.user.companyId, dto);
  }

  // ─── Global Dashboards ────────────────────────────────────────────────────

  @Post('report-dashboards') @RequiredPermissions('enterprise-reporting.create')
  @ApiOperation({ summary: 'Create dashboard' })
  createDashboard(@Body() dto: CreateDashboardDto, @Request() req: any) {
    return this.dashboards.createDashboard(dto, req.user.companyId, req.user.id);
  }

  @Get('report-dashboards') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'List dashboards' })
  getDashboards(@Request() req: any, @Query() query: DashboardQueryDto) {
    return this.dashboards.getDashboards(req.user.companyId, query);
  }

  @Get('report-dashboards/:id') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get dashboard detail' })
  getDashboard(@Param('id') id: string, @Request() req: any) {
    return this.dashboards.getDashboard(id, req.user.companyId);
  }

  @Patch('report-dashboards/:id') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update dashboard' })
  updateDashboard(@Param('id') id: string, @Body() dto: UpdateDashboardDto, @Request() req: any) {
    return this.dashboards.updateDashboard(id, dto, req.user.companyId);
  }

  @Delete('report-dashboards/:id') @RequiredPermissions('enterprise-reporting.delete')
  @ApiOperation({ summary: 'Delete dashboard' })
  deleteDashboard(@Param('id') id: string, @Request() req: any) {
    return this.dashboards.deleteDashboard(id, req.user.companyId);
  }

  // ─── Dashboard Widgets ────────────────────────────────────────────────────

  @Post('report-dashboards/:dashboardId/widgets') @RequiredPermissions('enterprise-reporting.create')
  @ApiOperation({ summary: 'Add widget to dashboard' })
  addWidget(@Param('dashboardId') dashboardId: string, @Body() dto: DashboardWidgetDto, @Request() req: any) {
    return this.dashboards.addWidget(dashboardId, dto, req.user.companyId);
  }

  @Patch('report-dashboards/:dashboardId/widgets/:widgetId') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update widget' })
  updateWidget(@Param('dashboardId') dashboardId: string, @Param('widgetId') widgetId: string, @Body() data: any, @Request() req: any) {
    return this.dashboards.updateWidget(dashboardId, widgetId, data, req.user.companyId);
  }

  @Delete('report-dashboards/:dashboardId/widgets/:widgetId') @RequiredPermissions('enterprise-reporting.delete')
  @ApiOperation({ summary: 'Delete widget' })
  deleteWidget(@Param('dashboardId') dashboardId: string, @Param('widgetId') widgetId: string, @Request() req: any) {
    return this.dashboards.deleteWidget(dashboardId, widgetId, req.user.companyId);
  }

  // ─── Dashboard Filters ────────────────────────────────────────────────────

  @Post('report-dashboards/:dashboardId/filters') @RequiredPermissions('enterprise-reporting.create')
  @ApiOperation({ summary: 'Add filter to dashboard' })
  addFilter(@Param('dashboardId') dashboardId: string, @Body() dto: DashboardFilterDto, @Request() req: any) {
    return this.dashboards.addFilter(dashboardId, dto, req.user.companyId);
  }

  @Patch('report-dashboards/:dashboardId/filters/:filterId') @RequiredPermissions('enterprise-reporting.update')
  @ApiOperation({ summary: 'Update filter' })
  updateFilter(@Param('dashboardId') dashboardId: string, @Param('filterId') filterId: string, @Body() data: any, @Request() req: any) {
    return this.dashboards.updateFilter(dashboardId, filterId, data, req.user.companyId);
  }

  @Delete('report-dashboards/:dashboardId/filters/:filterId') @RequiredPermissions('enterprise-reporting.delete')
  @ApiOperation({ summary: 'Delete filter' })
  deleteFilter(@Param('dashboardId') dashboardId: string, @Param('filterId') filterId: string, @Request() req: any) {
    return this.dashboards.deleteFilter(dashboardId, filterId, req.user.companyId);
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  @Get('analytics/executive') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get executive QHSSE dashboard data' })
  getExecutiveDashboard(@Request() req: any) {
    return this.dashboards.getExecutiveDashboard(req.user.companyId);
  }

  @Get('analytics/:module') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get module analytics' })
  getAnalyticsForModule(@Param('module') module: string, @Request() req: any) {
    return this.dashboards.getAnalyticsForModule(req.user.companyId, module);
  }

  @Get('report-kpis') @RequiredPermissions('enterprise-reporting.view')
  @ApiOperation({ summary: 'Get KPI definitions and values' })
  getKpis(@Request() req: any) {
    return this.dashboards.getKpis(req.user.companyId);
  }
}
