import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, CommentQueryDto } from './dto/collaboration.dto';

@Injectable()
export class CollaborationService {
  constructor(private prisma: PrismaService) {}

  async getComments(module: string, recordType: string, recordId: string, companyId: string, query: CommentQueryDto) {
    const page = query.page || 1; const limit = query.limit || 50; const skip = (page - 1) * limit;
    const where: any = { companyId, module, recordType, recordId, parentId: null, deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          replies: {
            where: { deletedAt: null },
            include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, mentions: true, attachments: { include: { attachment: { include: { file: { select: { originalName: true } } } } } } },
            orderBy: { createdAt: 'asc' },
          },
          mentions: true,
          attachments: { include: { attachment: { include: { file: { select: { originalName: true, id: true, mimeType: true } } } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
      }),
      this.prisma.comment.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(module: string, recordType: string, recordId: string, dto: CreateCommentDto, companyId: string, userId: string) {
    const comment = await this.prisma.comment.create({
      data: { companyId, module, recordType, recordId, parentId: dto.parentId, userId, content: dto.content, isInternal: dto.isInternal || false },
    });
    if (dto.mentionUserIds) {
      for (const mentionedId of dto.mentionUserIds) {
        await this.prisma.commentMention.create({ data: { commentId: comment.id, userId: mentionedId } });
      }
    }
    if (dto.attachmentIds) {
      for (const attId of dto.attachmentIds) {
        await this.prisma.commentAttachment.create({ data: { commentId: comment.id, attachmentId: attId } });
      }
    }
    return this.prisma.comment.findUnique({
      where: { id: comment.id },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, replies: true, mentions: true, attachments: { include: { attachment: { include: { file: true } } } } },
    });
  }

  async softDelete(id: string, companyId: string) {
    const c = await this.prisma.comment.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Not found');
    if (c.companyId !== companyId) throw new ForbiddenException('Access denied');
    await this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }
}
