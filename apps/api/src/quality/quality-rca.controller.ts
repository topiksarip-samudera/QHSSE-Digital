import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityRcaService } from './quality-rca.service';

@ApiTags('Quality Management') @ApiBearerAuth() @Controller('quality')
export class QualityRcaController {
  constructor(private readonly svc: QualityRcaService) {}

  @Get('rca') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List root cause analyses' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('rca/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get RCA by ID' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('rca') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create RCA' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('rca/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update RCA' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId, req.user.id); }

  @Delete('rca/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete RCA' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
