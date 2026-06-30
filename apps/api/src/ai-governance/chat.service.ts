import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(data: { title: string; moduleKey?: string; sourceRecordId?: string }, companyId: string, userId: string) {
    return this.prisma.chatConversation.create({ data: { title: data.title, moduleKey: data.moduleKey, sourceRecordId: data.sourceRecordId, companyId, createdBy: userId } });
  }

  async getConversations(companyId: string, query?: { moduleKey?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.moduleKey) where.moduleKey = query.moduleKey;
    return this.prisma.chatConversation.findMany({ where, orderBy: { updatedAt: 'desc' }, include: { _count: { select: { messages: true } } }, take: 50 });
  }

  async getConversation(id: string, companyId: string) {
    const conv = await this.prisma.chatConversation.findFirst({ where: { id, companyId }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async deleteConversation(id: string, companyId: string) {
    return this.prisma.chatConversation.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addMessage(conversationId: string, data: { role: string; content: string; tokens?: number; model?: string; cost?: number }, companyId: string, userId: string) {
    await this.prisma.chatConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return this.prisma.chatMessage.create({ data: { conversationId, companyId, role: data.role, content: data.content, tokens: data.tokens, model: data.model, cost: data.cost, createdBy: userId } });
  }

  async getMessages(conversationId: string, companyId: string) {
    return this.prisma.chatMessage.findMany({ where: { conversationId, companyId }, orderBy: { createdAt: 'asc' } });
  }

  async exportConversation(id: string, companyId: string) {
    const conv = await this.getConversation(id, companyId);
    const text = conv.messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    return { conversation: conv.title, exportedAt: new Date().toISOString(), messages: conv.messages.length, text };
  }
}
