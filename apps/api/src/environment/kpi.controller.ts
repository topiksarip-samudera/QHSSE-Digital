import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentKpiService } from './kpi.service';

@ApiTags('Environment Management') @ApiBearerAuth() @Controller('environment')
export class EnvironmentKpiController {
  constructor(private readonly svc: EnvironmentKpiService) {}

  @Get('dashboard') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get environment dashboard KPIs' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }
}
