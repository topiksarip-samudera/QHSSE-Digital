import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TrainingReportService } from './report.service';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class TrainingReportController {
  constructor(private readonly svc: TrainingReportService) {}

  @Get('reports/expiring') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get expiring certificates' })
  async getExpiringCertificates(@Request() req: any, @Query('days') days?: number) { return this.svc.getExpiringCertificates(req.user.companyId, days); }

  @Get('reports/compliance') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training compliance report' })
  async getComplianceReport(@Request() req: any) { return this.svc.getComplianceReport(req.user.companyId); }

  @Get('reports/attendance') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get attendance report' })
  async getAttendanceReport(@Request() req: any, @Query() q: any) { return this.svc.getAttendanceReport(req.user.companyId, q); }
}
