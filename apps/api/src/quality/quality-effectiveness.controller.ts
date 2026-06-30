import { Controller, Get, Post, Patch, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityEffectivenessService } from './quality-effectiveness.service';

@ApiTags('Quality Management') @ApiBearerAuth() @Controller('quality')
export class QualityEffectivenessController {
  constructor(private readonly svc: QualityEffectivenessService) {}

  @Get('effectiveness-reviews') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List effectiveness reviews' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('effectiveness-reviews/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get review by ID' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('effectiveness-reviews') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create effectiveness review' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('effectiveness-reviews/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update review' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Post('effectiveness-reviews/:id/complete') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Complete review' })
  async complete(@Param('id') id: string, @Body('outcome') outcome: string, @Request() req: any) { return this.svc.complete(id, outcome, req.user.companyId); }
}
