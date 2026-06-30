import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { PatrolRouteService } from './patrol-route.service';

@ApiTags('Security Management') @ApiBearerAuth() @Controller('security')
export class PatrolRouteController {
  constructor(private readonly svc: PatrolRouteService) {}

  @Get('patrol-routes') @RequiredPermissions('security.view') @ApiOperation({ summary: 'List patrol routes' })
  async list(@Request() req: any) { return this.svc.findAll(req.user.companyId); }

  @Get('patrol-routes/:id') @RequiredPermissions('security.view') @ApiOperation({ summary: 'Get patrol route detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('patrol-routes') @RequiredPermissions('security.create') @ApiOperation({ summary: 'Create patrol route' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Patch('patrol-routes/:id') @RequiredPermissions('security.update') @ApiOperation({ summary: 'Update patrol route' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('patrol-routes/:id') @RequiredPermissions('security.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete patrol route' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
