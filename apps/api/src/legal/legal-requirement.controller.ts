import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalRequirementService } from './legal-requirement.service';

@ApiTags('Legal & Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalRequirementController {
  constructor(private readonly svc: LegalRequirementService) {}

  @Get('requirements') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List legal requirements' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('requirements/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get legal requirement' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('requirements') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create legal requirement' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('requirements/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update legal requirement' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('requirements/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete legal requirement' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
