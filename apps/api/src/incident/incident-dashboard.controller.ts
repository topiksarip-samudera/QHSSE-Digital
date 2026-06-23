import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';

@ApiTags('Incident - Dashboard & KPI') @ApiBearerAuth() @Controller('incidents')
export class IncidentDashboardController {
  constructor(private readonly svc: IncidentService) {}

  @Get('dashboard') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident dashboard' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Get('kpi') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident KPIs' })
  async getKpi(@Request() req: any, @Query('year') year?: string) { return this.svc.getKpi(req.user.companyId, year ? Number(year) : undefined); }

  @Get('trends') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get 12-month incident trend' })
  async getTrends(@Request() req: any) { return this.svc.getTrends(req.user.companyId); }

  @Get('export') @RequiredPermissions('incident.export') @ApiOperation({ summary: 'Export incidents' })
  async export(@Request() req: any, @Query('format') format?: string) { return this.svc.exportIncidents(req.user.companyId, format || 'csv'); }
}
