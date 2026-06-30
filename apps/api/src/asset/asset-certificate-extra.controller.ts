import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';

@ApiTags('Asset Certificate') @ApiBearerAuth() @Controller('asset/certificates')
export class AssetCertificateExtraController {
  constructor(private readonly svc: AssetService) {}

  @Get('expiring') @RequiredPermissions('asset.view')
  @ApiOperation({ summary: 'Get expiring certificates' })
  async expiring(@Query('days') days: number, @Request() req: any) { return this.svc.getExpiringCertificates(req.user.companyId, days || 30); }

  @Get('expired') @RequiredPermissions('asset.view')
  @ApiOperation({ summary: 'Get expired certificates' })
  async expired(@Request() req: any) { return this.svc.getExpiredCertificates(req.user.companyId); }
}
