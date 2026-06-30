import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIKnowledgeBaseService } from './ai-knowledge-base.service';
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
  UploadDocumentDto,
  UpdateDocumentDto,
  SearchRagDto,
  ListKnowledgeBasesQueryDto,
  ListDocumentsQueryDto,
} from './dto/knowledge-base.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Knowledge Base')
@ApiBearerAuth()
@Controller('ai/knowledge-bases')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AIKnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: AIKnowledgeBaseService) {}

  @Post()
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'Create knowledge base' })
  async create(@Request() req, @Body() dto: CreateKnowledgeBaseDto) {
    return this.knowledgeBaseService.createKnowledgeBase(req.user.companyId, req.user.id, dto);
  }

  @Get()
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List knowledge bases' })
  async list(@Request() req, @Query() query: ListKnowledgeBasesQueryDto) {
    return this.knowledgeBaseService.listKnowledgeBases(req.user.companyId, query);
  }

  @Get(':id')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get knowledge base' })
  async get(@Request() req, @Param('id') id: string) {
    return this.knowledgeBaseService.getKnowledgeBase(id, req.user.companyId);
  }

  @Patch(':id')
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'Update knowledge base' })
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateKnowledgeBaseDto) {
    return this.knowledgeBaseService.updateKnowledgeBase(id, req.user.companyId, dto);
  }

  @Delete(':id')
  @RequiredPermissions('ai.chat_with_documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete knowledge base' })
  async delete(@Request() req, @Param('id') id: string) {
    return this.knowledgeBaseService.deleteKnowledgeBase(id, req.user.companyId, req.user.id);
  }

  @Post(':id/documents')
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'Upload document' })
  async uploadDocument(@Request() req, @Param('id') id: string, @Body() dto: UploadDocumentDto) {
    return this.knowledgeBaseService.uploadDocument(id, req.user.companyId, req.user.id, dto);
  }

  @Get('documents')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List documents' })
  async listDocuments(@Request() req, @Query() query: ListDocumentsQueryDto) {
    return this.knowledgeBaseService.listDocuments(req.user.companyId, query);
  }

  @Get('documents/:id')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get document' })
  async getDocument(@Request() req, @Param('id') id: string) {
    return this.knowledgeBaseService.getDocument(id, req.user.companyId);
  }

  @Patch('documents/:id')
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'Update document' })
  async updateDocument(@Request() req, @Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.knowledgeBaseService.updateDocument(id, req.user.companyId, dto);
  }

  @Delete('documents/:id')
  @RequiredPermissions('ai.chat_with_documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete document' })
  async deleteDocument(@Request() req, @Param('id') id: string) {
    return this.knowledgeBaseService.deleteDocument(id, req.user.companyId);
  }

  @Post('documents/:id/index')
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'Index document' })
  async indexDocument(@Request() req, @Param('id') id: string) {
    return this.knowledgeBaseService.indexDocument(id, req.user.companyId);
  }

  @Post('rag/search')
  @RequiredPermissions('ai.chat_with_documents')
  @ApiOperation({ summary: 'RAG search' })
  async search(@Request() req, @Body() dto: SearchRagDto) {
    return this.knowledgeBaseService.searchRag(req.user.companyId, dto);
  }
}
