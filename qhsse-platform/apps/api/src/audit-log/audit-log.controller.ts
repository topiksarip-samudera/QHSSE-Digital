import { Controller, Get, Post, Param, Query, Body, Request, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AuditLogService } from './audit-log.service';
import { AuditLogQueryDto, ActivityLogQueryDto, LoginHistoryQueryDto } from './dto/audit-log-query.dto';

@ApiTags('Audit Log')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // ─── Audit Logs ─────────────────────────────────────────────────────────────

  @Get()
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'List audit logs (paginated, filterable)' })
  async getAuditLogs(@Request() req: any, @Query() query: AuditLogQueryDto) {
    return this.auditLogService.getAuditLogs(req.user.companyId, query);
  }

  @Get('stats')
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'Get audit log statistics' })
  async getStats(@Request() req: any) {
    return this.auditLogService.getAuditLogStats(req.user.companyId);
  }

  @Get('export')
  @RequiredPermissions('audit-log-basic.export')
  @ApiOperation({ summary: 'Export audit logs as CSV' })
  async exportAuditLogs(@Request() req: any, @Query() query: AuditLogQueryDto, @Res() res: Response) {
    const csv = await this.auditLogService.exportAuditLogs(req.user.companyId, query);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="audit-logs-export.csv"',
    });
    res.send(csv);
  }

  @Get(':id')
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'Get audit log by ID' })
  async getAuditLogById(@Param('id') id: string, @Request() req: any) {
    return this.auditLogService.getAuditLogById(id, req.user.companyId);
  }

  // ─── Activity Logs ──────────────────────────────────────────────────────────

  @Get('activity/list')
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'List activity logs (paginated, filterable)' })
  async getActivityLogs(@Request() req: any, @Query() query: ActivityLogQueryDto) {
    return this.auditLogService.getActivityLogs(req.user.companyId, query);
  }

  @Post('activity')
  @RequiredPermissions('audit-log-basic.create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an activity log entry' })
  async createActivityLog(@Request() req: any, @Body() body: any) {
    return this.auditLogService.createActivityLog({
      companyId: req.user.companyId,
      actorId: req.user.id,
      activity: body.activity,
      entity: body.entity,
      entityId: body.entityId,
      details: body.details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  // ─── Login History ──────────────────────────────────────────────────────────

  @Get('login-history')
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'List login history (paginated, filterable)' })
  async getLoginHistory(@Query() query: LoginHistoryQueryDto) {
    return this.auditLogService.getLoginHistory(query);
  }

  @Get('login-history/stats')
  @RequiredPermissions('audit-log-basic.view')
  @ApiOperation({ summary: 'Get login history statistics' })
  async getLoginHistoryStats() {
    return this.auditLogService.getLoginHistoryStats();
  }
}
