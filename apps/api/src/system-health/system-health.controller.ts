import { Controller, Get, Post, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SystemHealthService } from './system-health.service';
import { CreateAlertRuleDto, QueryDto } from './dto/system-health.dto';

@ApiTags('System Health') @ApiBearerAuth() @Controller('system-health')
export class SystemHealthController {
  constructor(private readonly svc: SystemHealthService) {}

  @Get() @RequiredPermissions('system-health-monitoring.view') @ApiOperation({ summary: 'Get system health overview' })
  async getHealth() { return this.svc.getHealth(); }

  @Get('errors') @RequiredPermissions('system-health-monitoring.view') @ApiOperation({ summary: 'Get error logs' })
  async getErrors(@Query() q: QueryDto) { return this.svc.getErrors(q); }

  @Get('alert-rules') @RequiredPermissions('system-health-monitoring.view') @ApiOperation({ summary: 'Get alert rules' })
  async getAlertRules() { return this.svc.getAlertRules(); }

  @Post('alert-rules') @RequiredPermissions('system-health-monitoring.create') @ApiOperation({ summary: 'Create alert rule' })
  async createAlertRule(@Body() dto: CreateAlertRuleDto) { return this.svc.createAlertRule(dto); }

  @Delete('alert-rules/:id') @RequiredPermissions('system-health-monitoring.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete alert rule' })
  async deleteAlertRule(@Param('id') id: string) { return this.svc.deleteAlertRule(id); }

  @Get('alerts') @RequiredPermissions('system-health-monitoring.view') @ApiOperation({ summary: 'Get active alerts' })
  async getAlerts() { return this.svc.getAlerts(); }

  @Post('alerts/:id/acknowledge') @RequiredPermissions('system-health-monitoring.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Acknowledge alert' })
  async acknowledgeAlert(@Param('id') id: string) { return this.svc.acknowledgeAlert(id); }
}
