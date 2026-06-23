import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';
import { UpdateRiskSettingsDto } from './dto/risk-settings.dto';

@ApiTags('Risk Management') @ApiBearerAuth() @Controller('risk')
export class RiskController {
  constructor(private readonly svc: RiskService) {}

  @Get('settings') @RequiredPermissions('risk.manage_settings') @ApiOperation({ summary: 'Get risk settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('risk.manage_settings') @ApiOperation({ summary: 'Update risk settings' })
  async updateSettings(@Body() dto: UpdateRiskSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get risk master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('risk.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default risk master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
