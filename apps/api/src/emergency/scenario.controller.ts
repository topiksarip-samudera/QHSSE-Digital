import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ScenarioService } from './scenario.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class ScenarioController {
  constructor(private readonly svc: ScenarioService) {}

  @Post('scenarios') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create emergency scenario' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get('scenarios') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List emergency scenarios' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('scenarios/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get emergency scenario detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('scenarios/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update emergency scenario' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('scenarios/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete emergency scenario' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
