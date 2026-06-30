import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EvacuationRouteService } from './evacuation-route.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class EvacuationRouteController {
  constructor(private readonly svc: EvacuationRouteService) {}

  @Post('evacuation-routes') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create evacuation route' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId); }

  @Get('evacuation-routes') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List evacuation routes' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('evacuation-routes/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get evacuation route detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('evacuation-routes/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update evacuation route' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('evacuation-routes/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete evacuation route' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
