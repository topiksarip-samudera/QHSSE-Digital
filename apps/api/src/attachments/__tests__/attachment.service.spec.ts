import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AttachmentService } from '../attachment.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  attachment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  file: {
    create: vi.fn(),
    aggregate: vi.fn(),
  },
};

// ─── Mock fs module ────────────────────────────────────────────────────────
vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  createReadStream: vi.fn(() => ({ pipe: vi.fn() })),
}));

// ─── Helper Factories ──────────────────────────────────────────────────────

function makeFile(overrides = {}) {
  return {
    id: 'file-1',
    companyId: 'comp-1',
    filename: 'abc123.pdf',
    originalName: 'report.pdf',
    mimeType: 'application/pdf',
    size: 1024,
    path: '/uploads/abc123.pdf',
    bucket: 'local',
    hash: 'md5hash',
    uploadedBy: 'user-1',
    createdAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

function makeAttachment(overrides = {}) {
  return {
    id: 'att-1',
    companyId: 'comp-1',
    recordType: 'incident',
    recordId: 'rec-1',
    fileId: 'file-1',
    description: 'Test attachment',
    uploadedBy: 'user-1',
    createdAt: new Date(),
    deletedAt: null,
    file: makeFile(),
    ...overrides,
  };
}

function makeMulterFile(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('test file content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
    ...overrides,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('AttachmentService', () => {
  let service: AttachmentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AttachmentService(mockPrisma as any);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // UPLOAD
  // ═══════════════════════════════════════════════════════════════════════════

  describe('upload', () => {
    it('should upload a file and create attachment', async () => {
      const file = makeMulterFile();
      const dto = { recordType: 'incident', recordId: 'rec-1', description: 'Photo' };
      mockPrisma.file.create.mockResolvedValue(makeFile());
      mockPrisma.attachment.create.mockResolvedValue(makeAttachment());

      const result = await service.upload(file, dto, 'comp-1', 'user-1');

      expect(mockPrisma.file.create).toHaveBeenCalled();
      expect(mockPrisma.attachment.create).toHaveBeenCalled();
      expect(result.file).toBeDefined();
    });

    it('should throw if no file provided', async () => {
      const dto = { recordType: 'incident', recordId: 'rec-1' };

      await expect(
        service.upload(null as any, dto, 'comp-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if file type is not allowed', async () => {
      const file = makeMulterFile({ mimetype: 'application/x-executable' });
      const dto = { recordType: 'incident', recordId: 'rec-1' };

      await expect(
        service.upload(file, dto, 'comp-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if file exceeds max size', async () => {
      const file = makeMulterFile({ size: 100 * 1024 * 1024 }); // 100MB
      const dto = { recordType: 'incident', recordId: 'rec-1' };

      await expect(
        service.upload(file, dto, 'comp-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept image types', async () => {
      const file = makeMulterFile({ mimetype: 'image/jpeg', originalname: 'photo.jpg' });
      const dto = { recordType: 'incident', recordId: 'rec-1' };
      mockPrisma.file.create.mockResolvedValue(makeFile({ mimeType: 'image/jpeg' }));
      mockPrisma.attachment.create.mockResolvedValue(makeAttachment());

      const result = await service.upload(file, dto, 'comp-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should accept CSV files', async () => {
      const file = makeMulterFile({ mimetype: 'text/csv', originalname: 'data.csv' });
      const dto = { recordType: 'incident', recordId: 'rec-1' };
      mockPrisma.file.create.mockResolvedValue(makeFile({ mimeType: 'text/csv' }));
      mockPrisma.attachment.create.mockResolvedValue(makeAttachment());

      const result = await service.upload(file, dto, 'comp-1', 'user-1');

      expect(result).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND BY RECORD
  // ═══════════════════════════════════════════════════════════════════════════

  describe('findByRecord', () => {
    it('should return attachments for a record', async () => {
      const attachments = [makeAttachment(), makeAttachment({ id: 'att-2' })];
      mockPrisma.attachment.findMany.mockResolvedValue(attachments);

      const result = await service.findByRecord('incident', 'rec-1', 'comp-1');

      expect(result).toHaveLength(2);
      expect(mockPrisma.attachment.findMany).toHaveBeenCalledWith({
        where: { recordType: 'incident', recordId: 'rec-1', companyId: 'comp-1', deletedAt: null },
        include: { file: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array if no attachments', async () => {
      mockPrisma.attachment.findMany.mockResolvedValue([]);

      const result = await service.findByRecord('incident', 'rec-999', 'comp-1');

      expect(result).toHaveLength(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND ONE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('findOne', () => {
    it('should return attachment by id', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment());

      const result = await service.findOne('att-1', 'comp-1');

      expect(result.id).toBe('att-1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(null);

      await expect(service.findOne('att-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if different company', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment({ companyId: 'other-comp' }));

      await expect(service.findOne('att-1', 'comp-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if soft deleted', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment({ deletedAt: new Date() }));

      await expect(service.findOne('att-1', 'comp-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND ALL (PAGINATED)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('findAll', () => {
    it('should return paginated attachments', async () => {
      const attachments = [makeAttachment(), makeAttachment({ id: 'att-2' })];
      mockPrisma.attachment.findMany.mockResolvedValue(attachments);
      mockPrisma.attachment.count.mockResolvedValue(2);

      const result = await service.findAll('comp-1', {});

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ total: 2, page: 1, limit: 20, totalPages: 1 });
    });

    it('should filter by recordType', async () => {
      mockPrisma.attachment.findMany.mockResolvedValue([]);
      mockPrisma.attachment.count.mockResolvedValue(0);

      await service.findAll('comp-1', { recordType: 'audit' });

      expect(mockPrisma.attachment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ recordType: 'audit' }),
        }),
      );
    });

    it('should handle pagination', async () => {
      mockPrisma.attachment.findMany.mockResolvedValue([]);
      mockPrisma.attachment.count.mockResolvedValue(50);

      const result = await service.findAll('comp-1', { page: 2, limit: 10 });

      expect(mockPrisma.attachment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
      expect(result.meta.totalPages).toBe(5);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GET FILE FOR DOWNLOAD
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getFileForDownload', () => {
    it('should return file info for download', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment());

      const result = await service.getFileForDownload('att-1', 'comp-1');

      expect(result.originalName).toBe('report.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.filePath).toBeDefined();
    });

    it('should throw if attachment not found', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(null);

      await expect(service.getFileForDownload('att-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('update', () => {
    it('should update attachment description', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment());
      mockPrisma.attachment.update.mockResolvedValue(makeAttachment({ description: 'Updated' }));

      const result = await service.update('att-1', { description: 'Updated' }, 'comp-1');

      expect(result.description).toBe('Updated');
    });

    it('should throw if not found', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(null);

      await expect(service.update('att-999', { description: 'x' }, 'comp-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SOFT DELETE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('softDelete', () => {
    it('should soft delete attachment', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment());
      mockPrisma.attachment.update.mockResolvedValue({});

      const result = await service.softDelete('att-1', 'comp-1', 'user-1');

      expect(result).toEqual({ success: true, id: 'att-1' });
    });

    it('should throw if not found', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(null);

      await expect(service.softDelete('att-999', 'comp-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if different company', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment({ companyId: 'other' }));

      await expect(service.softDelete('att-1', 'comp-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BULK DELETE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('bulkDelete', () => {
    it('should bulk soft delete attachments', async () => {
      const found = [makeAttachment(), makeAttachment({ id: 'att-2' })];
      mockPrisma.attachment.findMany.mockResolvedValue(found);
      mockPrisma.attachment.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.bulkDelete(['att-1', 'att-2'], 'comp-1', 'user-1');

      expect(result).toEqual({ success: true, deleted: 2 });
    });

    it('should throw if some attachments not found', async () => {
      mockPrisma.attachment.findMany.mockResolvedValue([makeAttachment()]); // only 1 of 2

      await expect(
        service.bulkDelete(['att-1', 'att-2'], 'comp-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // RESTORE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('restore', () => {
    it('should restore a soft-deleted attachment', async () => {
      const deleted = makeAttachment({ deletedAt: new Date() });
      mockPrisma.attachment.findUnique.mockResolvedValue(deleted);
      mockPrisma.attachment.update.mockResolvedValue(makeAttachment());

      const result = await service.restore('att-1', 'comp-1');

      expect(result.deletedAt).toBeNull();
    });

    it('should throw if attachment not found', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(null);

      await expect(service.restore('att-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if different company', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(
        makeAttachment({ companyId: 'other', deletedAt: new Date() }),
      );

      await expect(service.restore('att-1', 'comp-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw if attachment is not deleted', async () => {
      mockPrisma.attachment.findUnique.mockResolvedValue(makeAttachment({ deletedAt: null }));

      await expect(service.restore('att-1', 'comp-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getStats', () => {
    it('should return attachment statistics', async () => {
      mockPrisma.attachment.count.mockResolvedValue(10);
      mockPrisma.file.aggregate.mockResolvedValue({ _sum: { size: 5120 } });
      mockPrisma.attachment.groupBy.mockResolvedValue([
        { recordType: 'incident', _count: { id: 7 } },
        { recordType: 'audit', _count: { id: 3 } },
      ]);

      const result = await service.getStats('comp-1');

      expect(result.totalAttachments).toBe(10);
      expect(result.totalSize).toBe(5120);
      expect(result.byType).toHaveLength(2);
    });

    it('should return zero if no attachments', async () => {
      mockPrisma.attachment.count.mockResolvedValue(0);
      mockPrisma.file.aggregate.mockResolvedValue({ _sum: { size: null } });
      mockPrisma.attachment.groupBy.mockResolvedValue([]);

      const result = await service.getStats('comp-1');

      expect(result.totalAttachments).toBe(0);
      expect(result.totalSize).toBe(0);
      expect(result.byType).toHaveLength(0);
    });
  });
});
