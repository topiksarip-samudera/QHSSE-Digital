import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AiGovernanceService } from './ai-governance.service';
import { UpdateAiSettingsDto, CreatePromptTemplateDto, CreateKnowledgeSourceDto, CreateOutputReviewDto, QueryDto } from './dto/ai-governance.dto';

@ApiTags('AI Governance') @ApiBearerAuth() @Controller('ai')
export class AiGovernanceController {
  constructor(private readonly svc: AiGovernanceService) {}

  @Get('settings') @RequiredPermissions('ai-governance.view') @ApiOperation({ summary: 'Get AI settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }
  @Patch('settings') @RequiredPermissions('ai-governance.update') @ApiOperation({ summary: 'Update AI settings' })
  async updateSettings(@Body() dto: UpdateAiSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Post('prompt-templates') @RequiredPermissions('ai-governance.create') @ApiOperation({ summary: 'Create prompt template' })
  async createPromptTemplate(@Body() dto: CreatePromptTemplateDto, @Request() req: any) { return this.svc.createPromptTemplate(dto, req.user.companyId, req.user.id); }
  @Get('prompt-templates') @RequiredPermissions('ai-governance.view') @ApiOperation({ summary: 'Get prompt templates' })
  async getPromptTemplates(@Request() req: any, @Query('module') module?: string) { return this.svc.getPromptTemplates(req.user.companyId, module); }
  @Delete('prompt-templates/:id') @RequiredPermissions('ai-governance.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete prompt template' })
  async deletePromptTemplate(@Param('id') id: string) { return this.svc.deletePromptTemplate(id); }

  @Post('knowledge-sources') @RequiredPermissions('ai-governance.create') @ApiOperation({ summary: 'Add knowledge source' })
  async createKnowledgeSource(@Body() dto: CreateKnowledgeSourceDto, @Request() req: any) { return this.svc.createKnowledgeSource(dto, req.user.companyId, req.user.id); }
  @Get('knowledge-sources') @RequiredPermissions('ai-governance.view') @ApiOperation({ summary: 'Get knowledge sources' })
  async getKnowledgeSources(@Request() req: any) { return this.svc.getKnowledgeSources(req.user.companyId); }

  @Get('usage-logs') @RequiredPermissions('ai-governance.view') @ApiOperation({ summary: 'Get AI usage logs' })
  async getUsageLogs(@Request() req: any, @Query() q: QueryDto) { return this.svc.getUsageLogs(req.user.companyId, q); }

  @Post('output-reviews') @RequiredPermissions('ai-governance.create') @ApiOperation({ summary: 'Review AI output' })
  async createOutputReview(@Body() dto: CreateOutputReviewDto, @Request() req: any) { return this.svc.createOutputReview(dto, req.user.companyId, req.user.id); }

  @Get('provider-config') @RequiredPermissions('ai-governance.view') @ApiOperation({ summary: 'Get AI provider config' })
  async getProviderConfig(@Request() req: any) { return this.svc.getProviderConfig(req.user.companyId); }
  @Post('provider-config') @RequiredPermissions('ai-governance.update') @ApiOperation({ summary: 'Update AI provider config' })
  async updateProviderConfig(@Body() dto: any, @Request() req: any) { return this.svc.updateProviderConfig(req.user.companyId, dto); }
}
