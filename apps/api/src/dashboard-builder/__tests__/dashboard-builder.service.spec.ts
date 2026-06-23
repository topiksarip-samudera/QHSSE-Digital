import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardBuilderService } from '../dashboard-builder.service';

const mockPrisma = {
  dashboard: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  dashboardWidget: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
};

function makeD(o: any = {}) { return { id: 'd-1', companyId: 'comp-1', name: 'Safety Dashboard', scope: 'company', widgets: [], filters: [], permissions: [], isDefault: false, ...o }; }

describe('DashboardBuilderService', () => {
  let svc: DashboardBuilderService;
  beforeEach(() => { vi.clearAllMocks(); svc = new DashboardBuilderService(mockPrisma as any); });

  it('should create dashboard', async () => {
    mockPrisma.dashboard.create.mockResolvedValue(makeD());
    mockPrisma.dashboard.findUnique.mockResolvedValue(makeD());
    const r = await svc.create({ name: 'Test' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Safety Dashboard');
  });

  it('should list dashboards', async () => {
    mockPrisma.dashboard.findMany.mockResolvedValue([makeD()]);
    mockPrisma.dashboard.count.mockResolvedValue(1);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should add widget', async () => {
    mockPrisma.dashboard.findUnique.mockResolvedValue(makeD());
    mockPrisma.dashboardWidget.create.mockResolvedValue({ id: 'w-1', type: 'stat', title: 'Users', config: {}, position: {} });
    const r = await svc.addWidget('d-1', { type: 'stat', title: 'Users' }, 'comp-1');
    expect(r.type).toBe('stat');
  });
});
