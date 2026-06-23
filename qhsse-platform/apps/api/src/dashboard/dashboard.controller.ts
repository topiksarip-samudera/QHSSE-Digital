import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('personal')
  @RequiredPermissions('dashboard-basic.view')
  @ApiOperation({ summary: 'Get personal dashboard data' })
  async getPersonal(@Request() req: any) {
    return this.dashboardService.getPersonalDashboard(req.user.id, req.user.companyId);
  }

  @Get('admin')
  @RequiredPermissions('dashboard-basic.view')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  async getAdmin(@Request() req: any) {
    return this.dashboardService.getAdminDashboard(req.user.companyId);
  }

  @Get('qhsse')
  @RequiredPermissions('dashboard-basic.view')
  @ApiOperation({ summary: 'Get QHSSE-specific dashboard' })
  async getQHSSE(@Request() req: any) {
    return this.dashboardService.getQHSSEDashboard(req.user.companyId);
  }
}
