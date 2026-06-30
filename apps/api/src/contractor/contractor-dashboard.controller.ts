import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ContractorDashboardService } from './contractor-dashboard.service';

@ApiTags('Contractor Management') @ApiBearerAuth() @Controller('contractor')
export class ContractorDashboardController {
  constructor(private readonly svc: ContractorDashboardService) {}
  @Get('dashboard') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get contractor dashboard stats' })
  async getStats(@Request() req: any) { return this.svc.getStats(req.user.companyId); }
}
