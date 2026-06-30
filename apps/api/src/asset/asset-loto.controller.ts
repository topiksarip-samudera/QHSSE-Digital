import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetLotoService } from './asset-loto.service';

@ApiTags('Asset & Equipment') @ApiBearerAuth() @Controller('asset')
export class AssetLotoController {
  constructor(private readonly svc: AssetLotoService) {}

  @Get('loto-points') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'List LOTO points' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('loto-points/:id') @RequiredPermissions('asset.view') @ApiOperation({ summary: 'Get LOTO point' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('loto-points') @RequiredPermissions('asset.create') @ApiOperation({ summary: 'Create LOTO point' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('loto-points/:id') @RequiredPermissions('asset.update') @ApiOperation({ summary: 'Update LOTO point' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Post('loto-points/:id/verify') @RequiredPermissions('asset.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify LOTO point' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verify(id, req.user.id, req.user.companyId); }

  @Delete('loto-points/:id') @RequiredPermissions('asset.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete LOTO point' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
