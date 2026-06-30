import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityCopqService } from './quality-copq.service';

@ApiTags('Quality Management') @ApiBearerAuth() @Controller('quality')
export class QualityCopqController {
  constructor(private readonly svc: QualityCopqService) {}

  @Get('copq') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List COPQ entries' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('copq/summary') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get COPQ cost summary' })
  async getSummary(@Request() req: any) { return this.svc.getSummary(req.user.companyId); }

  @Get('copq/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get COPQ entry' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('copq') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create COPQ entry' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('copq/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update COPQ entry' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('copq/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete COPQ entry' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
