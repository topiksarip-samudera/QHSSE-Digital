import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { NumberingService } from './numbering.service';
import { CreateNumberingRuleDto, UpdateNumberingRuleDto, NumberingQueryDto, GenerateNumberDto } from './dto/numbering.dto';

@ApiTags('Numbering Generator') @ApiBearerAuth() @Controller('numbering-rules')
export class NumberingController {
  constructor(private readonly svc: NumberingService) {}

  @Post() @RequiredPermissions('numbering-format-generator.create') @ApiOperation({ summary: 'Create numbering rule' })
  async create(@Body() dto: CreateNumberingRuleDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('numbering-format-generator.view') @ApiOperation({ summary: 'List rules' })
  async findAll(@Request() req: any, @Query() q: NumberingQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('numbering-format-generator.view') @ApiOperation({ summary: 'Get rule detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('numbering-format-generator.update') @ApiOperation({ summary: 'Update rule' })
  async update(@Param('id') id: string, @Body() dto: UpdateNumberingRuleDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('numbering-format-generator.delete') @ApiOperation({ summary: 'Delete rule' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/preview') @RequiredPermissions('numbering-format-generator.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Preview next number' })
  async preview(@Param('id') id: string, @Request() req: any) { return this.svc.preview(id, req.user.companyId); }

  @Post(':id/generate') @RequiredPermissions('numbering-format-generator.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Generate next number for record' })
  async generate(@Param('id') id: string, @Body() dto: GenerateNumberDto, @Request() req: any) { return this.svc.generateNumber(id, req.user.companyId, dto, req.user.id); }

  @Post('counters/:counterId/reset') @RequiredPermissions('numbering-format-generator.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reset counter' })
  async resetCounter(@Body('ruleId') ruleId: string, @Param('counterId') counterId: string, @Request() req: any) { return this.svc.resetCounter(ruleId, counterId, req.user.companyId); }
}
