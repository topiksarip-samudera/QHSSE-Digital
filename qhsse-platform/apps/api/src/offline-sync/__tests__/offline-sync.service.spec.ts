import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OfflineSyncService } from '../offline-sync.service';

const mockPrisma: any = {
  syncJob: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn(), count: vi.fn() },
  syncConflict: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  syncLog: { create: vi.fn() },
};

describe('OfflineSyncService', () => {
  let svc: OfflineSyncService;
  beforeEach(() => { vi.clearAllMocks(); svc = new OfflineSyncService(mockPrisma); });

  it('should push items', async () => {
    mockPrisma.syncJob.findFirst.mockResolvedValue(null);
    mockPrisma.syncJob.create.mockResolvedValue({});
    mockPrisma.syncLog.create.mockResolvedValue({});
    const r = await svc.push('comp-1', 'user-1', [{ module: 'action', action: 'create', recordType: 'actions', recordId: 'a-1', payload: {} }]);
    expect(r.synced).toBe(1);
  });

  it('should get status', async () => {
    mockPrisma.syncJob.count.mockResolvedValue(0);
    mockPrisma.syncConflict.count.mockResolvedValue(0);
    const r = await svc.getStatus('comp-1', 'user-1');
    expect(r.queued).toBe(0);
  });

  it('should resolve conflict', async () => {
    mockPrisma.syncConflict.findUnique.mockResolvedValue({ id: 'c-1', syncJobId: 'j-1', companyId: 'comp-1' });
    mockPrisma.syncConflict.update.mockResolvedValue({});
    mockPrisma.syncJob.update.mockResolvedValue({});
    mockPrisma.syncLog.create.mockResolvedValue({});
    const r = await svc.resolveConflict('c-1', 'keep_server', 'user-1');
    expect(r.resolved).toBe(true);
  });
});
