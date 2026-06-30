import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentService } from './environment.service';

@ApiTags('Environment Management') @ApiBearerAuth() @Controller('environment')
export class EnvironmentController {
  constructor(private readonly svc: EnvironmentService) {}

  @Get('settings') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get environment settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }
  @Patch('settings') @RequiredPermissions('env.manage_settings') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() d: any, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, d); }

  @Get('master-data') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }
  @Post('master-data/seed-defaults') @RequiredPermissions('env.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
