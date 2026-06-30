import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { VehicleAccessService } from './vehicle-access.service';

@ApiTags('Security Management') @ApiBearerAuth() @Controller('security')
export class VehicleAccessController {
  constructor(private readonly svc: VehicleAccessService) {}

  @Get('vehicle-access') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List vehicle access records' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, query); }

  @Get('vehicle-access/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get vehicle access record' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('vehicle-access') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create vehicle access record' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Post('vehicle-access/:id/check-in') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check in vehicle' })
  async checkIn(@Param('id') id: string, @Request() req: any) { return this.svc.checkIn(id, req.user.companyId); }

  @Post('vehicle-access/:id/check-out') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Check out vehicle' })
  async checkOut(@Param('id') id: string, @Request() req: any) { return this.svc.checkOut(id, req.user.companyId); }

  @Patch('vehicle-access/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update vehicle access record' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('vehicle-access/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete vehicle access record' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
