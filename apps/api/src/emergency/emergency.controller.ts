import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EmergencyService } from './emergency.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class EmergencyController {
  constructor(private readonly svc: EmergencyService) {}

  @Get('settings') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get emergency settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() d: any, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, d); }

  @Get('master-data') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('emergency.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  @Get('dashboard') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get emergency dashboard' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Post('calculate-score') @RequiredPermissions('emergency.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Recalculate emergency score' })
  async calculateScore(@Request() req: any) { return this.svc.calculateScore(req.user.companyId); }
}
