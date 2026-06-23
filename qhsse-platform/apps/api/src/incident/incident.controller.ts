import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { UpdateIncidentSettingsDto } from './dto/incident-settings.dto';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/create-incident.dto';

@ApiTags('Incident Management') @ApiBearerAuth() @Controller('incident')
export class IncidentController {
  constructor(private readonly svc: IncidentService) {}

  @Get('settings') @RequiredPermissions('incident.manage_settings') @ApiOperation({ summary: 'Get incident settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('incident.manage_settings') @ApiOperation({ summary: 'Update incident settings' })
  async updateSettings(@Body() dto: UpdateIncidentSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, req.user.id, dto); }

  @Get('master-data') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('incident.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default incident master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  @Get('module-status') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident module status' })
  async getModuleStatus(@Request() req: any) { return this.svc.getModuleStatus(req.user.companyId); }
}
