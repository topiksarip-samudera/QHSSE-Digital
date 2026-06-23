import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdvancedPermissionService } from '../advanced-permission.service';

const mockPrisma = {
  accessPolicy: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn(), delete: vi.fn() },
  temporaryAccessGrant: { create: vi.fn(), findMany: vi.fn(), delete: vi.fn() },
  recordPermission: { findMany: vi.fn() },
  dataMaskingRule: { findMany: vi.fn(), create: vi.fn() },
};

describe('AdvancedPermissionService', () => {
  let svc: AdvancedPermissionService;
  beforeEach(() => { vi.clearAllMocks(); svc = new AdvancedPermissionService(mockPrisma as any); });

  it('should create policy', async () => {
    mockPrisma.accessPolicy.create.mockResolvedValue({ id: 'p-1', name: 'Test', module: 'actions', rules: {} });
    const r = await svc.createPolicy({ name: 'Test', module: 'actions' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Test');
  });

  it('should simulate permissions', async () => {
    mockPrisma.accessPolicy.findMany.mockResolvedValue([{ name: 'Test', module: 'actions', rules: [] }]);
    mockPrisma.temporaryAccessGrant.findMany.mockResolvedValue([]);
    mockPrisma.recordPermission.findMany.mockResolvedValue([]);
    const r = await svc.simulate({ userId: 'u-1', module: 'actions' }, 'comp-1');
    expect(r.summary).toBeDefined();
  });

  it('should create temp access', async () => {
    mockPrisma.temporaryAccessGrant.create.mockResolvedValue({ id: 't-1', userId: 'u-1', module: 'actions' });
    const r = await svc.createTempAccess({ userId: 'u-1', module: 'actions', expiresAt: '2027-01-01' }, 'comp-1', 'admin-1');
    expect(r.id).toBe('t-1');
  });
});
