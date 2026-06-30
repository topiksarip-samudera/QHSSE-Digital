import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentWasteService } from './waste.service';

@ApiTags('Environment Management') @ApiBearerAuth() @Controller('environment')
export class EnvironmentWasteController {
  constructor(private readonly svc: EnvironmentWasteService) {}

  @Get('waste') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List waste records' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('waste/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get waste record' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('waste') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create waste record' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('waste/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update waste record' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('waste/:id') @RequiredPermissions('env.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete waste record' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }

  @Post('waste/:id/manifests') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create waste manifest' })
  async createManifest(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.createManifest(id, d, req.user.companyId, req.user.id); }

  @Patch('waste/manifests/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update waste manifest' })
  async updateManifest(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateManifest(id, d, req.user.companyId); }
}
