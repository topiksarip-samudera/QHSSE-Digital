import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CollaborationService } from '../collaboration.service';

const mockPrisma: any = {
  comment: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
  commentMention: { create: vi.fn() },
  commentAttachment: { create: vi.fn() },
};

function makeComment(o: any = {}) { return { id: 'c-1', companyId: 'comp-1', content: 'Test', userId: 'user-1', parentId: null, isInternal: false, user: { email: 'test@test.com' }, replies: [], mentions: [], attachments: [], ...o }; }

describe('CollaborationService', () => {
  let svc: CollaborationService;
  beforeEach(() => { vi.clearAllMocks(); svc = new CollaborationService(mockPrisma); });

  it('should get comments', async () => {
    mockPrisma.comment.findMany.mockResolvedValue([]); mockPrisma.comment.count.mockResolvedValue(0);
    const r = await svc.getComments('action', 'actions', 'act-1', 'comp-1', {});
    expect(r.data).toHaveLength(0);
  });

  it('should create comment', async () => {
    mockPrisma.comment.create.mockResolvedValue(makeComment());
    mockPrisma.comment.findUnique.mockResolvedValue(makeComment());
    const r = await svc.create('action', 'actions', 'act-1', { content: 'Hello' }, 'comp-1', 'user-1');
    expect(r!.content).toBe('Test');
  });

  it('should soft delete', async () => {
    mockPrisma.comment.findUnique.mockResolvedValue(makeComment());
    mockPrisma.comment.update.mockResolvedValue({});
    const r = await svc.softDelete('c-1', 'comp-1');
    expect(r.success).toBe(true);
  });
});
