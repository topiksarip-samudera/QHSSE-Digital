import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComplianceService } from '../compliance.service';

const mockPrisma: any = {
  accessReview: { create: vi.fn(), findMany: vi.fn(), update: vi.fn(), count: vi.fn() },
  permissionReview: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  policyAcknowledgement: { upsert: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  complianceScore: { findUnique: vi.fn(), upsert: vi.fn() },
};

describe('ComplianceService', () => {
  let svc: ComplianceService;
  beforeEach(() => { vi.clearAllMocks(); svc = new ComplianceService(mockPrisma); });

  it('should get compliance score', async () => {
    mockPrisma.accessReview.count.mockResolvedValue(2);
    mockPrisma.permissionReview.count.mockResolvedValue(1);
    mockPrisma.policyAcknowledgement.count.mockResolvedValue(3);
    mockPrisma.complianceScore.findUnique.mockResolvedValue(null);
    mockPrisma.complianceScore.upsert.mockResolvedValue({});
    const r = await svc.getComplianceScore('comp-1');
    expect(r.totalScore).toBeGreaterThan(0);
  });

  it('should create access review', async () => {
    mockPrisma.accessReview.create.mockResolvedValue({ id: 'ar-1', userId: 'u-1' });
    const r = await svc.createAccessReview({ userId: 'u-1' }, 'comp-1', 'rev-1');
    expect(r.id).toBe('ar-1');
  });
});
