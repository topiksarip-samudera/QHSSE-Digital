import { Controller, Get, Post, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { DataRetentionService } from './data-retention.service';
import { CreatePolicyDto, CreateLegalHoldDto, CreatePurgeRequestDto } from './dto/data-retention.dto';

@ApiTags('Data Retention') @ApiBearerAuth() @Controller()
export class DataRetentionController {
  constructor(private readonly svc: DataRetentionService) {}

  @Post('retention-policies') @RequiredPermissions('data-retention-archive-legal-hold.create') @ApiOperation({ summary: 'Create retention policy' })
  async createPolicy(@Body() dto: CreatePolicyDto, @Request() req: any) { return this.svc.createPolicy(dto, req.user.companyId, req.user.id); }
  @Get('retention-policies') @RequiredPermissions('data-retention-archive-legal-hold.view') @ApiOperation({ summary: 'List policies' })
  async getPolicies(@Request() req: any) { return this.svc.getPolicies(req.user.companyId); }

  @Post('archive') @RequiredPermissions('data-retention-archive-legal-hold.create') @ApiOperation({ summary: 'Archive a record' })
  async archive(@Body('module') module: string, @Body('recordType') recordType: string, @Body('recordId') recordId: string, @Body('data') data: any, @Request() req: any) { return this.svc.archive(req.user.companyId, module, recordType, recordId, data, req.user.id); }
  @Get('archive') @RequiredPermissions('data-retention-archive-legal-hold.view') @ApiOperation({ summary: 'Get archived records' })
  async getArchives(@Request() req: any, @Body('module') module?: string) { return this.svc.getArchives(req.user.companyId, module); }

  @Post('legal-holds') @RequiredPermissions('data-retention-archive-legal-hold.create') @ApiOperation({ summary: 'Place legal hold' })
  async createLegalHold(@Body() dto: CreateLegalHoldDto, @Request() req: any) { return this.svc.createLegalHold(dto, req.user.companyId, req.user.id); }
  @Get('legal-holds') @RequiredPermissions('data-retention-archive-legal-hold.view') @ApiOperation({ summary: 'List legal holds' })
  async getLegalHolds(@Request() req: any) { return this.svc.getLegalHolds(req.user.companyId); }
  @Post('legal-holds/:id/release') @RequiredPermissions('data-retention-archive-legal-hold.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Release legal hold' })
  async releaseLegalHold(@Param('id') id: string, @Request() req: any) { return this.svc.releaseLegalHold(id, req.user.id); }

  @Post('purge-requests') @RequiredPermissions('data-retention-archive-legal-hold.create') @ApiOperation({ summary: 'Create purge request' })
  async createPurgeRequest(@Body() dto: CreatePurgeRequestDto, @Request() req: any) { return this.svc.createPurgeRequest(dto, req.user.companyId, req.user.id); }
  @Get('purge-requests') @RequiredPermissions('data-retention-archive-legal-hold.view') @ApiOperation({ summary: 'List purge requests' })
  async getPurgeRequests(@Request() req: any) { return this.svc.getPurgeRequests(req.user.companyId); }
  @Post('purge-requests/:id/approve') @RequiredPermissions('data-retention-archive-legal-hold.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve purge request' })
  async approvePurge(@Param('id') id: string, @Request() req: any) { return this.svc.approvePurge(id, req.user.companyId, req.user.id); }
}
