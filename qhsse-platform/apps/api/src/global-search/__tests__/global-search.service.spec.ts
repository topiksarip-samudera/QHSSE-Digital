import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalSearchService } from '../global-search.service';

const mockPrisma: any = {
  action: { findMany: vi.fn() },
  user: { findMany: vi.fn() },
  company: { findMany: vi.fn() },
  workflow: { findMany: vi.fn() },
  notification: { findMany: vi.fn() },
  form: { findMany: vi.fn() },
  checklist: { findMany: vi.fn() },
  template: { findMany: vi.fn() },
  schedule: { findMany: vi.fn() },
  auditLog: { findMany: vi.fn() },
  searchLog: { create: vi.fn(), findMany: vi.fn() },
  savedSearch: { create: vi.fn(), findMany: vi.fn(), count: vi.fn(), delete: vi.fn() },
};

Object.values(mockPrisma).forEach((v: any) => { if (typeof v === 'object') v.findMany?.mockResolvedValue([]); });

describe('GlobalSearchService', () => {
  let svc: GlobalSearchService;
  beforeEach(() => { vi.clearAllMocks(); svc = new GlobalSearchService(mockPrisma); });

  it('should search across modules', async () => {
    const r = await svc.search('comp-1', { query: 'test' });
    expect(r.results).toBeDefined();
    expect(r.query).toBe('test');
  });

  it('should save a search', async () => {
    mockPrisma.savedSearch.create.mockResolvedValue({ id: 's-1', name: 'Test', query: 'test' });
    const r = await svc.createSaved({ name: 'Test', query: 'test' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Test');
  });

  it('should list saved searches', async () => {
    mockPrisma.savedSearch.findMany.mockResolvedValue([]);
    mockPrisma.savedSearch.count.mockResolvedValue(0);
    const r = await svc.getSaved('comp-1', 'user-1', {});
    expect(r.data).toHaveLength(0);
  });
});
