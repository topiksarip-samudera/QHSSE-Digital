import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetIsolationService } from './asset-isolation.service';

@ApiTags('Asset & Equipment') @ApiBearerAuth() @Controller('asset')
export class AssetIsolationController {
  constructor(private readonly svc: AssetIsolationService) {}

  @Get('isolation-points') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List isolation points' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('isolation-points/:id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get isolation point' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('isolation-points') @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create isolation point' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('isolation-points/:id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update isolation point' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Post('isolation-points/:id/verify') @RequiredPermissions('asset.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify isolation point' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verify(id, req.user.id, req.user.companyId); }

  @Delete('isolation-points/:id') @RequiredPermissions('asset.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete isolation point' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
