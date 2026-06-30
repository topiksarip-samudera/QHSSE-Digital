import { Controller, Get, Post, Patch, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentMonitoringService } from './monitoring.service';

@ApiTags('Environment Management') @ApiBearerAuth() @Controller('environment')
export class EnvironmentMonitoringController {
  constructor(private readonly svc: EnvironmentMonitoringService) {}

  @Get('monitoring/schedules') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List monitoring schedules' })
  async getSchedules(@Request() req: any, @Query() q: any) { return this.svc.findAllSchedules(req.user.companyId, q); }

  @Get('monitoring/schedules/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get monitoring schedule' })
  async getSchedule(@Param('id') id: string, @Request() req: any) { return this.svc.findScheduleById(id, req.user.companyId); }

  @Post('monitoring/schedules') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create monitoring schedule' })
  async createSchedule(@Body() d: any, @Request() req: any) { return this.svc.createSchedule(d, req.user.companyId, req.user.id); }

  @Patch('monitoring/schedules/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update monitoring schedule' })
  async updateSchedule(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateSchedule(id, d, req.user.companyId); }

  @Get('monitoring/results') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List monitoring results' })
  async getResults(@Request() req: any, @Query() q: any) { return this.svc.findAllResults(req.user.companyId, q); }

  @Post('monitoring/results') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create monitoring result' })
  async createResult(@Body() d: any, @Request() req: any) { return this.svc.createResult(d, req.user.companyId, req.user.id); }

  @Get('exceedances') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List exceedances' })
  async getExceedances(@Request() req: any, @Query() q: any) { return this.svc.findAllExceedances(req.user.companyId, q); }

  @Post('exceedances') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create exceedance' })
  async createExceedance(@Body() d: any, @Request() req: any) { return this.svc.createExceedance(d, req.user.companyId, req.user.id); }

  @Post('exceedances/:id/resolve') @RequiredPermissions('env.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Resolve exceedance' })
  async resolveExceedance(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.resolveExceedance(id, d, req.user.companyId); }

  @Get('spills') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List spills' })
  async getSpills(@Request() req: any, @Query() q: any) { return this.svc.findAllSpills(req.user.companyId, q); }

  @Get('spills/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get spill' })
  async getSpill(@Param('id') id: string, @Request() req: any) { return this.svc.findSpillById(id, req.user.companyId); }

  @Post('spills') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Report spill' })
  async createSpill(@Body() d: any, @Request() req: any) { return this.svc.createSpill(d, req.user.companyId, req.user.id); }

  @Patch('spills/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update spill' })
  async updateSpill(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateSpill(id, d, req.user.companyId); }
}
