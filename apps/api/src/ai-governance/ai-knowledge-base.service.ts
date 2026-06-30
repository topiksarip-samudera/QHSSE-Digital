import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
  UploadDocumentDto,
  UpdateDocumentDto,
  SearchRagDto,
  ListKnowledgeBasesQueryDto,
  ListDocumentsQueryDto,
} from './dto/knowledge-base.dto';

@Injectable()
export class AIKnowledgeBaseService {
  constructor(private prisma: PrismaService) {}

  // ─── Knowledge Base Management ──────────────────────────────────────────────

  async createKnowledgeBase(companyId: string, userId: string, dto: CreateKnowledgeBaseDto) {
    return this.prisma.aIKnowledgeBase.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description,
        moduleKey: dto.moduleKey,
        visibility: dto.visibility,
        embeddingModel: dto.embeddingModel,
        chunkSize: dto.chunkSize,
        chunkOverlap: dto.chunkOverlap,
        createdBy: userId,
      },
    });
  }

  async listKnowledgeBases(companyId: string, query: ListKnowledgeBasesQueryDto) {
    const { page = 1, limit = 20, moduleKey, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (moduleKey) where.moduleKey = moduleKey;
    if (status) where.status = status;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [knowledgeBases, total] = await Promise.all([
      this.prisma.aIKnowledgeBase.findMany({
        where,
        include: {
          _count: {
            select: { documents: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIKnowledgeBase.count({ where }),
    ]);

    return {
      data: knowledgeBases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getKnowledgeBase(knowledgeBaseId: string, companyId: string) {
    const kb = await this.prisma.aIKnowledgeBase.findUnique({
      where: { id: knowledgeBaseId },
      include: {
        documents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!kb || kb.companyId !== companyId || kb.deletedAt) {
      throw new NotFoundException('Knowledge base not found');
    }

    return kb;
  }

  async updateKnowledgeBase(
    knowledgeBaseId: string,
    companyId: string,
    dto: UpdateKnowledgeBaseDto,
  ) {
    await this.getKnowledgeBase(knowledgeBaseId, companyId);

    return this.prisma.aIKnowledgeBase.update({
      where: { id: knowledgeBaseId },
      data: dto,
    });
  }

  async deleteKnowledgeBase(knowledgeBaseId: string, companyId: string, userId: string) {
    await this.getKnowledgeBase(knowledgeBaseId, companyId);

    return this.prisma.aIKnowledgeBase.update({
      where: { id: knowledgeBaseId },
      data: {
        deletedAt: new Date(),
        status: 'failed',
      },
    });
  }

  // ─── Document Management ────────────────────────────────────────────────────

  async uploadDocument(
    knowledgeBaseId: string,
    companyId: string,
    userId: string,
    dto: UploadDocumentDto,
  ) {
    await this.getKnowledgeBase(knowledgeBaseId, companyId);

    const document = await this.prisma.aIKnowledgeDocument.create({
      data: {
        knowledgeBaseId,
        companyId,
        title: dto.title,
        filename: dto.filename,
        mimeType: dto.mimeType,
        content: dto.content,
        sourceUrl: dto.sourceUrl,
        sourceType: dto.sourceUrl ? 'url' : 'upload',
        moduleKey: dto.moduleKey,
        recordId: dto.recordId,
        uploadedBy: userId,
      },
    });

    // Update knowledge base document count
    await this.prisma.aIKnowledgeBase.update({
      where: { id: knowledgeBaseId },
      data: {
        documentCount: { increment: 1 },
      },
    });

    return document;
  }

  async listDocuments(companyId: string, query: ListDocumentsQueryDto) {
    const { page = 1, limit = 20, knowledgeBaseId, isIndexed, sourceType, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      knowledgeBaseId,
      companyId,
      deletedAt: null,
    };

    if (isIndexed !== undefined) where.isIndexed = isIndexed;
    if (sourceType) where.sourceType = sourceType;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [documents, total] = await Promise.all([
      this.prisma.aIKnowledgeDocument.findMany({
        where,
        include: {
          _count: {
            select: { chunks: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIKnowledgeDocument.count({ where }),
    ]);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDocument(documentId: string, companyId: string) {
    const doc = await this.prisma.aIKnowledgeDocument.findUnique({
      where: { id: documentId },
      include: {
        knowledgeBase: true,
        chunks: {
          take: 5,
          include: {
            vectors: true,
          },
        },
      },
    });

    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async updateDocument(documentId: string, companyId: string, dto: UpdateDocumentDto) {
    await this.getDocument(documentId, companyId);

    return this.prisma.aIKnowledgeDocument.update({
      where: { id: documentId },
      data: dto,
    });
  }

  async deleteDocument(documentId: string, companyId: string) {
    const doc = await this.getDocument(documentId, companyId);

    // Delete document and update knowledge base count
    await this.prisma.$transaction([
      this.prisma.aIKnowledgeDocument.update({
        where: { id: documentId },
        data: { deletedAt: new Date() },
      }),
      this.prisma.aIKnowledgeBase.update({
        where: { id: doc.knowledgeBaseId },
        data: {
          documentCount: { decrement: 1 },
          chunkCount: { decrement: doc.chunkCount },
        },
      }),
    ]);

    return { success: true };
  }

  // ─── Document Indexing ──────────────────────────────────────────────────────

  async indexDocument(documentId: string, companyId: string) {
    const doc = await this.getDocument(documentId, companyId);
    const kb = await this.getKnowledgeBase(doc.knowledgeBaseId, companyId);

    if (!doc.content) {
      throw new BadRequestException('Document has no content to index');
    }

    // TODO: Implement actual chunking and embedding generation
    // For now, create mock chunks
    const chunks = this.chunkText(doc.content, kb.chunkSize, kb.chunkOverlap);

    // Create document chunks
    for (let i = 0; i < chunks.length; i++) {
      await this.prisma.aIDocumentChunk.create({
        data: {
          documentId,
          chunkIndex: i,
          content: chunks[i],
          startChar: 0,
          endChar: chunks[i].length,
          tokenCount: Math.ceil(chunks[i].length / 4),
        },
      });
    }

    // Update document and knowledge base
    await this.prisma.$transaction([
      this.prisma.aIKnowledgeDocument.update({
        where: { id: documentId },
        data: {
          isIndexed: true,
          chunkCount: chunks.length,
          indexedAt: new Date(),
        },
      }),
      this.prisma.aIKnowledgeBase.update({
        where: { id: kb.id },
        data: {
          chunkCount: { increment: chunks.length },
        },
      }),
    ]);

    return { success: true, chunksCreated: chunks.length };
  }

  // ─── RAG Search ─────────────────────────────────────────────────────────────

  async searchRag(companyId: string, dto: SearchRagDto) {
    // TODO: Implement actual vector similarity search
    // For now, return mock results
    return {
      query: dto.query,
      results: [],
      message: 'RAG search not yet implemented - requires vector database integration',
    };
  }

  // ─── Helper Methods ─────────────────────────────────────────────────────────

  private chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.substring(start, end));
      start += chunkSize - overlap;
    }

    return chunks;
  }
}
