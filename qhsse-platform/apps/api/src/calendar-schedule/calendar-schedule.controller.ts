import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { CalendarScheduleService } from './calendar-schedule.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleQueryDto } from './dto/schedule.dto';

@ApiTags('Calendar & Schedule') @ApiBearerAuth() @Controller()
export class CalendarScheduleController {
  constructor(private readonly svc: CalendarScheduleService) {}

  @Post('schedules') @RequiredPermissions('calendar-schedule-engine.create') @ApiOperation({ summary: 'Create schedule' })
  async create(@Body() dto: CreateScheduleDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get('schedules') @RequiredPermissions('calendar-schedule-engine.view') @ApiOperation({ summary: 'List schedules' })
  async findAll(@Request() req: any, @Query() q: ScheduleQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get('schedules/:id') @RequiredPermissions('calendar-schedule-engine.view') @ApiOperation({ summary: 'Get schedule detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('schedules/:id') @RequiredPermissions('calendar-schedule-engine.update') @ApiOperation({ summary: 'Update schedule' })
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('schedules/:id') @RequiredPermissions('calendar-schedule-engine.delete') @ApiOperation({ summary: 'Delete schedule' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post('schedules/:id/generate-occurrences') @RequiredPermissions('calendar-schedule-engine.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Generate occurrences from recurrence rule' })
  async generateOccurrences(@Param('id') id: string, @Request() req: any) { return this.svc.generateOccurrences(id, req.user.companyId); }

  @Get('schedule-occurrences') @RequiredPermissions('calendar-schedule-engine.view') @ApiOperation({ summary: 'List occurrences (calendar view)' })
  async getOccurrences(@Request() req: any, @Query('fromDate') fromDate?: string, @Query('toDate') toDate?: string) { return this.svc.getOccurrences(req.user.companyId, fromDate, toDate); }
}
