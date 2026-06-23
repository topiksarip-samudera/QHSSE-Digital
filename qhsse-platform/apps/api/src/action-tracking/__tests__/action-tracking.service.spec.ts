import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActionTrackingService } from '../action-tracking.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ActionPriority, ActionStatus } from '../dto/action-tracking.dto';

const mockPrisma = {
  action: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  actionComment: {
    create: vi.fn(),
  },
  actionEvidence: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  actionVerification: {
    create: vi.fn(),
  },
  actionHistory: {
    create: vi.fn(),
  },
};

function makeAction(overrides: any = {}) {
  return {
    id: 'act-1',
    companyId: 'comp-1',
    title: 'Fix safety valve',
    description: 'Replace valve on floor 3',
    sourceType: 'incident',
    sourceId: 'INC-001',
    priority: 'high',
    dueDate: new Date('2026-07-01'),
    assignedTo: 'user-2',
    createdBy: 'user-1',
    status: 'draft',
    completedAt: null,
    closedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    assignee: { id: 'user-2', email: 'worker@test.com', firstName: 'John', lastName: 'Doe' },
    creator: { id: 'user-1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User' },
    comments: [],
    evidences: [],
    verifications: [],
    histories: [],
    _count: { comments: 0, evidences: 0, verifications: 0 },
    ...overrides,
  };
}

describe('ActionTrackingService', () => {
  let service: ActionTrackingService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ActionTrackingService(mockPrisma as any);
  });

  describe('create', () => {
    it('should create an action', async () => {
      mockPrisma.action.create.mockResolvedValue(makeAction());
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.create(
        { title: 'Fix valve', assignedTo: 'user-2', priority: ActionPriority.HIGH },
        'comp-1',
        'user-1',
      );

      expect(result.title).toBe('Fix safety valve');
      expect(mockPrisma.actionHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ event: 'created' }) }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated actions', async () => {
      mockPrisma.action.findMany.mockResolvedValue([makeAction()]);
      mockPrisma.action.count.mockResolvedValue(1);

      const result = await service.findAll('comp-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status and priority', async () => {
      mockPrisma.action.findMany.mockResolvedValue([]);
      mockPrisma.action.count.mockResolvedValue(0);

      await service.findAll('comp-1', { status: 'draft', priority: 'high' });

      expect(mockPrisma.action.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'draft', priority: 'high' }),
        }),
      );
    });

    it('should filter overdue', async () => {
      mockPrisma.action.findMany.mockResolvedValue([]);
      mockPrisma.action.count.mockResolvedValue(0);

      await service.findAll('comp-1', { overdue: true });

      expect(mockPrisma.action.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dueDate: { lt: expect.any(Date) },
            status: { notIn: ['closed', 'cancelled'] },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return action with relations', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction());

      const result = await service.findOne('act-1', 'comp-1');

      expect(result.id).toBe('act-1');
      expect(result.comments).toBeDefined();
      expect(result.evidences).toBeDefined();
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(null);
      await expect(service.findOne('act-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for different company', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ companyId: 'other' }));
      await expect(service.findOne('act-1', 'comp-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update action and log history', async () => {
      const action = makeAction();
      mockPrisma.action.findUnique.mockResolvedValue(action);
      mockPrisma.action.update.mockResolvedValue(makeAction({ title: 'Updated title' }));
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.update('act-1', { title: 'Updated title' }, 'comp-1', 'user-1');

      expect(result.title).toBe('Updated title');
      expect(mockPrisma.actionHistory.create).toHaveBeenCalled();
    });

    it('should log status change', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ status: 'draft' }));
      mockPrisma.action.update.mockResolvedValue(makeAction({ status: 'submitted' }));
      mockPrisma.actionHistory.create.mockResolvedValue({});

      await service.update('act-1', { status: ActionStatus.SUBMITTED }, 'comp-1', 'user-1');

      expect(mockPrisma.actionHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ event: 'status_changed', oldStatus: 'draft', newStatus: 'submitted' }),
        }),
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete an action', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction());
      mockPrisma.action.update.mockResolvedValue({});
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.softDelete('act-1', 'comp-1', 'user-1');

      expect(result.success).toBe(true);
    });
  });

  describe('addComment', () => {
    it('should add a comment', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction());
      mockPrisma.actionComment.create.mockResolvedValue({ id: 'cmt-1', content: 'Test', user: { email: 'test@test.com' } });
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.addComment('act-1', { content: 'Test' }, 'comp-1', 'user-1');

      expect(result.id).toBe('cmt-1');
      expect(mockPrisma.actionHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ event: 'commented' }) }),
      );
    });
  });

  describe('submitForVerification', () => {
    it('should submit a draft action', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ status: 'draft' }));
      mockPrisma.action.update.mockResolvedValue({});
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.submitForVerification('act-1', 'comp-1', 'user-1');

      expect(result.success).toBe(true);
    });

    it('should reject submission of closed action', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ status: 'closed' }));

      await expect(service.submitForVerification('act-1', 'comp-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('verify', () => {
    it('should verify and close an action', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ status: 'submitted' }));
      mockPrisma.actionVerification.create.mockResolvedValue({ id: 'ver-1', status: 'verified' });
      mockPrisma.action.update.mockResolvedValue({});
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.verify('act-1', { notes: 'Done' }, 'comp-1', 'user-1');

      expect(result.status).toBe('verified');
    });
  });

  describe('rejectVerification', () => {
    it('should reject an action', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction({ status: 'submitted' }));
      mockPrisma.actionVerification.create.mockResolvedValue({ id: 'ver-2', status: 'rejected' });
      mockPrisma.action.update.mockResolvedValue({});
      mockPrisma.actionHistory.create.mockResolvedValue({});

      await service.rejectVerification('act-1', { notes: 'Incomplete' }, 'comp-1', 'user-1');

      expect(mockPrisma.action.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'rejected' }) }),
      );
    });
  });

  describe('addEvidence', () => {
    it('should add evidence', async () => {
      mockPrisma.action.findUnique.mockResolvedValue(makeAction());
      mockPrisma.actionEvidence.create.mockResolvedValue({ id: 'ev-1' });
      mockPrisma.actionHistory.create.mockResolvedValue({});

      const result = await service.addEvidence('act-1', 'att-1', 'comp-1', 'user-1', 'Photo');

      expect(result.id).toBe('ev-1');
    });
  });
});
