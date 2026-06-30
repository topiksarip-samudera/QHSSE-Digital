import { Controller, Get, Post, Param, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';

@ApiTags('Asset QR') @ApiBearerAuth() @Controller('asset')
export class AssetQrController {
  constructor(private readonly svc: AssetService) {}

  @Get('register/:id/qr') @RequiredPermissions('asset_qr.generate')
  @ApiOperation({ summary: 'Generate QR code for asset' })
  async generateQr(@Param('id') id: string, @Request() req: any) { return this.svc.generateQr(id, req.user.companyId); }

  @Post('qr/verify') @RequiredPermissions('asset_qr.verify')
  @ApiOperation({ summary: 'Verify asset by QR code' })
  async verifyQr(@Body('code') code: string, @Request() req: any) { return this.svc.verifyQr(code, req.user.companyId, req.user.id); }
}
