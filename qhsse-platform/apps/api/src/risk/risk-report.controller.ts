import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';
import { CreateRiskDto, UpdateRiskDto, RiskQueryDto } from './dto/create-risk.dto';

@ApiTags('Risk Register') @ApiBearerAuth() @Controller('risks')
export class RiskReportController {
  constructor(private readonly svc: RiskService) {}

  @Post() @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create risk' })
  async create(@Body() dto: CreateRiskDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('risk.view') @ApiOperation({ summary: 'List risks' })
  async findAll(@Request() req: any, @Query() q: RiskQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get risk detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Update risk' })
  async update(@Param('id') id: string, @Body() dto: UpdateRiskDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId, req.user.id); }

  @Delete(':id') @RequiredPermissions('risk.delete') @ApiOperation({ summary: 'Delete risk' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId, req.user.id); }

  @Post(':id/submit') @RequiredPermissions('risk.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit risk' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId, req.user.id); }
}
