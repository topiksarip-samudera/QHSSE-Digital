import { Controller, Get, Post, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { OfflineSyncService } from './offline-sync.service';

@ApiTags('Offline PWA') @ApiBearerAuth() @Controller('sync')
export class OfflineSyncController {
  constructor(private readonly svc: OfflineSyncService) {}

  @Post('push') @RequiredPermissions('offline-pwa.create') @ApiOperation({ summary: 'Push offline changes' })
  async push(@Body('items') items: any[], @Request() req: any) { return this.svc.push(req.user.companyId, req.user.id, items || []); }

  @Get('pull') @RequiredPermissions('offline-pwa.view') @ApiOperation({ summary: 'Pull latest changes' })
  async pull(@Request() req: any, @Query('since') since?: string) { return this.svc.pull(req.user.companyId, req.user.id, since); }

  @Get('status') @RequiredPermissions('offline-pwa.view') @ApiOperation({ summary: 'Get sync status' })
  async getStatus(@Request() req: any) { return this.svc.getStatus(req.user.companyId, req.user.id); }

  @Get('conflicts') @RequiredPermissions('offline-pwa.view') @ApiOperation({ summary: 'Get unresolved conflicts' })
  async getConflicts(@Request() req: any) { return this.svc.getConflicts(req.user.companyId); }

  @Post('conflicts/:id/resolve') @RequiredPermissions('offline-pwa.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Resolve conflict' })
  async resolveConflict(@Param('id') id: string, @Body('resolution') resolution: string, @Request() req: any) { return this.svc.resolveConflict(id, resolution, req.user.id); }
}
