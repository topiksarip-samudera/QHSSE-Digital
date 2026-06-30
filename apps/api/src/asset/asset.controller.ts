import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';
import { UpdateAssetSettingsDto } from './dto/asset.dto';

@ApiTags('Asset & Equipment Management') @ApiBearerAuth() @Controller('asset')
export class AssetController {
  constructor(private readonly svc: AssetService) {}

  @Get('settings') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('asset.manage_settings') @ApiOperation({ summary: 'Update asset settings' })
  async updateSettings(@Body() dto: UpdateAssetSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('asset.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default asset master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  @Get('dashboard') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset dashboard KPI' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Get('score') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset score' })
  async getScore(@Request() req: any) { return this.svc.getScore(req.user.companyId); }
}
