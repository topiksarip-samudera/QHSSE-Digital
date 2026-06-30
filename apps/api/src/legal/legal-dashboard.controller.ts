import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalDashboardService } from './legal-dashboard.service';

@ApiTags('Legal & Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalDashboardController {
  constructor(private readonly svc: LegalDashboardService) {}

  @Get('dashboard') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get legal compliance dashboard' })
  async getStats(@Request() req: any) { return this.svc.getStats(req.user.companyId); }
}
