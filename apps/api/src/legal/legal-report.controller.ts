import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalReportService } from './legal-report.service';

@ApiTags('Legal & Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalReportController {
  constructor(private readonly svc: LegalReportService) {}

  @Get('reports/compliance-score') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get compliance score' })
  async getComplianceScore(@Request() req: any) { return this.svc.getComplianceScore(req.user.companyId); }

  @Get('reports/gaps') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get gap analysis report' })
  async getGapReport(@Request() req: any) { return this.svc.getGapReport(req.user.companyId); }

  @Get('reports/audit-readiness') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get audit readiness check' })
  async getAuditReadiness(@Request() req: any) { return this.svc.getAuditReadiness(req.user.companyId); }
}
