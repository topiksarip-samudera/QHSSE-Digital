import { Controller, Get, Patch, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SecurityService } from './security.service';
import { UpdateSecuritySettingsDto } from './dto/security-settings.dto';

@ApiTags('Security Management') @ApiBearerAuth() @Controller('security')
export class SecurityController {
  constructor(private readonly svc: SecurityService) {}

  @Get('settings') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get security settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('security.manage_settings') @ApiOperation({ summary: 'Update security settings' })
  async updateSettings(@Body() dto: UpdateSecuritySettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get security master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('security.manage_settings') @ApiOperation({ summary: 'Seed default security master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  @Get('dashboard') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get security dashboard' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Get('score') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get security score' })
  async getScore(@Request() req: any) { return this.svc.getScore(req.user.companyId); }
}
