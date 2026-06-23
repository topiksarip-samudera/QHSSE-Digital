import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RiskService } from '../risk.service';

const mockPrisma: any = {
  riskSetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
  risk: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
};

function makeRisk(o: any = {}) { return { id: 'r-1', companyId: 'c-1', title: 'Fire Risk', status: 'draft', riskOwnerId: 'u-1', initialSeverity: 3, initialLikelihood: 4, initialRiskScore: 12, initialRiskLevel: 'M', ...o }; }

describe('RiskService', () => {
  let svc: RiskService;
  beforeEach(() => { vi.clearAllMocks(); svc = new RiskService(mockPrisma); });

  // ... existing settings tests ...


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

  describe('Risk CRUD', () => {
    it('should create risk with calculated score', async () => {
      mockPrisma.riskSetting.findUnique.mockResolvedValue({ riskLevels: [{ level: 'M', scoreMin: 7, scoreMax: 12 }] });
      mockPrisma.risk.create.mockResolvedValue(makeRisk());
      const r = await svc.create({ title: 'Test', riskOwnerId: 'u-1', initialSeverity: 3, initialLikelihood: 4 }, 'c-1', 'u-1');
      expect(r.initialRiskScore).toBe(12);
      expect(r.initialRiskLevel).toBe('M');
    });

    it('should list risks', async () => {
      mockPrisma.risk.findMany.mockResolvedValue([makeRisk()]);
      mockPrisma.risk.count.mockResolvedValue(1);
      const r = await svc.findAll('c-1', {});
      expect(r.data).toHaveLength(1);
    });

    it('should find one with tenant check', async () => {
      mockPrisma.risk.findUnique.mockResolvedValue(makeRisk());
      const r = await svc.findOne('r-1', 'c-1');
      expect(r.id).toBe('r-1');
    });
  });
});
