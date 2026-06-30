import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  CreateConversationDto,
  UpdateConversationDto,
  SendMessageDto,
  ListConversationsQueryDto,
} from './dto/conversation.dto';

@Injectable()
export class AIConversationService {
  constructor(private prisma: PrismaService) {}

  // ─── Workspace Management ───────────────────────────────────────────────────

  async createWorkspace(companyId: string, userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.aIWorkspace.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        ownerId: userId,
        visibility: dto.visibility,
      },
    });
  }

  async listWorkspaces(companyId: string, userId: string) {
    return this.prisma.aIWorkspace.findMany({
      where: {
        companyId,
        isArchived: false,
        OR: [
          { ownerId: userId },
          { visibility: 'company' },
          { visibility: 'team' },
        ],
      },
      include: {
        _count: {
          select: { conversations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateWorkspace(workspaceId: string, companyId: string, userId: string, dto: UpdateWorkspaceDto) {
    const workspace = await this.prisma.aIWorkspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.companyId !== companyId) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only workspace owner can update');
    }

    return this.prisma.aIWorkspace.update({
      where: { id: workspaceId },
      data: dto,
    });
  }

  // ─── Conversation Management ────────────────────────────────────────────────

  async createConversation(companyId: string, userId: string, dto: CreateConversationDto) {
    return this.prisma.aIConversation.create({
      data: {
        companyId,
        workspaceId: dto.workspaceId,
        title: dto.title,
        mode: dto.mode,
        moduleKey: dto.moduleKey,
        sourceRecordId: dto.sourceRecordId,
        visibility: dto.visibility,
        ownerId: userId,
        systemPrompt: dto.systemPrompt,
        temperature: dto.temperature,
        maxTokens: dto.maxTokens,
        enableRag: dto.enableRag,
        enableModuleData: dto.enableModuleData,
      },
    });
  }

  async listConversations(companyId: string, userId: string, query: ListConversationsQueryDto) {
    const { page = 1, limit = 20, workspaceId, mode, moduleKey, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      status: status || 'active',
      OR: [
        { ownerId: userId },
        { visibility: 'shared' },
        { visibility: 'team' },
      ],
    };

    if (workspaceId) where.workspaceId = workspaceId;
    if (mode) where.mode = mode;
    if (moduleKey) where.moduleKey = moduleKey;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [conversations, total] = await Promise.all([
      this.prisma.aIConversation.findMany({
        where,
        include: {
          workspace: {
            select: { id: true, name: true },
          },
          _count: {
            select: { messages: true },
          },
        },
        skip,
        take: limit,
        orderBy: { lastMessageAt: 'desc' },
      }),
      this.prisma.aIConversation.count({ where }),
    ]);

    return {
      data: conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getConversation(conversationId: string, companyId: string, userId: string) {
    const conversation = await this.prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        workspace: true,
      },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new NotFoundException('Conversation not found');
    }

    // Check access permission
    const hasAccess =
      conversation.ownerId === userId ||
      conversation.visibility === 'shared' ||
      conversation.visibility === 'team';

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async updateConversation(
    conversationId: string,
    companyId: string,
    userId: string,
    dto: UpdateConversationDto,
  ) {
    const conversation = await this.getConversation(conversationId, companyId, userId);

    if (conversation.ownerId !== userId) {
      throw new ForbiddenException('Only conversation owner can update');
    }

    return this.prisma.aIConversation.update({
      where: { id: conversationId },
      data: dto,
    });
  }

  async deleteConversation(conversationId: string, companyId: string, userId: string) {
    const conversation = await this.getConversation(conversationId, companyId, userId);

    if (conversation.ownerId !== userId) {
      throw new ForbiddenException('Only conversation owner can delete');
    }

    return this.prisma.aIConversation.update({
      where: { id: conversationId },
      data: {
        status: 'deleted',
        deletedAt: new Date(),
      },
    });
  }

  // ─── Message Management ─────────────────────────────────────────────────────

  async getMessages(conversationId: string, companyId: string, userId: string, page = 1, limit = 50) {
    await this.getConversation(conversationId, companyId, userId);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.aIMessage.findMany({
        where: { conversationId },
        include: {
          sources: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.aIMessage.count({ where: { conversationId } }),
    ]);

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(conversationId: string, companyId: string, userId: string, dto: SendMessageDto) {
    const conversation = await this.getConversation(conversationId, companyId, userId);

    // Create user message
    const userMessage = await this.prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: dto.content,
      },
    });

    // TODO: Implement actual AI response generation
    // For now, create a mock assistant response
    const assistantMessage = await this.prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: 'AI response generation not yet implemented. This is a placeholder response.',
        model: dto.model || conversation.systemPrompt?.includes('gpt') ? 'gpt-4' : 'claude-3-opus',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        costEstimate: 0.003,
        latencyMs: 1500,
        guardrailStatus: 'passed',
      },
    });

    // Update conversation stats
    await this.prisma.aIConversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 2 },
        totalTokens: { increment: 150 },
        totalCost: { increment: 0.003 },
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }

  async exportConversation(conversationId: string, companyId: string, userId: string, format: string) {
    const conversation = await this.getConversation(conversationId, companyId, userId);
    const messages = await this.prisma.aIMessage.findMany({
      where: { conversationId },
      include: { sources: true },
      orderBy: { createdAt: 'asc' },
    });

    // TODO: Implement actual export formatting
    return {
      conversation,
      messages,
      exportedAt: new Date(),
      format,
    };
  }
}
