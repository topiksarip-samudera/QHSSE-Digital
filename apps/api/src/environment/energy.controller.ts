import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentEnergyService } from './energy.service';

@ApiTags('Environment Management') @ApiBearerAuth() @Controller('environment')
export class EnvironmentEnergyController {
  constructor(private readonly svc: EnvironmentEnergyService) {}

  @Get('energy') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List energy usage records' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('energy/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get energy usage record' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('energy') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Record energy usage' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('energy/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update energy usage' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('energy/:id') @RequiredPermissions('env.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete energy usage' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
