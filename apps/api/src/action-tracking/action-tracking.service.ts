import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateActionDto,
  UpdateActionDto,
  ActionQueryDto,
  CreateCommentDto,
  VerifyActionDto,
} from './dto/action-tracking.dto';

@Injectable()
export class ActionTrackingService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  async create(dto: CreateActionDto, companyId: string, userId: string) {
    const action = await this.prisma.action.create({
      data: {
        companyId,
        title: dto.title,
        description: dto.description,
        assignedTo: dto.assignedTo,
        priority: dto.priority || 'medium',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        sourceType: dto.sourceType,
        sourceId: dto.sourceId,
        siteId: dto.siteId,
        createdBy: userId,
        status: 'draft',
      },
    });

    await this.createHistory(action.id, companyId, userId, 'created', null, 'draft');

    return action;
  }

  async findAll(companyId: string, query: ActionQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.assignedTo) where.assignedTo = query.assignedTo;
    if (query.sourceType) where.sourceType = query.sourceType;

    if (query.overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { notIn: ['closed', 'cancelled'] };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.action.findMany({
        where,
        include: {
          assignee: { select: { id: true, email: true, firstName: true, lastName: true } },
          creator: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { comments: true, evidences: true, verifications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.action.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, companyId: string) {
    const action = await this.prisma.action.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, email: true, firstName: true, lastName: true } },
        creator: { select: { id: true, email: true, firstName: true, lastName: true } },
        comments: {
          where: { deletedAt: null },
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'asc' },
        },
        evidences: {
          where: { deletedAt: null },
          include: { attachment: { include: { file: true } }, uploader: { select: { id: true, email: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        verifications: {
          where: { deletedAt: null },
          include: { verifier: { select: { id: true, email: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        histories: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!action) throw new NotFoundException('Action not found');
    if (action.companyId !== companyId) throw new ForbiddenException('Access denied');
    if (action.deletedAt) throw new NotFoundException('Action has been deleted');

    return action;
  }

  async update(id: string, dto: UpdateActionDto, companyId: string, userId: string) {
    const action = await this.findOne(id, companyId);

    const oldStatus = action.status;
    const newStatus = dto.status || oldStatus;

    const updated = await this.prisma.action.update({
      where: { id },
      data: {
        title: dto.title ?? action.title,
        description: dto.description !== undefined ? dto.description : action.description,
        assignedTo: dto.assignedTo || action.assignedTo,
        priority: dto.priority || action.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : action.dueDate,
        status: newStatus,
        completedAt: newStatus === 'closed' && oldStatus !== 'closed' ? new Date() : action.completedAt,
        closedAt: newStatus === 'closed' && oldStatus !== 'closed' ? new Date() : action.closedAt,
      },
      include: {
        assignee: { select: { id: true, email: true, firstName: true, lastName: true } },
        creator: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (oldStatus !== newStatus) {
      await this.createHistory(id, companyId, userId, 'status_changed', oldStatus, newStatus);
    } else {
      await this.createHistory(id, companyId, userId, 'updated', null, null);
    }

    return updated;
  }

  async softDelete(id: string, companyId: string, userId: string) {
    await this.findOne(id, companyId);

    await this.prisma.action.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'cancelled' },
    });

    await this.createHistory(id, companyId, userId, 'deleted', null, null);

    return { success: true, id };
  }

  // ─── Comments ───────────────────────────────────────────────────────────────

  async addComment(id: string, dto: CreateCommentDto, companyId: string, userId: string) {
    await this.findOne(id, companyId);

    const comment = await this.prisma.actionComment.create({
      data: {
        actionId: id,
        companyId,
        userId,
        content: dto.content,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    await this.createHistory(id, companyId, userId, 'commented', null, null, dto.content);

    return comment;
  }

  // ─── Evidence ───────────────────────────────────────────────────────────────

  async addEvidence(
    actionId: string,
    attachmentId: string,
    companyId: string,
    userId: string,
    description?: string,
  ) {
    await this.findOne(actionId, companyId);

    const evidence = await this.prisma.actionEvidence.create({
      data: {
        actionId,
        companyId,
        attachmentId,
        uploadedBy: userId,
        description,
      },
      include: {
        attachment: { include: { file: true } },
        uploader: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    await this.createHistory(actionId, companyId, userId, 'evidence_added', null, null);

    return evidence;
  }

  async removeEvidence(evidenceId: string, companyId: string) {
    const evidence = await this.prisma.actionEvidence.findUnique({
      where: { id: evidenceId },
    });

    if (!evidence) throw new NotFoundException('Evidence not found');
    if (evidence.companyId !== companyId) throw new ForbiddenException('Access denied');

    return this.prisma.actionEvidence.update({
      where: { id: evidenceId },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Verification ───────────────────────────────────────────────────────────

  async submitForVerification(id: string, companyId: string, userId: string) {
    const action = await this.findOne(id, companyId);

    if (action.status !== 'draft' && action.status !== 'in_review' && action.status !== 'rejected') {
      throw new BadRequestException(`Cannot submit action with status: ${action.status}`);
    }

    await this.prisma.action.update({
      where: { id },
      data: { status: 'submitted' },
    });

    await this.createHistory(id, companyId, userId, 'submitted', action.status, 'submitted');

    return { success: true, id };
  }

  async verify(id: string, dto: VerifyActionDto, companyId: string, userId: string) {
    const action = await this.findOne(id, companyId);

    if (action.status !== 'submitted' && action.status !== 'in_review') {
      throw new BadRequestException(`Cannot verify action with status: ${action.status}`);
    }

    // Create verification record
    const verification = await this.prisma.actionVerification.create({
      data: {
        actionId: id,
        companyId,
        verifiedBy: userId,
        status: 'verified',
        notes: dto.notes,
        verifiedAt: new Date(),
      },
      include: {
        verifier: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    await this.prisma.action.update({
      where: { id },
      data: { status: 'closed', completedAt: new Date(), closedAt: new Date() },
    });

    await this.createHistory(id, companyId, userId, 'verified', action.status, 'closed', dto.notes);

    return verification;
  }

  async rejectVerification(id: string, dto: VerifyActionDto, companyId: string, userId: string) {
    const action = await this.findOne(id, companyId);

    if (action.status !== 'submitted' && action.status !== 'in_review') {
      throw new BadRequestException(`Cannot reject action with status: ${action.status}`);
    }

    const verification = await this.prisma.actionVerification.create({
      data: {
        actionId: id,
        companyId,
        verifiedBy: userId,
        status: 'rejected',
        notes: dto.notes,
        verifiedAt: new Date(),
      },
      include: {
        verifier: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    await this.prisma.action.update({
      where: { id },
      data: { status: 'rejected' },
    });

    await this.createHistory(id, companyId, userId, 'rejected', action.status, 'rejected', dto.notes);

    return verification;
  }

  // ─── History ────────────────────────────────────────────────────────────────

  private async createHistory(
    actionId: string,
    companyId: string,
    userId: string,
    event: string,
    oldStatus: string | null,
    newStatus: string | null,
    notes?: string,
  ) {
    return this.prisma.actionHistory.create({
      data: {
        actionId,
        companyId,
        userId,
        event,
        oldStatus,
        newStatus,
        notes: notes || null,
      },
    });
  }
}
