import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalApplicabilityService } from './legal-applicability.service';

@ApiTags('Legal & Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalApplicabilityController {
  constructor(private readonly svc: LegalApplicabilityService) {}

  @Get('applicability') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'List applicability matrix' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get('applicability/:id') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get applicability entry' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post('applicability') @RequiredPermissions('legal.create') @ApiOperation({ summary: 'Create applicability mapping' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Patch('applicability/:id') @RequiredPermissions('legal.update') @ApiOperation({ summary: 'Update applicability mapping' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete('applicability/:id') @RequiredPermissions('legal.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete applicability mapping' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.delete(id, req.user.companyId); }
}
