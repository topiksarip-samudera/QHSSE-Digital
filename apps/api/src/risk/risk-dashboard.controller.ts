import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';

@ApiTags('Risk - Dashboard & KPI') @ApiBearerAuth() @Controller('risks')
export class RiskDashboardController {
  constructor(private readonly svc: RiskService) {}

  @Get('dashboard') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Risk dashboard overview' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Get('heatmap') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Risk heatmap data' })
  async getHeatmap(@Request() req: any) { return this.svc.getHeatmap(req.user.companyId); }

  @Get('export') @RequiredPermissions('risk.export') @ApiOperation({ summary: 'Export risks' })
  async exportRisks(@Request() req: any, @Query('format') format?: string) { return this.svc.exportRisks(req.user.companyId, format || 'csv'); }
}
