import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto, UpdateChecklistDto, ChecklistQueryDto, SubmitChecklistDto } from './dto/checklist.dto';

@ApiTags('Checklist Builder')
@ApiBearerAuth()
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly svc: ChecklistService) {}

  @Post() @RequiredPermissions('checklist-builder.create') @ApiOperation({ summary: 'Create checklist' })
  async create(@Body() dto: CreateChecklistDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('checklist-builder.view') @ApiOperation({ summary: 'List checklists' })
  async findAll(@Request() req: any, @Query() q: ChecklistQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('checklist-builder.view') @ApiOperation({ summary: 'Get checklist detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.getDetail(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('checklist-builder.update') @ApiOperation({ summary: 'Update checklist' })
  async update(@Param('id') id: string, @Body() dto: UpdateChecklistDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId, req.user.id); }

  @Delete(':id') @RequiredPermissions('checklist-builder.delete') @ApiOperation({ summary: 'Delete checklist' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/publish') @RequiredPermissions('checklist-builder.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Publish checklist' })
  async publish(@Param('id') id: string, @Request() req: any) { return this.svc.publish(id, req.user.companyId, req.user.id); }

  @Post('responses') @RequiredPermissions('checklist-builder.view') @HttpCode(HttpStatus.CREATED) @ApiOperation({ summary: 'Submit checklist response' })
  async submit(@Body() dto: SubmitChecklistDto, @Request() req: any) { return this.svc.submit(dto, req.user.companyId, req.user.id); }

  @Get(':id/responses') @RequiredPermissions('checklist-builder.view') @ApiOperation({ summary: 'Get responses for checklist' })
  async getResponses(@Param('id') id: string, @Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) { return this.svc.getResponses(id, req.user.companyId, page, limit); }

  @Get('responses/:responseId') @RequiredPermissions('checklist-builder.view') @ApiOperation({ summary: 'Get response detail' })
  async getResponseDetail(@Param('responseId') responseId: string, @Request() req: any) { return this.svc.getResponseDetail(responseId, req.user.companyId); }
}
