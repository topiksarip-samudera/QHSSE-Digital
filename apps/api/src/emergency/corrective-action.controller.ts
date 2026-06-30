import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { CorrectiveActionService } from './corrective-action.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class CorrectiveActionController {
  constructor(private readonly svc: CorrectiveActionService) {}

  @Post('corrective-actions') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create corrective action' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId); }

  @Get('corrective-actions') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List corrective actions' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('corrective-actions/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get corrective action detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('corrective-actions/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update corrective action' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Post('corrective-actions/:id/complete') @RequiredPermissions('emergency.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Mark corrective action as complete' })
  async complete(@Param('id') id: string, @Request() req: any) { return this.svc.complete(id, req.user.companyId); }

  @Delete('corrective-actions/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete corrective action' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
