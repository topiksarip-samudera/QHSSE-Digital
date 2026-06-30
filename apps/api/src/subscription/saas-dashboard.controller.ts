import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SaasDashboardService } from './saas-dashboard.service';

@ApiTags('SaaS Admin') @ApiBearerAuth() @Controller('saas')
export class SaasDashboardController {
  constructor(private readonly svc: SaasDashboardService) {}
  @Get('dashboard') @RequiredPermissions('saas.view') @ApiOperation({ summary: 'Get SaaS admin dashboard' })
  async getStats(@Request() req: any) { return this.svc.getStats(); }
}
