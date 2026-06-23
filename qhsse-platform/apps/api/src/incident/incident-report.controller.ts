import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { CreateIncidentDto, UpdateIncidentDto, IncidentQueryDto } from './dto/create-incident.dto';

@ApiTags('Incident Management') @ApiBearerAuth() @Controller('incidents')
export class IncidentReportController {
  constructor(private readonly svc: IncidentService) {}

  @Post() @RequiredPermissions('incident.create') @ApiOperation({ summary: 'Create incident report' })
  async create(@Body() dto: CreateIncidentDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('incident.view') @ApiOperation({ summary: 'List incidents' })
  async findAll(@Request() req: any, @Query() q: IncidentQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Update incident' })
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId, req.user.id); }

  @Delete(':id') @RequiredPermissions('incident.delete') @ApiOperation({ summary: 'Delete incident' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId, req.user.id); }

  @Post(':id/submit') @RequiredPermissions('incident.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit incident' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId, req.user.id); }

  @Get(':id/status-history') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident status history' })
  async statusHistory(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }
}
