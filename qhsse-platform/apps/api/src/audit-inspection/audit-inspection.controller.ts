import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AuditInspectionService } from './audit-inspection.service';
import { UpdateAuditInspectionSettingsDto } from './dto/audit-inspection-settings.dto';

@ApiTags('Audit & Inspection') @ApiBearerAuth() @Controller('audit-inspection')
export class AuditInspectionController {
  constructor(private readonly svc: AuditInspectionService) {}

  @Get('settings') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get audit/inspection settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('audit.manage_settings') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() dto: UpdateAuditInspectionSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get audit master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('audit.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
