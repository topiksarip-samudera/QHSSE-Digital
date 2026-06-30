import { Controller, Get, Post, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';

@ApiTags('Asset Inspection') @ApiBearerAuth() @Controller('asset')
export class AssetInspectionExtraController {
  constructor(private readonly svc: AssetService) {}

  @Get('inspection-due') @RequiredPermissions('asset.view')
  @ApiOperation({ summary: 'Get inspections due' })
  async due(@Request() req: any, @Query('days') days?: number) { return this.svc.getInspectionsDue(req.user.companyId, days); }

  @Post('inspections/:id/complete') @RequiredPermissions('asset_inspection.verify') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete inspection with result' })
  async complete(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.completeInspection(id, req.user.companyId, req.user.id, d); }

  @Post('inspections/:id/create-finding') @RequiredPermissions('asset_inspection.create') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create finding from inspection' })
  async createFinding(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.createInspectionFinding(id, req.user.companyId, req.user.id, d); }
}
