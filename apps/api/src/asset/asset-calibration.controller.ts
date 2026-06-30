import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetCalibrationService } from './asset-calibration.service';

@ApiTags('Asset & Equipment') @ApiBearerAuth() @Controller('asset')
export class AssetCalibrationController {
  constructor(private readonly svc: AssetCalibrationService) {}

  @Get('calibrations') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List calibrations' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('calibrations/due') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List due calibrations' })
  async findDue(@Request() req: any, @Query('days') days?: number) { return this.svc.findDue(req.user.companyId, days); }

  @Get('calibrations/:id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get calibration' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('calibrations') @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create calibration' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('calibrations/:id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update calibration' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Post('calibrations/:id/complete') @RequiredPermissions('asset.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete calibration' })
  async complete(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.complete(id, d, req.user.companyId); }

  @Delete('calibrations/:id') @RequiredPermissions('asset.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete calibration' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
