import { Controller, Get, Post, Param, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';

@ApiTags('Incident - Evidence & Timeline') @ApiBearerAuth() @Controller('incidents')
export class IncidentTimelineController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/attachments') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident attachments' })
  async getAttachments(@Param('id') id: string, @Request() req: any) { return this.svc.getAttachments(id, req.user.companyId); }

  @Get(':id/comments') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident comments' })
  async getComments(@Param('id') id: string, @Request() req: any) { return this.svc.getComments(id, req.user.companyId); }

  @Get(':id/timeline') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident timeline' })
  async getTimeline(@Param('id') id: string, @Request() req: any) { return this.svc.getTimeline(id, req.user.companyId); }

  @Get(':id/audit-logs') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident audit logs' })
  async getAuditLogs(@Param('id') id: string, @Request() req: any) { return this.svc.getAuditLogs(id, req.user.companyId); }
}
