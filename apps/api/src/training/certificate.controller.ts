import { Controller, Get, Post, Param, Request, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { CertificateDashboardService } from './certificate.service';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class CertificateExtraController {
  constructor(private readonly svc: CertificateDashboardService) {}

  @Get('certificates/expiring') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List certificates expiring soon' })
  async getExpiring(@Request() req: any, @Query('days') days?: number) { return this.svc.getExpiringCertificates(req.user.companyId, days); }

  @Get('certificates/expired') @RequiredPermissions('training.view') @ApiOperation({ summary: 'List expired certificates' })
  async getExpired(@Request() req: any) { return this.svc.getExpiredCertificates(req.user.companyId); }

  @Post('certificates/:id/archive') @RequiredPermissions('training.manage_certificate') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Archive a certificate' })
  async archive(@Param('id') id: string, @Request() req: any) { return this.svc.archiveCertificate(id, req.user.companyId); }
}
