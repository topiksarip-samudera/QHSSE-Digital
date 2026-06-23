import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IntegrationCenterService } from './integration-center.service';
import { CreateIntegrationDto, QueryDto } from './dto/integration.dto';

@ApiTags('Advanced Integration Center') @ApiBearerAuth() @Controller('integrations')
export class IntegrationCenterController {
  constructor(private readonly svc: IntegrationCenterService) {}

  @Post() @RequiredPermissions('advanced-integration-center.create') @ApiOperation({ summary: 'Create integration' })
  async create(@Body() dto: CreateIntegrationDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('advanced-integration-center.view') @ApiOperation({ summary: 'List integrations' })
  async findAll(@Request() req: any, @Query() q: QueryDto) { return this.svc.findAll(req.user.companyId, q); }
  @Get(':id') @RequiredPermissions('advanced-integration-center.view') @ApiOperation({ summary: 'Get integration' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('advanced-integration-center.update') @ApiOperation({ summary: 'Update integration' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('advanced-integration-center.delete') @ApiOperation({ summary: 'Delete integration' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }
  @Post(':id/test') @RequiredPermissions('advanced-integration-center.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Test integration' })
  async test(@Param('id') id: string, @Request() req: any) { return this.svc.test(id, req.user.companyId); }
  @Post(':id/sync') @RequiredPermissions('advanced-integration-center.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Trigger sync' })
  async sync(@Param('id') id: string, @Request() req: any) { return this.svc.sync(id, req.user.companyId); }
  @Get(':id/logs') @RequiredPermissions('advanced-integration-center.view') @ApiOperation({ summary: 'Get sync logs' })
  async getSyncLogs(@Param('id') id: string, @Request() req: any) { return this.svc.getSyncLogs(id, req.user.companyId); }
}
