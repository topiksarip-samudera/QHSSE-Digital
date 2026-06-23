import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntegrationCenterService } from '../integration-center.service';

const mockPrisma: any = {
  integration: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  integrationConfig: { create: vi.fn() },
  integrationMapping: { create: vi.fn() },
  integrationSyncJob: { create: vi.fn(), findMany: vi.fn() },
  integrationSyncLog: { create: vi.fn() },
};

describe('IntegrationCenterService', () => {
  let svc: IntegrationCenterService;
  beforeEach(() => { vi.clearAllMocks(); svc = new IntegrationCenterService(mockPrisma); });

  it('should create integration', async () => {
    mockPrisma.integration.create.mockResolvedValue({ id: 'i-1', companyId: 'comp-1', name: 'SAP', type: 'rest_api' });
    mockPrisma.integration.findUnique.mockResolvedValue({ id: 'i-1', companyId: 'comp-1', name: 'SAP', configs: [], mappings: [] });
    const r = await svc.create({ name: 'SAP', type: 'rest_api' }, 'comp-1', 'user-1');
    expect(r.name).toBe('SAP');
  });

  it('should test integration', async () => {
    mockPrisma.integration.findUnique.mockResolvedValue({ id: 'i-1', companyId: 'comp-1', name: 'SAP', type: 'rest_api', credentials: { apiKey: 'xxx' } });
    const r = await svc.test('i-1', 'comp-1');
    expect(r.success).toBe(true);
  });

  it('should sync', async () => {
    mockPrisma.integration.findUnique.mockResolvedValue({ id: 'i-1', companyId: 'comp-1' });
    mockPrisma.integrationSyncJob.create.mockResolvedValue({ id: 'j-1', status: 'completed' });
    mockPrisma.integrationSyncLog.create.mockResolvedValue({});
    const r = await svc.sync('i-1', 'comp-1');
    expect(r.status).toBe('completed');
  });
});
