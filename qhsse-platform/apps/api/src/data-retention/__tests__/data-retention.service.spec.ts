import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataRetentionService } from '../data-retention.service';

const mockPrisma: any = {
  retentionPolicy: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  archiveRecord: { create: vi.fn(), findMany: vi.fn() },
  legalHold: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  purgeRequest: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  purgeLog: { create: vi.fn() },
};

describe('DataRetentionService', () => {
  let svc: DataRetentionService;
  beforeEach(() => { vi.clearAllMocks(); svc = new DataRetentionService(mockPrisma); });

  it('should create policy', async () => {
    mockPrisma.retentionPolicy.create.mockResolvedValue({ id: 'p-1', name: 'GDPR', module: 'incident', retentionDays: 365 });
    const r = await svc.createPolicy({ name: 'GDPR', module: 'incident', retentionDays: 365 }, 'comp-1', 'user-1');
    expect(r.name).toBe('GDPR');
  });

  it('should create legal hold', async () => {
    mockPrisma.legalHold.create.mockResolvedValue({ id: 'h-1', name: 'Litigation Q3' });
    const r = await svc.createLegalHold({ name: 'Litigation Q3', module: 'incident', recordIds: ['INC-1'] }, 'comp-1', 'user-1');
    expect(r.name).toBe('Litigation Q3');
  });

  it('should approve purge', async () => {
    mockPrisma.purgeRequest.findUnique.mockResolvedValue({ id: 'pr-1', companyId: 'comp-1' });
    mockPrisma.purgeRequest.update.mockResolvedValue({});
    mockPrisma.purgeLog.create.mockResolvedValue({});
    const r = await svc.approvePurge('pr-1', 'comp-1', 'user-1');
    expect(r.purged).toBe(true);
  });
});
