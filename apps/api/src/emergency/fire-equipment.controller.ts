import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { FireEquipmentService } from './fire-equipment.service';

@ApiTags('Emergency Response') @ApiBearerAuth() @Controller('emergency')
export class FireEquipmentController {
  constructor(private readonly svc: FireEquipmentService) {}

  @Post('fire-equipment') @RequiredPermissions('emergency.create') @ApiOperation({ summary: 'Create fire equipment' })
  async create(@Body() dto: any, @Request() req: any) { return this.svc.create(dto, req.user.companyId); }

  @Get('fire-equipment') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List fire equipment' })
  async findAll(@Query() q: any, @Request() req: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('fire-equipment/due') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'List fire equipment due for inspection' })
  async findDue(@Query() q: any, @Request() req: any) { return this.svc.findDue(req.user.companyId, q); }

  @Get('fire-equipment/:id') @RequiredPermissions('emergency.view') @ApiOperation({ summary: 'Get fire equipment detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('fire-equipment/:id') @RequiredPermissions('emergency.update') @ApiOperation({ summary: 'Update fire equipment' })
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('fire-equipment/:id') @RequiredPermissions('emergency.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete fire equipment' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
