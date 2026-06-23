import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SsoService } from '../sso.service';

const mockPrisma = { ssoProvider: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() }, ssoMapping: { create: vi.fn() }, ssoLoginLog: { findMany: vi.fn() } };

function makeP(o: any = {}) { return { id: 'p-1', companyId: 'comp-1', name: 'Azure AD', provider: 'azure', isActive: true, config: {}, mappings: [], logs: [], ...o }; }

describe('SsoService', () => {
  let svc: SsoService;
  beforeEach(() => { vi.clearAllMocks(); svc = new SsoService(mockPrisma as any); });

  it('should create provider', async () => {
    mockPrisma.ssoProvider.create.mockResolvedValue(makeP());
    mockPrisma.ssoProvider.findUnique.mockResolvedValue(makeP());
    const r = await svc.create({ name: 'Test', provider: 'azure' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Azure AD');
  });

  it('should list providers', async () => {
    mockPrisma.ssoProvider.findMany.mockResolvedValue([makeP()]);
    mockPrisma.ssoProvider.count.mockResolvedValue(1);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should test provider', async () => {
    mockPrisma.ssoProvider.findUnique.mockResolvedValue(makeP());
    const r = await svc.testProvider('p-1', 'comp-1');
    expect(r.success).toBe(true);
  });
});
