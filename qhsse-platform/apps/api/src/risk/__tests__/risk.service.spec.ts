import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RiskService } from '../risk.service';

const mockPrisma: any = {
  riskSetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
};

describe('RiskService', () => {
  let svc: RiskService;
  beforeEach(() => { vi.clearAllMocks(); svc = new RiskService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.riskSetting.findUnique.mockResolvedValue(null);
    mockPrisma.riskSetting.create.mockResolvedValue({ companyId: 'c-1', requireWorkflow: true, matrixType: '5x5', severityLevels: [], likelihoodLevels: [], riskLevels: [], maxReviewDays: 90 });
    const r = await svc.getSettings('c-1');
    expect(r.requireWorkflow).toBe(true);
  });

  it('should seed master data', async () => {
    mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g-1', name: 'Test' });
    mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataItem.create.mockResolvedValue({});
    const r = await svc.seedDefaults('c-1');
    expect(r.seeded).toBeGreaterThan(0);
  });

  it('should update settings', async () => {
    mockPrisma.riskSetting.upsert.mockResolvedValue({});
    const r = await svc.updateSettings('c-1', { requireWorkflow: false });
    expect(mockPrisma.riskSetting.upsert).toHaveBeenCalled();
  });
});
