import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SecurityDashboardService } from './security-dashboard.service';

@ApiTags('Security Management') @ApiBearerAuth() @Controller('security')
export class SecurityDashboardController {
  constructor(private readonly svc: SecurityDashboardService) {}
  @Get('dashboard') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get security dashboard stats' })
  async getStats(@Request() req: any) { return this.svc.getStats(req.user.companyId); }
}
