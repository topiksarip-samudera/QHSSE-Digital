import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto, TemplateQueryDto, CreateCategoryDto, CreateAssignmentDto } from './dto/template.dto';

@ApiTags('Template Management') @ApiBearerAuth() @Controller('templates')
export class TemplateController {
  constructor(private readonly svc: TemplateService) {}

  @Post() @RequiredPermissions('template-management.create') @ApiOperation({ summary: 'Create template' })
  async create(@Body() dto: CreateTemplateDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('template-management.view') @ApiOperation({ summary: 'List templates' })
  async findAll(@Request() req: any, @Query() q: TemplateQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('template-management.view') @ApiOperation({ summary: 'Get template detail' })
  async findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Patch(':id') @RequiredPermissions('template-management.update') @ApiOperation({ summary: 'Update template' })
  async update(@Param('id') id: string, @Body() dto: UpdateTemplateDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('template-management.delete') @ApiOperation({ summary: 'Delete template' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/publish') @RequiredPermissions('template-management.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Publish template (creates version)' })
  async publish(@Param('id') id: string, @Request() req: any) { return this.svc.publish(id, req.user.companyId, req.user.id); }

  @Post(':id/clone') @RequiredPermissions('template-management.create') @HttpCode(HttpStatus.CREATED) @ApiOperation({ summary: 'Clone template' })
  async clone(@Param('id') id: string, @Request() req: any) { return this.svc.clone(id, req.user.companyId, req.user.id); }

  @Post('categories') @RequiredPermissions('template-management.create') @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() dto: CreateCategoryDto, @Request() req: any) { return this.svc.createCategory(dto, req.user.companyId); }

  @Get('categories/list') @RequiredPermissions('template-management.view') @ApiOperation({ summary: 'List categories' })
  async getCategories(@Request() req: any) { return this.svc.getCategories(req.user.companyId); }

  @Post('assignments') @RequiredPermissions('template-management.create') @ApiOperation({ summary: 'Assign template to module/site' })
  async createAssignment(@Body() dto: CreateAssignmentDto, @Request() req: any) { return this.svc.createAssignment(dto, req.user.companyId, req.user.id); }

  @Get(':id/assignments') @RequiredPermissions('template-management.view') @ApiOperation({ summary: 'Get assignments for template' })
  async getAssignments(@Param('id') id: string) { return this.svc.getAssignments(id); }

  @Delete('assignments/:assignmentId') @RequiredPermissions('template-management.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove assignment' })
  async deleteAssignment(@Param('assignmentId') assignmentId: string) { return this.svc.deleteAssignment(assignmentId); }
}
