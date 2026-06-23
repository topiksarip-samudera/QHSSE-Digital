import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BackupRestoreService } from '../backup-restore.service';

const mockPrisma: any = {
  backup: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  backupSchedule: { create: vi.fn(), findMany: vi.fn(), update: vi.fn(), delete: vi.fn() },
  restoreRequest: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  restoreLog: { create: vi.fn() },
};

describe('BackupRestoreService', () => {
  let svc: BackupRestoreService;
  beforeEach(() => { vi.clearAllMocks(); svc = new BackupRestoreService(mockPrisma); });

  it('should create backup', async () => {
    mockPrisma.backup.create.mockResolvedValue({ id: 'b-1', type: 'manual', status: 'completed' });
    const r = await svc.createBackup({}, 'comp-1', 'user-1');
    expect(r.status).toBe('completed');
  });

  it('should list backups', async () => {
    mockPrisma.backup.findMany.mockResolvedValue([]);
    mockPrisma.backup.count.mockResolvedValue(0);
    const r = await svc.getBackups('comp-1', {});
    expect(r.data).toHaveLength(0);
  });

  it('should approve restore', async () => {
    mockPrisma.restoreRequest.findUnique.mockResolvedValue({ id: 'r-1', companyId: 'comp-1' });
    mockPrisma.restoreRequest.update.mockResolvedValue({});
    mockPrisma.restoreLog.create.mockResolvedValue({});
    const r = await svc.approveRestore('r-1', 'comp-1', 'user-1');
    expect(r.approved).toBe(true);
  });
});
