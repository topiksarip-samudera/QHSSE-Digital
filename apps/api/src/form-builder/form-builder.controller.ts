import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { FormBuilderService } from './form-builder.service';
import { CreateFormDto, UpdateFormDto, FormQueryDto, SubmitFormDto } from './dto/form-builder.dto';

@ApiTags('Form Builder')
@ApiBearerAuth()
@Controller('forms')
export class FormBuilderController {
  constructor(private readonly formService: FormBuilderService) {}

  @Post()
  @RequiredPermissions('form-builder.create')
  @ApiOperation({ summary: 'Create a new form' })
  async create(@Body() dto: CreateFormDto, @Request() req: any) {
    return this.formService.create(dto, req.user.companyId, req.user.id);
  }

  @Get()
  @RequiredPermissions('form-builder.view')
  @ApiOperation({ summary: 'List forms' })
  async findAll(@Request() req: any, @Query() query: FormQueryDto) {
    return this.formService.findAll(req.user.companyId, query);
  }

  @Get(':id')
  @RequiredPermissions('form-builder.view')
  @ApiOperation({ summary: 'Get form detail with sections and fields' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.formService.getFormDetail(id, req.user.companyId);
  }

  @Patch(':id')
  @RequiredPermissions('form-builder.update')
  @ApiOperation({ summary: 'Update form (draft only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateFormDto, @Request() req: any) {
    return this.formService.update(id, dto, req.user.companyId, req.user.id);
  }

  @Delete(':id')
  @RequiredPermissions('form-builder.delete')
  @ApiOperation({ summary: 'Soft delete form' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.formService.softDelete(id, req.user.companyId);
  }

  @Post(':id/publish')
  @RequiredPermissions('form-builder.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish form (creates new version snapshot)' })
  async publish(@Param('id') id: string, @Request() req: any) {
    return this.formService.publish(id, req.user.companyId, req.user.id);
  }

  @Post(':id/clone')
  @RequiredPermissions('form-builder.create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Clone form' })
  async clone(@Param('id') id: string, @Request() req: any) {
    return this.formService.clone(id, req.user.companyId, req.user.id);
  }

  @Post('submissions')
  @RequiredPermissions('form-builder.view')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit form data' })
  async submit(@Body() dto: SubmitFormDto, @Request() req: any) {
    return this.formService.submit(dto, req.user.companyId, req.user.id);
  }

  @Get(':id/submissions')
  @RequiredPermissions('form-builder.view')
  @ApiOperation({ summary: 'Get submissions for a form' })
  async getSubmissions(@Param('id') id: string, @Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.formService.getSubmissions(id, req.user.companyId, page, limit);
  }

  @Get('submissions/:submissionId')
  @RequiredPermissions('form-builder.view')
  @ApiOperation({ summary: 'Get submission detail' })
  async getSubmissionDetail(@Param('submissionId') submissionId: string, @Request() req: any) {
    return this.formService.getSubmissionDetail(submissionId, req.user.companyId);
  }
}
