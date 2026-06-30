import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { MusterPointService } from './muster-point.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class MusterPointController {
  constructor(private readonly svc: MusterPointService) {}

  @Post('muster-points') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create muster point' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId); }

  @Get('muster-points') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List muster points' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('muster-points/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get muster point detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('muster-points/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update muster point' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('muster-points/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete muster point' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
