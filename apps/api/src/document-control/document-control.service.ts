import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentControlService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: string, userId: string) {
    return this.prisma.document.create({
      data: { companyId, title: data.title, description: data.description, documentTypeId: data.documentTypeId,
        categoryId: data.categoryId, ownerId: data.ownerId || userId, siteIds: data.siteIds || [], departmentIds: data.departmentIds || [],
        confidentialityId: data.confidentialityId, reviewFrequencyId: data.reviewFrequencyId,
        nextReviewDate: data.nextReviewDate ? new Date(data.nextReviewDate) : null, createdBy: userId,
      },
    });
  }

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.status) where.status = query.status;
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.document.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async findOne(id: string, companyId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc || doc.companyId !== companyId) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, data: any, companyId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'draft') throw new ForbiddenException('Only draft documents can be edited');
    if (data.nextReviewDate) data.nextReviewDate = new Date(data.nextReviewDate);
    return this.prisma.document.update({ where: { id }, data });
  }

  async softDelete(id: string, companyId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'draft') throw new ForbiddenException('Only drafts can be deleted');
    await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true };
  }

  async submit(id: string, companyId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'draft') throw new ForbiddenException('Only drafts can be submitted');
    return this.prisma.document.update({ where: { id }, data: { status: 'submitted' } });
  }

  // ─── Revisions & Files ────────────────────────────────────────────────

  async createRevision(documentId: string, data: { changeSummary?: string; fileId?: string }, companyId: string, userId: string) {
    const doc = await this.findOne(documentId, companyId);
    const count = await this.prisma.documentRevision.count({ where: { documentId } });
    return this.prisma.documentRevision.create({ data: { documentId, companyId, revisionNumber: count + 1, changeSummary: data.changeSummary, fileId: data.fileId, createdBy: userId } });
  }

  async getRevisions(documentId: string) {
    return this.prisma.documentRevision.findMany({ where: { documentId }, orderBy: { revisionNumber: 'desc' } });
  }

  async addFile(documentId: string, data: { attachmentId: string; fileName: string; fileSize?: number; fileType?: string; revisionId?: string }, companyId: string, userId: string) {
    return this.prisma.documentFile.create({ data: { documentId, revisionId: data.revisionId, companyId, attachmentId: data.attachmentId, fileName: data.fileName, fileSize: data.fileSize || 0, fileType: data.fileType, uploadedBy: userId } });
  }

  async getFiles(documentId: string) {
    return this.prisma.documentFile.findMany({ where: { documentId }, orderBy: { createdAt: 'desc' } });
  }

  // ─── Review & Approval ───────────────────────────────────────────────

  async approveDocument(id: string, companyId: string, userId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'submitted') throw new ForbiddenException('Cannot approve in current status');
    await this.prisma.document.update({ where: { id }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
    return this.findOne(id, companyId);
  }

  async rejectDocument(id: string, companyId: string, reason?: string) {
    const doc = await this.findOne(id, companyId);
    if (!['submitted', 'under_review'].includes(doc.status)) throw new ForbiddenException('Cannot reject');
    await this.prisma.document.update({ where: { id }, data: { status: 'draft' } });
    return this.findOne(id, companyId);
  }

  async publishDocument(id: string, companyId: string, userId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'approved') throw new ForbiddenException('Only approved documents can be published');
    await this.prisma.document.update({ where: { id }, data: { status: 'published', approvedBy: userId, approvedAt: new Date() } });
    return this.findOne(id, companyId);
  }

  // ─── Distribution & Acknowledgement ───────────────────────────────────

  async addDistribution(documentId: string, data: { targetType: string; targetIds: string[] }, companyId: string) {
    await this.findOne(documentId, companyId);
    return this.prisma.documentDistribution.createMany({ data: data.targetIds.map(targetId => ({ documentId, companyId, targetType: data.targetType, targetId })) });
  }

  async getDistributions(documentId: string) {
    return this.prisma.documentDistribution.findMany({ where: { documentId } });
  }

  async acknowledgeDocument(documentId: string, companyId: string, userId: string) {
    await this.findOne(documentId, companyId);
    return this.prisma.documentAcknowledgement.upsert({
      where: { documentId_userId: { documentId, userId } },
      create: { documentId, companyId, userId },
      update: { acknowledgedAt: new Date() },
    });
  }

  // ─── Obsolete & Archive ───────────────────────────────────────────────

  async markObsolete(id: string, companyId: string, reason?: string) {
    const doc = await this.findOne(id, companyId);
    if (['published', 'cancelled'].includes(doc.status)) throw new ForbiddenException('Cannot obsolete');
    await this.prisma.document.update({ where: { id }, data: { status: 'obsolete', obsoleteReason: reason } });
    return { success: true };
  }

  async archiveDocument(id: string, companyId: string, reason?: string) {
    const doc = await this.findOne(id, companyId);
    await this.prisma.document.update({ where: { id }, data: { status: 'archived', archiveReason: reason } });
    return { success: true };
  }

  async restoreDocument(id: string, companyId: string) {
    const doc = await this.findOne(id, companyId);
    if (doc.status !== 'archived') throw new ForbiddenException('Only archived can be restored');
    await this.prisma.document.update({ where: { id }, data: { status: 'draft' } });
    return { success: true };
  }
}
