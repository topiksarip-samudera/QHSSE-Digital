import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalUpdateService } from './legal-update.service';
import { LegalLinkService } from './legal-link.service';
import { CreateUpdateLogDto, CreateLinkDto } from './dto/update-log.dto';

@ApiTags('Legal - Updates') @ApiBearerAuth() @Controller('legal')
export class LegalUpdateController {
  constructor(private readonly svc: LegalUpdateService) {}

  @Post('updates') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create regulatory update log' })
  async createUpdateLog(@Body() dto: CreateUpdateLogDto, @Request() req: any) { return this.svc.createUpdateLog(dto, req.user.companyId); }

  @Get('updates') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List update logs' })
  async listUpdateLogs(@Query() query: any, @Request() req: any) { return this.svc.findUpdateLogs(req.user.companyId, query); }

  @Get('updates/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get update log detail' })
  async getUpdateLog(@Param('id') id: string, @Request() req: any) { return this.svc.findUpdateLog(id, req.user.companyId); }

  @Patch('updates/:id/review') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Review update log' })
  async reviewUpdate(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.reviewUpdate(id, req.user.companyId, req.user.id, d); }

  @Get('review-schedule') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get review schedule' })
  async getReviewSchedule(@Request() req: any) { return this.svc.getReviewSchedule(req.user.companyId); }

  @Get('calendar') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get compliance calendar' })
  async getCalendar(@Query('start') start: string, @Query('end') end: string, @Request() req: any) { return this.svc.getComplianceCalendar(req.user.companyId, start, end); }
}

@ApiTags('Legal - Links') @ApiBearerAuth() @Controller('legal')
export class LegalLinkController {
  constructor(private readonly svc: LegalLinkService) {}

  @Post('links') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create cross-module link' })
  async createLink(@Body() dto: CreateLinkDto, @Request() req: any) { return this.svc.createLink(dto, req.user.companyId); }

  @Get('links') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List links' })
  async listLinks(@Query() query: any, @Request() req: any) { return this.svc.findLinks(req.user.companyId, query); }

  @Delete('links/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete link' })
  async deleteLink(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }

  @Get('regulations/:id/cross-module') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Cross-module view for regulation' })
  async crossModule(@Param('id') id: string, @Request() req: any) { return this.svc.getCrossModuleView(id, req.user.companyId); }
}
