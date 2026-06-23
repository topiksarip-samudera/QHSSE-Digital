import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { DashboardBuilderService } from './dashboard-builder.service';
import { CreateDashboardDto, UpdateDashboardDto, DashboardQueryDto, WidgetDto } from './dto/dashboard-builder.dto';

@ApiTags('Dashboard Builder') @ApiBearerAuth() @Controller('dashboards')
export class DashboardBuilderController {
  constructor(private readonly svc: DashboardBuilderService) {}

  @Post() @RequiredPermissions('dashboard-builder.create') @ApiOperation({ summary: 'Create dashboard' })
  async create(@Body() dto: CreateDashboardDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('dashboard-builder.view') @ApiOperation({ summary: 'List dashboards' })
  async findAll(@Request() req: any, @Query() q: DashboardQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('dashboard-builder.view') @ApiOperation({ summary: 'Get dashboard detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('dashboard-builder.update') @ApiOperation({ summary: 'Update dashboard' })
  async update(@Param('id') id: string, @Body() dto: UpdateDashboardDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('dashboard-builder.delete') @ApiOperation({ summary: 'Delete dashboard' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/widgets') @RequiredPermissions('dashboard-builder.update') @ApiOperation({ summary: 'Add widget' })
  async addWidget(@Param('id') id: string, @Body() dto: WidgetDto, @Request() req: any) { return this.svc.addWidget(id, dto, req.user.companyId); }

  @Patch(':id/widgets/:widgetId') @RequiredPermissions('dashboard-builder.update') @ApiOperation({ summary: 'Update widget' })
  async updateWidget(@Param('widgetId') widgetId: string, @Body() data: any) { return this.svc.updateWidget(widgetId, data); }

  @Delete(':id/widgets/:widgetId') @RequiredPermissions('dashboard-builder.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete widget' })
  async deleteWidget(@Param('widgetId') widgetId: string) { return this.svc.deleteWidget(widgetId); }

  @Patch(':id/layout') @RequiredPermissions('dashboard-builder.update') @ApiOperation({ summary: 'Update dashboard layout' })
  async updateLayout(@Param('id') id: string, @Body() layout: any, @Request() req: any) { return this.svc.updateLayout(id, layout, req.user.companyId); }
}
