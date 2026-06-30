import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentPermitService } from './permit.service';

@ApiTags('Environment - Permits') @ApiBearerAuth() @Controller('environment')
export class EnvironmentPermitController {
  constructor(private readonly svc: EnvironmentPermitService) {}

  // Permits CRUD
  @Post('permits') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create permit' })
  async createPermit(@Body() d: any, @Request() req: any) { return this.svc.createPermit(d, req.user.companyId, req.user.id); }
  @Get('permits') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List permits' })
  async getPermits(@Request() req: any, @Query() q: any) { return this.svc.getPermits(req.user.companyId, q); }
  @Get('permits/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get permit' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }
  @Patch('permits/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update permit' })
  async updatePermit(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updatePermit(id, d, req.user.companyId); }
  @Delete('permits/:id') @RequiredPermissions('env.delete') @ApiOperation({ summary: 'Delete permit' })
  async softDelete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  // Expiry & Compliance
  @Get('permits/expiring') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get expiring permits' })
  async getExpiringPermits(@Request() req: any, @Query('days') days?: number) { return this.svc.getExpiringPermits(req.user.companyId, days ? Number(days) : 30); }
  @Get('permits/compliance') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get compliance status' })
  async getComplianceStatus(@Request() req: any) { return this.svc.getComplianceStatus(req.user.companyId); }
}
