import { Controller, Get, Post, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';

@ApiTags('Asset Status') @ApiBearerAuth() @Controller('asset/register')
export class AssetStatusController {
  constructor(private readonly svc: AssetService) {}

  @Post(':id/change-status') @RequiredPermissions('equipment.change_status') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change asset status' })
  async changeStatus(@Param('id') id: string, @Body('status') status: string, @Body('remark') remark: string, @Request() req: any) { return this.svc.changeAssetStatus(id, req.user.companyId, req.user.id, status, remark); }

  @Post(':id/archive') @RequiredPermissions('asset.archive') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive asset' })
  async archive(@Param('id') id: string, @Request() req: any) { return this.svc.archiveAsset(id, req.user.companyId); }

  @Get(':id/status-history') @RequiredPermissions('asset.view')
  @ApiOperation({ summary: 'Get asset status history' })
  async statusHistory(@Param('id') id: string, @Request() req: any) { return this.svc.getAssetStatusHistory(id, req.user.companyId); }

  @Get(':id/due-list') @RequiredPermissions('asset.view')
  @ApiOperation({ summary: 'Get asset due items (inspections, maintenance, certs, calibration)' })
  async dueList(@Param('id') id: string, @Request() req: any) { return this.svc.getAssetDueList(id, req.user.companyId); }
}

@ApiTags('Asset Overview') @ApiBearerAuth() @Controller('asset')
export class AssetOverviewController {
  constructor(private readonly svc: AssetService) {}

  @Get('dashboard') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset dashboard stats' })
  async dashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }

  @Get('kpi') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get asset KPI metrics' })
  async kpi(@Request() req: any) { return this.svc.getKpi(req.user.companyId); }

  @Get('due-list') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get all due items across assets' })
  async allDue(@Request() req: any, @Query('days') days?: number) { return this.svc.getDueList(req.user.companyId, days); }

  @Get('critical') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List critical equipment' })
  async critical(@Request() req: any) { return this.svc.getCriticalEquipment(req.user.companyId); }

  @Get('equipment-readiness') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get equipment readiness for emergency' })
  async equipmentReadiness(@Request() req: any) { return this.svc.getEquipmentReadiness(req.user.companyId); }
}
