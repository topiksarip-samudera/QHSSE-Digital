import { Controller, Get, Post, Delete, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AiChatService } from './chat.service';

@ApiTags('AI Chat') @ApiBearerAuth() @Controller('ai')
export class AiChatController {
  constructor(private readonly svc: AiChatService) {}

  @Get('conversations') @RequiredPermissions('ai.view') @ApiOperation({ summary: 'List conversations' })
  async getConversations(@Request() req: any, @Query() q: any) { return this.svc.getConversations(req.user.companyId, q); }

  @Get('conversations/:id') @RequiredPermissions('ai.view') @ApiOperation({ summary: 'Get conversation with messages' })
  async getConversation(@Param('id') id: string, @Request() req: any) { return this.svc.getConversation(id, req.user.companyId); }

  @Post('conversations') @RequiredPermissions('ai.chat') @ApiOperation({ summary: 'Create conversation' })
  async createConversation(@Body() d: any, @Request() req: any) { return this.svc.createConversation(d, req.user.companyId, req.user.id); }

  @Delete('conversations/:id') @RequiredPermissions('ai.delete_conversation') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete conversation' })
  async deleteConversation(@Param('id') id: string, @Request() req: any) { return this.svc.deleteConversation(id, req.user.companyId); }

  @Post('conversations/:id/messages') @RequiredPermissions('ai.chat') @ApiOperation({ summary: 'Add message to conversation' })
  async addMessage(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addMessage(id, d, req.user.companyId, req.user.id); }

  @Get('conversations/:id/messages') @RequiredPermissions('ai.view') @ApiOperation({ summary: 'Get conversation messages' })
  async getMessages(@Param('id') id: string, @Request() req: any) { return this.svc.getMessages(id, req.user.companyId); }

  @Post('conversations/:id/export') @RequiredPermissions('ai.export_conversation') @ApiOperation({ summary: 'Export conversation' })
  async exportConversation(@Param('id') id: string, @Request() req: any) { return this.svc.exportConversation(id, req.user.companyId); }
}
