import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LegalService } from '../legal.service';
import { LegalAssessmentService } from '../legal-assessment.service';

const mockPrisma: any = {
  company: { findFirst: vi.fn() },
  legalSetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  regulation: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  legalObligation: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  legalEvidence: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), delete: vi.fn() },
  legalComplianceAssessment: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  legalGapAnalysis: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  legalComplianceScore: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  regulatoryUpdateLog: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  legalLink: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), delete: vi.fn(), count: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
};

describe('LegalService', () => {
  let svc: LegalService;
  beforeEach(() => { vi.clearAllMocks(); svc = new LegalService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.legalSetting.findUnique.mockResolvedValue(null);
    mockPrisma.legalSetting.create.mockResolvedValue({ companyId: 'c-1', defaultComplianceDueDays: 90, requireEvidence: true, autoEscalateOverdue: true, escalationDays: 14 });
    const r = await svc.getSettings('c-1');
    expect(r.defaultComplianceDueDays).toBe(90);
  });

  it('should update settings', async () => {
    mockPrisma.legalSetting.upsert.mockResolvedValue({});
    const r = await svc.updateSettings('c-1', { requireEvidence: false });
    expect(mockPrisma.legalSetting.upsert).toHaveBeenCalled();
  });

  it('should seed master data', async () => {
    mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g-1', name: 'Test' });
    mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataItem.create.mockResolvedValue({});
    const r = await svc.seedDefaults('c-1');
    expect(r.seeded).toBeGreaterThan(0);
  });

  it('should create regulation', async () => {
    mockPrisma.regulation.create.mockResolvedValue({ id: 'r-1', title: 'Test Regulation', companyId: 'c-1' });
    const r = await svc.createRegulation({ title: 'Test Regulation' }, 'c-1', 'u-1');
    expect(r.title).toBe('Test Regulation');
  });

  it('should list regulations', async () => {
    mockPrisma.regulation.findMany.mockResolvedValue([{ id: 'r-1', title: 'Test', companyId: 'c-1' }]);
    mockPrisma.regulation.count.mockResolvedValue(1);
    const r = await svc.findAllRegulations('c-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should throw on non-existent regulation', async () => {
    mockPrisma.regulation.findUnique.mockResolvedValue(null);
    await expect(svc.findRegulation('x', 'c-1')).rejects.toThrow('Regulation not found');
  });

  it('should create obligation', async () => {
    mockPrisma.legalObligation.create.mockResolvedValue({ id: 'o-1', requirement: 'Comply with X', companyId: 'c-1' });
    const r = await svc.createObligation({ regulationId: 'r-1', requirement: 'Comply with X' }, 'c-1', 'u-1');
    expect(r.requirement).toBe('Comply with X');
  });
});

describe('LegalAssessmentService', () => {
  let svc: LegalAssessmentService;
  beforeEach(() => { vi.clearAllMocks(); svc = new LegalAssessmentService(mockPrisma); });

  it('should create assessment', async () => {
    mockPrisma.legalComplianceAssessment.create.mockResolvedValue({ id: 'a-1', result: 'compliant', companyId: 'c-1' });
    const r = await svc.createAssessment({ result: 'compliant' }, 'c-1', 'u-1');
    expect(r.result).toBe('compliant');
  });

  it('should calculate compliance score', async () => {
    mockPrisma.legalComplianceAssessment.findMany.mockResolvedValue([
      { id: 'a-1', result: 'compliant', companyId: 'c-1' },
      { id: 'a-2', result: 'non_compliant', companyId: 'c-1' },
      { id: 'a-3', result: 'partially_compliant', companyId: 'c-1' },
    ]);
    mockPrisma.legalComplianceScore.upsert.mockResolvedValue({ companyId: 'c-1', percentage: 33.3, compliant: 1, nonCompliant: 1, partially: 1 });
    const r = await svc.calculateScore('c-1');
    expect(r.compliant).toBe(1);
    expect(r.nonCompliant).toBe(1);
  });
});
