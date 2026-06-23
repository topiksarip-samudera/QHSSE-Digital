import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { BackupRestoreService } from './backup-restore.service';
import { CreateBackupDto, CreateScheduleDto, RestoreRequestDto, QueryDto } from './dto/backup.dto';

@ApiTags('Backup & Restore') @ApiBearerAuth() @Controller('backups')
export class BackupRestoreController {
  constructor(private readonly svc: BackupRestoreService) {}

  @Post() @RequiredPermissions('backup-restore-ui.create') @ApiOperation({ summary: 'Create manual backup' })
  async create(@Body() dto: CreateBackupDto, @Request() req: any) { return this.svc.createBackup(dto, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('backup-restore-ui.view') @ApiOperation({ summary: 'List backups' })
  async getBackups(@Request() req: any, @Query() q: QueryDto) { return this.svc.getBackups(req.user.companyId, q); }

  @Get('schedules') @RequiredPermissions('backup-restore-ui.view') @ApiOperation({ summary: 'List backup schedules' })
  async getSchedules(@Request() req: any) { return this.svc.getSchedules(req.user.companyId); }
  @Post('schedules') @RequiredPermissions('backup-restore-ui.create') @ApiOperation({ summary: 'Create backup schedule' })
  async createSchedule(@Body() dto: CreateScheduleDto, @Request() req: any) { return this.svc.createSchedule(dto, req.user.companyId, req.user.id); }
  @Patch('schedules/:id') @RequiredPermissions('backup-restore-ui.update') @ApiOperation({ summary: 'Update schedule' })
  async updateSchedule(@Param('id') id: string, @Body() d: any) { return this.svc.updateSchedule(id, d); }
  @Delete('schedules/:id') @RequiredPermissions('backup-restore-ui.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete schedule' })
  async deleteSchedule(@Param('id') id: string) { return this.svc.deleteSchedule(id); }

  @Post('restore-requests') @RequiredPermissions('backup-restore-ui.create') @ApiOperation({ summary: 'Request restore' })
  async requestRestore(@Body() dto: RestoreRequestDto, @Request() req: any) { return this.svc.createRestoreRequest(dto, req.user.companyId, req.user.id); }
  @Get('restore-requests') @RequiredPermissions('backup-restore-ui.view') @ApiOperation({ summary: 'List restore requests' })
  async getRestoreRequests(@Request() req: any) { return this.svc.getRestoreRequests(req.user.companyId); }
  @Post('restore-requests/:id/approve') @RequiredPermissions('backup-restore-ui.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve restore' })
  async approveRestore(@Param('id') id: string, @Request() req: any) { return this.svc.approveRestore(id, req.user.companyId, req.user.id); }
  @Post('restore-requests/:id/reject') @RequiredPermissions('backup-restore-ui.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject restore' })
  async rejectRestore(@Param('id') id: string, @Request() req: any) { return this.svc.rejectRestore(id, req.user.companyId, req.user.id); }
}
