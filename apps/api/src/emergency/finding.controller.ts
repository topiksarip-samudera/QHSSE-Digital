import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { FindingService } from './finding.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class FindingController {
  constructor(private readonly svc: FindingService) {}

  @Post('findings') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create emergency finding' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get('findings') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List emergency findings' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('findings/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get emergency finding detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('findings/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update emergency finding' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('findings/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete emergency finding' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
