import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalStandardService } from './legal-standard.service';

@ApiTags('Legal & Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalStandardController {
  constructor(private readonly svc: LegalStandardService) {}

  @Get('standards') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List legal standards' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('standards/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get legal standard' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('standards') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create legal standard' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('standards/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update legal standard' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('standards/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete legal standard' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
