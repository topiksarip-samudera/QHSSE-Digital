import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChecklistService } from '../checklist.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';

const mockPrisma = {
  checklist: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  checklistSection: { create: vi.fn(), updateMany: vi.fn() },
  checklistItem: { create: vi.fn() },
  checklistAnswerOption: { create: vi.fn() },
  checklistVersion: { create: vi.fn(), findUnique: vi.fn() },
  checklistResponse: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  checklistResponseItem: { create: vi.fn() },
};

function makeChecklist(overrides: any = {}) {
  return { id: 'c-1', companyId: 'comp-1', name: 'Safety Checklist', description: 'Desc', status: Status.draft, version: 1, passScore: 80, maxScore: 100, createdBy: 'user-1', createdAt: new Date(), updatedAt: new Date(), deletedAt: null, sections: [], versions: [], _count: { sections: 0, responses: 0 }, ...overrides };
}

describe('ChecklistService', () => {
  let service: ChecklistService;
  beforeEach(() => { vi.clearAllMocks(); service = new ChecklistService(mockPrisma as any); });

  describe('create', () => {
    it('should create', async () => {
      mockPrisma.checklist.create.mockResolvedValue(makeChecklist());
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist());
      const r = await service.create({ name: 'Test' }, 'comp-1', 'user-1');
      expect(r.name).toBe('Safety Checklist');
    });
  });

  describe('findAll', () => {
    it('should list', async () => {
      mockPrisma.checklist.findMany.mockResolvedValue([makeChecklist()]);
      mockPrisma.checklist.count.mockResolvedValue(1);
      const r = await service.findAll('comp-1', {});
      expect(r.data).toHaveLength(1);
    });
  });

  describe('getDetail', () => {
    it('should get detail', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist());
      const r = await service.getDetail('c-1', 'comp-1');
      expect(r.id).toBe('c-1');
    });
    it('should throw not found', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(null);
      await expect(service.getDetail('x', 'comp-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist({ status: Status.draft }));
      mockPrisma.checklist.update.mockResolvedValue({});
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist({ name: 'Updated', status: Status.draft }));
      mockPrisma.checklistSection.updateMany.mockResolvedValue({ count: 0 });
      const r = await service.update('c-1', { name: 'Updated' }, 'comp-1', 'user-1');
      expect(r.name).toBe('Updated');
    });
    it('should reject published', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist({ status: Status.active }));
      await expect(service.update('c-1', { name: 'X' }, 'comp-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('publish', () => {
    it('should publish', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist({ status: Status.draft }));
      mockPrisma.checklist.findUnique.mockResolvedValueOnce(makeChecklist({ status: Status.draft }));
      mockPrisma.checklist.findUnique.mockResolvedValueOnce(makeChecklist({ status: Status.active }));
      mockPrisma.checklistVersion.create.mockResolvedValue({});
      mockPrisma.checklist.update.mockResolvedValue({});
      const r = await service.publish('c-1', 'comp-1', 'user-1');
      expect(mockPrisma.checklistVersion.create).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      mockPrisma.checklist.findUnique.mockResolvedValue(makeChecklist());
      mockPrisma.checklist.update.mockResolvedValue({});
      const r = await service.softDelete('c-1', 'comp-1');
      expect(r.success).toBe(true);
    });
  });

  describe('submit', () => {
    it('should submit response', async () => {
      mockPrisma.checklistVersion.findUnique.mockResolvedValue({ id: 'v-1', checklistId: 'c-1', definition: { sections: [{ items: [{ question: 'Safe?', answerType: 'yes_no', weight: 1, critical: false, options: [] }] }] } });
      mockPrisma.checklist.findUnique.mockResolvedValue({ passScore: 50 });
      mockPrisma.checklistResponse.create.mockResolvedValue({ id: 'r-1', totalScore: 1 });
      mockPrisma.checklistResponseItem.create.mockResolvedValue({});
      const r = await service.submit({ checklistVersionId: 'v-1', items: [{ itemId: 'Safe?', answer: 'yes' }] }, 'comp-1', 'user-1');
      expect(r.id).toBe('r-1');
    });
  });
});
