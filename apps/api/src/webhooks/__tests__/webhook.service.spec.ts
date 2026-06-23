import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebhookService } from '../webhook.service';

const mockPrisma = {
  webhook: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  webhookEvent: { create: vi.fn(), deleteMany: vi.fn() },
  webhookLog: { create: vi.fn(), findMany: vi.fn() },
};

global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => 'OK' });

describe('WebhookService', () => {
  let svc: WebhookService;
  beforeEach(() => { vi.clearAllMocks(); svc = new WebhookService(mockPrisma as any); });

  it('should create webhook', async () => {
    mockPrisma.webhook.create.mockResolvedValue({ id: 'w-1', name: 'Test', url: 'https://test.com', secret: 's', status: 'active' });
    const r = await svc.create({ name: 'Test', url: 'https://test.com' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Test');
  });

  it('should test webhook', async () => {
    mockPrisma.webhook.findUnique.mockResolvedValue({ id: 'w-1', companyId: 'comp-1', name: 'Test', url: 'https://test.com', secret: 's', events: [] });
    mockPrisma.webhookLog.create.mockResolvedValue({});
    const r = await svc.test('w-1', 'comp-1');
    expect(r.success).toBe(true);
  });

  it('should list webhooks', async () => {
    mockPrisma.webhook.findMany.mockResolvedValue([]);
    mockPrisma.webhook.count.mockResolvedValue(0);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(0);
  });
});
