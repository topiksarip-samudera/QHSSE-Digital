import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { BlacklistService } from './blacklist.service';

@ApiTags('Contractor Management') @ApiBearerAuth() @Controller('contractor/blacklist')
export class BlacklistController {
  constructor(private readonly svc: BlacklistService) {}

  @Get() @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List blacklist entries' })
  async findAll(@Request() req: any, @Query() query?: any) { return this.svc.findAll(req.user.companyId, query); }

  @Get(':id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get blacklist entry' })
  async findOne(@Request() req: any, @Param('id') id: string) { return this.svc.findOne(id, req.user.companyId); }

  @Post() @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Create blacklist entry' })
  async create(@Request() req: any, @Body() dto: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Patch(':id') @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Update blacklist entry' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Post(':id/remove') @HttpCode(200) @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Soft-remove blacklist entry' })
  async remove(@Request() req: any, @Param('id') id: string) { return this.svc.remove(id, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('contractor.delete') @ApiOperation({ summary: 'Delete blacklist entry' })
  async delete(@Request() req: any, @Param('id') id: string) { return this.svc.delete(id, req.user.companyId); }
}
