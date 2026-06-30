import { Controller, Get, Post, Param, Body, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { PatrolRunService } from './patrol-run.service';

@ApiTags('Security Management') @ApiBearerAuth() @Controller('security')
export class PatrolRunController {
  constructor(private readonly svc: PatrolRunService) {}

  @Post('patrol-runs/start') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Start a patrol run' })
  async start(@Body('routeId') routeId: string, @Body('officerId') officerId: string, @Request() req: any) { return this.svc.startRun(routeId, officerId, req.user.companyId); }

  @Post('patrol-runs/:id/scan') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Scan a checkpoint' })
  async scan(@Param('id') id: string, @Body('checkpointId') checkpointId: string, @Request() req: any) { return this.svc.scanCheckpoint(id, checkpointId, req.user.companyId); }

  @Post('patrol-runs/:id/complete') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Complete a patrol run' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.completeRun(id, req.user.companyId); }

  @Get('patrol-runs') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List patrol runs' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.getRuns(req.user.companyId, query); }
}
