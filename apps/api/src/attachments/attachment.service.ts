import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadAttachmentDto, UpdateAttachmentDto, AttachmentQueryDto, CreateFileLinkDto } from './dto/create-attachment.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ─── Allowed file types & size limits ───────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

@Injectable()
export class AttachmentService {
  private uploadDir: string;

  constructor(private prisma: PrismaService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // ─── Upload ─────────────────────────────────────────────────────────────────

  async upload(
    file: Express.Multer.File,
    dto: UploadAttachmentDto,
    companyId: string,
    userId: string,
  ) {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const hash = crypto.createHash('md5').update(file.buffer).digest('hex');
    const uniqueFilename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Create File record
    const fileRecord = await this.prisma.file.create({
      data: {
        companyId,
        filename: uniqueFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        bucket: 'local',
        hash,
        uploadedBy: userId,
      },
    });

    // Create Attachment record linking file to record
    const attachment = await this.prisma.attachment.create({
      data: {
        companyId,
        recordType: dto.recordType,
        recordId: dto.recordId,
        fileId: fileRecord.id,
        description: dto.description,
        uploadedBy: userId,
      },
    });

    // Create additional file links if provided
    const fileLinks = [];
    if (dto.linkedRecords && dto.linkedRecords.length > 0) {
      for (const link of dto.linkedRecords) {
        const fileLink = await this.prisma.fileLink.create({
          data: {
            companyId,
            attachmentId: attachment.id,
            linkedModule: link.linkedModule,
            linkedRecordType: link.linkedRecordType,
            linkedRecordId: link.linkedRecordId,
            linkContext: link.linkContext,
            createdBy: userId,
          },
        });
        fileLinks.push(fileLink);
      }
    }

    return {
      ...attachment,
      file: fileRecord,
      fileLinks,
    };
  }

  // ─── Get Attachments for a Record ───────────────────────────────────────────

  async findByRecord(recordType: string, recordId: string, companyId: string) {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        recordType,
        recordId,
        companyId,
        deletedAt: null,
      },
      include: {
        file: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return attachments;
  }

  // ─── Get Single Attachment ──────────────────────────────────────────────────

  async findOne(id: string, companyId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
      include: {
        file: true,
        fileLinks: { where: { deletedAt: null } },
      },
    });

    if (!attachment) throw new NotFoundException('Attachment not found');
    if (attachment.companyId !== companyId) throw new ForbiddenException('Access denied');
    if (attachment.deletedAt) throw new NotFoundException('Attachment has been deleted');

    return attachment;
  }

  // ─── List All Attachments (paginated) ───────────────────────────────────────

  async findAll(companyId: string, query: AttachmentQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId, deletedAt: null };
    if (query.recordType) where.recordType = query.recordType;
    if (query.recordId) where.recordId = query.recordId;
    if (query.mimeType) {
      where.file = { mimeType: query.mimeType };
    }

    const [data, total] = await Promise.all([
      this.prisma.attachment.findMany({
        where,
        include: { file: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.attachment.count({ where: { ...where, file: undefined } }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Get File for Download ──────────────────────────────────────────────────

  async getFileForDownload(id: string, companyId: string) {
    const attachment = await this.findOne(id, companyId);
    const file = attachment.file;

    if (!file || !fs.existsSync(file.path)) {
      throw new NotFoundException('File not found on storage');
    }

    return {
      filePath: file.path,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
    };
  }

  // ─── Update Attachment Metadata ─────────────────────────────────────────────

  async update(id: string, dto: UpdateAttachmentDto, companyId: string) {
    const attachment = await this.findOne(id, companyId);

    return this.prisma.attachment.update({
      where: { id },
      data: {
        description: dto.description ?? attachment.description,
      },
      include: { file: true },
    });
  }

  // ─── Soft Delete ────────────────────────────────────────────────────────────

  async softDelete(id: string, companyId: string, userId: string) {
    const attachment = await this.findOne(id, companyId);

    await this.prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true, id };
  }

  // ─── Bulk Soft Delete ───────────────────────────────────────────────────────

  async bulkDelete(ids: string[], companyId: string, userId: string) {
    // Verify all belong to company
    const attachments = await this.prisma.attachment.findMany({
      where: { id: { in: ids }, companyId, deletedAt: null },
    });

    if (attachments.length !== ids.length) {
      throw new BadRequestException('Some attachments not found or access denied');
    }

    const result = await this.prisma.attachment.updateMany({
      where: { id: { in: ids }, companyId },
      data: { deletedAt: new Date() },
    });

    return { success: true, deleted: result.count };
  }

  // ─── Restore (undo soft delete) ─────────────────────────────────────────────

  async restore(id: string, companyId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) throw new NotFoundException('Attachment not found');
    if (attachment.companyId !== companyId) throw new ForbiddenException('Access denied');
    if (!attachment.deletedAt) throw new BadRequestException('Attachment is not deleted');

    return this.prisma.attachment.update({
      where: { id },
      data: { deletedAt: null },
      include: { file: true },
    });
  }

  // ─── Get Attachment Stats ───────────────────────────────────────────────────

  async getStats(companyId: string) {
    const [totalAttachments, totalSize, byType] = await Promise.all([
      this.prisma.attachment.count({
        where: { companyId, deletedAt: null },
      }),
      this.prisma.file.aggregate({
        where: { companyId, deletedAt: null },
        _sum: { size: true },
      }),
      this.prisma.attachment.groupBy({
        by: ['recordType'],
        where: { companyId, deletedAt: null },
        _count: { id: true },
      }),
    ]);

    return {
      totalAttachments,
      totalSize: totalSize._sum.size || 0,
      byType: byType.map((t) => ({
        recordType: t.recordType,
        count: t._count.id,
      })),
    };
  }

  // ─── File Links CRUD ────────────────────────────────────────────────────────

  async createFileLink(dto: CreateFileLinkDto, companyId: string, userId: string) {
    const attachment = await this.findOne(dto.attachmentId, companyId);

    const existing = await this.prisma.fileLink.findFirst({
      where: {
        attachmentId: dto.attachmentId,
        linkedModule: dto.linkedModule,
        linkedRecordType: dto.linkedRecordType,
        linkedRecordId: dto.linkedRecordId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new BadRequestException('File link already exists for this record');
    }

    return this.prisma.fileLink.create({
      data: {
        companyId,
        attachmentId: dto.attachmentId,
        linkedModule: dto.linkedModule,
        linkedRecordType: dto.linkedRecordType,
        linkedRecordId: dto.linkedRecordId,
        linkContext: dto.linkContext,
        createdBy: userId,
      },
    });
  }

  async getFileLinksByAttachment(attachmentId: string, companyId: string) {
    const attachment = await this.findOne(attachmentId, companyId);

    return this.prisma.fileLink.findMany({
      where: { attachmentId, companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFileLinksByRecord(
    linkedModule: string,
    linkedRecordType: string,
    linkedRecordId: string,
    companyId: string,
  ) {
    return this.prisma.fileLink.findMany({
      where: {
        linkedModule,
        linkedRecordType,
        linkedRecordId,
        companyId,
        deletedAt: null,
      },
      include: {
        attachment: {
          include: { file: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFileLink(fileLinkId: string, companyId: string) {
    const fileLink = await this.prisma.fileLink.findUnique({
      where: { id: fileLinkId },
    });

    if (!fileLink) throw new NotFoundException('File link not found');
    if (fileLink.companyId !== companyId) throw new ForbiddenException('Access denied');

    return this.prisma.fileLink.update({
      where: { id: fileLinkId },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Get Attachments by Cross-Module Record ─────────────────────────────────

  async findByRecordCrossModule(
    module: string,
    recordType: string,
    recordId: string,
    companyId: string,
  ) {
    // Get directly linked attachments
    const directAttachments = await this.prisma.attachment.findMany({
      where: {
        recordType,
        recordId,
        companyId,
        deletedAt: null,
      },
      include: { file: true },
    });

    // Get attachments via file_links
    const fileLinks = await this.prisma.fileLink.findMany({
      where: {
        linkedModule: module,
        linkedRecordType: recordType,
        linkedRecordId: recordId,
        companyId,
        deletedAt: null,
      },
      include: {
        attachment: {
          include: { file: true },
        },
      },
    });

    const linkedAttachments = fileLinks
      .filter((fl) => fl.attachment && !fl.attachment.deletedAt)
      .map((fl) => fl.attachment);

    // Merge and deduplicate
    const allAttachments = [...directAttachments];
    for (const linked of linkedAttachments) {
      if (!allAttachments.find((a) => a.id === linked.id)) {
        allAttachments.push(linked);
      }
    }

    return allAttachments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type '${file.mimetype}' is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
  }
}
