import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TrainingDashboardService } from './dashboard.service';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class TrainingDashboardController {
  constructor(private readonly svc: TrainingDashboardService) {}

  @Get('dashboard/stats') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training dashboard statistics' })
  async getStats(@Request() req: any) { return this.svc.getStats(req.user.companyId); }
}
