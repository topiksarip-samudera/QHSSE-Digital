import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityService } from './quality.service';
import { QualityCapaService } from './quality-capa.service';
import { UpdateQualitySettingsDto } from './dto/quality-settings.dto';

@ApiTags('Quality Management') @ApiBearerAuth() @Controller('quality')
export class QualityController {
  constructor(private readonly svc: QualityService, private readonly capaSvc: QualityCapaService) {}

  @Get('settings') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get quality settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('quality.manage_settings') @ApiOperation({ summary: 'Update quality settings' })
  async updateSettings(@Body() dto: UpdateQualitySettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get quality master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('quality.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default quality master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  @Get('dashboard') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get quality dashboard KPI' })
  async getDashboard(@Request() req: any) { return this.capaSvc.getDashboard(req.user.companyId); }

  @Get('score') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get quality score' })
  async getScore(@Request() req: any) { return this.capaSvc.getScore(req.user.companyId); }
}
