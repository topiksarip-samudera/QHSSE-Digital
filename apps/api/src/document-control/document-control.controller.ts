import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { DocumentControlService } from './document-control.service';

@ApiTags('Document Control') @ApiBearerAuth() @Controller('document-control')
export class DocumentControlController {
  constructor(private readonly svc: DocumentControlService) {}

  @Get('settings') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get document settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }
  @Patch('settings') @RequiredPermissions('doc.manage_settings') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() d: any, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, d); }

  @Get('master-data') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }
  @Post('master-data/seed-defaults') @RequiredPermissions('doc.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
