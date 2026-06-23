import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SubscriptionService } from '../subscription.service';

const mockPrisma = {
  plan: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  planFeature: { create: vi.fn() },
  subscription: { findUnique: vi.fn(), update: vi.fn() },
  subscriptionUsage: { findUnique: vi.fn() },
  invoice: { findMany: vi.fn() },
  billingLog: { create: vi.fn() },
};

describe('SubscriptionService', () => {
  let svc: SubscriptionService;
  beforeEach(() => { vi.clearAllMocks(); svc = new SubscriptionService(mockPrisma as any); });

  it('should create plan', async () => {
    mockPrisma.plan.create.mockResolvedValue({ id: 'p-1', name: 'Pro' });
    mockPrisma.plan.findUnique.mockResolvedValue({ id: 'p-1', name: 'Pro', features: [] });
    const r = await svc.createPlan({ name: 'Pro' });
    expect(r.name).toBe('Pro');
  });

  it('should list plans', async () => {
    mockPrisma.plan.findMany.mockResolvedValue([]);
    mockPrisma.plan.count.mockResolvedValue(0);
    const r = await svc.getPlans({});
    expect(r.data).toHaveLength(0);
  });

  it('should get usage', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue({ companyId: 'c-1', planId: 'p-1', plan: { name: 'Pro' }, usage: null, status: 'active' });
    const r = await svc.getUsage('c-1');
    expect(r.plan).toBe('Pro');
  });
});
