import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiKeyService } from '../api-key.service';

const mockPrisma = {
  apiKey: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  apiKeyScope: { create: vi.fn() },
  apiUsageLog: { findMany: vi.fn() },
  rateLimit: { create: vi.fn() },
};

describe('ApiKeyService', () => {
  let svc: ApiKeyService;
  beforeEach(() => { vi.clearAllMocks(); svc = new ApiKeyService(mockPrisma as any); });

  it('should create a key', async () => {
    mockPrisma.apiKey.create.mockResolvedValue({ id: 'k-1', name: 'Test', keyHash: 'h', keyPrefix: 'qhsse_abc', expiresAt: null, status: 'active' });
    const r = await svc.create({ name: 'Test' }, 'comp-1', 'user-1');
    expect(r.apiKey).toBeDefined();
    expect(r.prefix).toBeDefined();
  });

  it('should list keys', async () => {
    mockPrisma.apiKey.findMany.mockResolvedValue([]);
    mockPrisma.apiKey.count.mockResolvedValue(0);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(0);
  });

  it('should revoke key', async () => {
    mockPrisma.apiKey.findUnique.mockResolvedValue({ id: 'k-1', companyId: 'comp-1' });
    mockPrisma.apiKey.update.mockResolvedValue({});
    const r = await svc.revoke('k-1', 'comp-1');
    expect(r.success).toBe(true);
  });
});
