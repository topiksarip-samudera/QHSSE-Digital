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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIConversationService } from './ai-conversation.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  CreateConversationDto,
  UpdateConversationDto,
  SendMessageDto,
  ListConversationsQueryDto,
  ExportConversationDto,
} from './dto/conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Conversations')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AIConversationController {
  constructor(private readonly conversationService: AIConversationService) {}

  // ─── Workspaces ─────────────────────────────────────────────────────────────

  @Post('workspaces')
  @RequiredPermissions('ai.chat')
  @ApiOperation({ summary: 'Create workspace' })
  async createWorkspace(@Request() req, @Body() dto: CreateWorkspaceDto) {
    return this.conversationService.createWorkspace(req.user.companyId, req.user.id, dto);
  }

  @Get('workspaces')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List workspaces' })
  async listWorkspaces(@Request() req) {
    return this.conversationService.listWorkspaces(req.user.companyId, req.user.id);
  }

  @Patch('workspaces/:id')
  @RequiredPermissions('ai.chat')
  @ApiOperation({ summary: 'Update workspace' })
  async updateWorkspace(@Request() req, @Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.conversationService.updateWorkspace(id, req.user.companyId, req.user.id, dto);
  }

  // ─── Conversations ──────────────────────────────────────────────────────────

  @Post('conversations')
  @RequiredPermissions('ai.chat')
  @ApiOperation({ summary: 'Create conversation' })
  async createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    return this.conversationService.createConversation(req.user.companyId, req.user.id, dto);
  }

  @Get('conversations')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List conversations' })
  async listConversations(@Request() req, @Query() query: ListConversationsQueryDto) {
    return this.conversationService.listConversations(req.user.companyId, req.user.id, query);
  }

  @Get('conversations/:id')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get conversation' })
  async getConversation(@Request() req, @Param('id') id: string) {
    return this.conversationService.getConversation(id, req.user.companyId, req.user.id);
  }

  @Patch('conversations/:id')
  @RequiredPermissions('ai.chat')
  @ApiOperation({ summary: 'Update conversation' })
  async updateConversation(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversationService.updateConversation(id, req.user.companyId, req.user.id, dto);
  }

  @Delete('conversations/:id')
  @RequiredPermissions('ai.delete_conversation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete conversation' })
  async deleteConversation(@Request() req, @Param('id') id: string) {
    return this.conversationService.deleteConversation(id, req.user.companyId, req.user.id);
  }

  // ─── Messages ───────────────────────────────────────────────────────────────

  @Get('conversations/:id/messages')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get messages' })
  async getMessages(
    @Request() req,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.conversationService.getMessages(id, req.user.companyId, req.user.id, page, limit);
  }

  @Post('conversations/:id/messages')
  @RequiredPermissions('ai.chat')
  @ApiOperation({ summary: 'Send message' })
  async sendMessage(@Request() req, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.conversationService.sendMessage(id, req.user.companyId, req.user.id, dto);
  }

  @Post('conversations/:id/export')
  @RequiredPermissions('ai.export_conversation')
  @ApiOperation({ summary: 'Export conversation' })
  async exportConversation(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ExportConversationDto,
  ) {
    return this.conversationService.exportConversation(id, req.user.companyId, req.user.id, dto.format);
  }
}
