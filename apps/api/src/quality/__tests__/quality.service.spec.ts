import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QualityService } from '../quality.service';
import { QualityInspectionService } from '../quality-inspection.service';
import { QualityCapaService } from '../quality-capa.service';
import { QualityLinkService } from '../quality-link.service';

const mockPrisma: any = {
  company: { findFirst: vi.fn() },
  qualitySetting: { findUnique: vi.fn(), upsert: vi.fn(), create: vi.fn() },
  ncrRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
  customerComplaint: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  supplierQualityRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  materialReceivingRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  inspectionTestPlan: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  inspectionResult: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  punchList: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  defectRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  disposition: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  qualityCapaRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  calibrationEquipment: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  qualityLink: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), delete: vi.fn(), count: vi.fn() },
  qualityScore: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
};

describe('QualityService', () => {
  let svc: QualityService;
  beforeEach(() => { vi.clearAllMocks(); svc = new QualityService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.qualitySetting.findUnique.mockResolvedValue(null);
    mockPrisma.qualitySetting.create.mockResolvedValue({ companyId: 'c-1', requireRootCauseMajorNcr: true, defaultNcrDueDays: 14, requireDisposition: true, requireCapaVerification: true });
    const r = await svc.getSettings('c-1');
    expect(r.defaultNcrDueDays).toBe(14);
  });

  it('should update settings', async () => {
    mockPrisma.qualitySetting.upsert.mockResolvedValue({});
    await svc.updateSettings('c-1', { requireDisposition: false });
    expect(mockPrisma.qualitySetting.upsert).toHaveBeenCalled();
  });

  it('should seed master data', async () => {
    mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g-1', name: 'Test' });
    mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataItem.create.mockResolvedValue({});
    const r = await svc.seedDefaults('c-1');
    expect(r.seeded).toBeGreaterThan(0);
  });

  it('should create NCR', async () => {
    mockPrisma.ncrRecord.create.mockResolvedValue({ id: 'n-1', title: 'Test NCR', companyId: 'c-1' });
    const r = await svc.createNcr({ title: 'Test NCR', ncrType: 'PRODUCT', reportedBy: 'u-1' }, 'c-1', 'u-1');
    expect(r.title).toBe('Test NCR');
  });

  it('should list NCRs with pagination', async () => {
    mockPrisma.ncrRecord.findMany.mockResolvedValue([]);
    mockPrisma.ncrRecord.count.mockResolvedValue(0);
    const r = await svc.findAllNcr('c-1', {});
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
  });

  it('should submit NCR from draft', async () => {
    mockPrisma.ncrRecord.findUnique.mockResolvedValue({ id: 'n-1', status: 'draft', companyId: 'c-1' });
    mockPrisma.ncrRecord.update.mockResolvedValue({ id: 'n-1', status: 'submitted' });
    const r = await svc.submitNcr('n-1', 'c-1');
    expect(r.status).toBe('submitted');
  });

  it('should throw on submit non-draft NCR', async () => {
    mockPrisma.ncrRecord.findUnique.mockResolvedValue({ id: 'n-1', status: 'submitted', companyId: 'c-1' });
    await expect(svc.submitNcr('n-1', 'c-1')).rejects.toThrow();
  });

  it('should close NCR', async () => {
    mockPrisma.ncrRecord.findUnique.mockResolvedValue({ id: 'n-1', companyId: 'c-1' });
    mockPrisma.ncrRecord.update.mockResolvedValue({ id: 'n-1', status: 'closed', closedAt: new Date() });
    const r = await svc.closeNcr('n-1', 'c-1');
    expect(r.status).toBe('closed');
  });

  it('should create complaint', async () => {
    mockPrisma.customerComplaint.create.mockResolvedValue({ id: 'c-1', title: 'Bad quality', customerName: 'Acme', companyId: 'c-1' });
    const r = await svc.createComplaint({ title: 'Bad quality', customerName: 'Acme', complaintDate: '2026-01-01' }, 'c-1', 'u-1');
    expect(r.customerName).toBe('Acme');
  });

  it('should create supplier quality record', async () => {
    mockPrisma.supplierQualityRecord.create.mockResolvedValue({ id: 's-1', title: 'Rejected batch', supplierName: 'XYZ Ltd', companyId: 'c-1' });
    const r = await svc.createSupplierQuality({ title: 'Rejected batch', supplierName: 'XYZ Ltd', receivingDate: '2026-01-01', materialType: 'Steel' }, 'c-1', 'u-1');
    expect(r.supplierName).toBe('XYZ Ltd');
  });

  it('should create disposition', async () => {
    mockPrisma.disposition.create.mockResolvedValue({ id: 'd-1', ncrId: 'n-1', dispositionType: 'REPAIR', companyId: 'c-1' });
    const r = await svc.createDisposition({ ncrId: 'n-1', dispositionType: 'REPAIR' }, 'c-1', 'u-1');
    expect(r.dispositionType).toBe('REPAIR');
  });
});

describe('QualityInspectionService', () => {
  let svc: QualityInspectionService;
  beforeEach(() => { vi.clearAllMocks(); svc = new QualityInspectionService(mockPrisma); });

  it('should create material receiving record', async () => {
    mockPrisma.materialReceivingRecord.create.mockResolvedValue({ id: 'm-1', title: 'Steel plates', supplierName: 'ABC Steel', companyId: 'c-1' });
    const r = await svc.createMaterialReceiving({ title: 'Steel plates', supplierName: 'ABC Steel', materialName: 'Plate A36', receivingDate: '2026-01-01' }, 'c-1', 'u-1');
    expect(r.title).toBe('Steel plates');
  });

  it('should create ITP', async () => {
    mockPrisma.inspectionTestPlan.create.mockResolvedValue({ id: 'i-1', title: 'Welding ITP', itpNumber: 'ITP-001', companyId: 'c-1' });
    const r = await svc.createItp({ title: 'Welding ITP', itpNumber: 'ITP-001' }, 'c-1', 'u-1');
    expect(r.itpNumber).toBe('ITP-001');
  });

  it('should create inspection result', async () => {
    mockPrisma.inspectionResult.create.mockResolvedValue({ id: 'ir-1', inspectionPoint: 'Visual check', passFail: 'pass', companyId: 'c-1' });
    const r = await svc.createInspectionResult({ itpId: 'i-1', inspectionPoint: 'Visual check', criteria: 'No cracks', inspectorId: 'u-1', inspectedAt: '2026-01-01' }, 'c-1', 'u-1');
    expect(r.passFail).toBe('pass');
  });

  it('should create punch list', async () => {
    mockPrisma.punchList.create.mockResolvedValue({ id: 'p-1', title: 'Fix door hinges', companyId: 'c-1' });
    const r = await svc.createPunchList({ title: 'Fix door hinges' }, 'c-1', 'u-1');
    expect(r.title).toBe('Fix door hinges');
  });

  it('should create defect', async () => {
    mockPrisma.defectRecord.create.mockResolvedValue({ id: 'd-1', title: 'Crack in weld', defectType: 'STRUCTURAL', companyId: 'c-1' });
    const r = await svc.createDefect({ title: 'Crack in weld', defectType: 'STRUCTURAL', foundDate: '2026-01-01', foundBy: 'u-1' }, 'c-1', 'u-1');
    expect(r.defectType).toBe('STRUCTURAL');
  });
});

describe('QualityCapaService', () => {
  let svc: QualityCapaService;
  beforeEach(() => { vi.clearAllMocks(); svc = new QualityCapaService(mockPrisma); });

  it('should create CAPA', async () => {
    mockPrisma.qualityCapaRecord.create.mockResolvedValue({ id: 'c-1', title: 'Fix procedure', capaType: 'CORRECTIVE', companyId: 'c-1' });
    const r = await svc.createCapa({ title: 'Fix procedure', capaType: 'CORRECTIVE' }, 'c-1', 'u-1');
    expect(r.capaType).toBe('CORRECTIVE');
  });

  it('should verify CAPA', async () => {
    mockPrisma.qualityCapaRecord.findUnique.mockResolvedValue({ id: 'c-1', companyId: 'c-1' });
    mockPrisma.qualityCapaRecord.update.mockResolvedValue({ id: 'c-1', status: 'verified', verifiedById: 'u-2' });
    const r = await svc.verifyCapa('c-1', 'c-1', 'u-2');
    expect(r.status).toBe('verified');
  });

  it('should get quality score', async () => {
    mockPrisma.qualityScore.findUnique.mockResolvedValue({ id: 's-1', companyId: 'c-1', ncrCount: 0 });
    mockPrisma.ncrRecord.count.mockResolvedValue(5);
    mockPrisma.customerComplaint.count.mockResolvedValue(2);
    mockPrisma.supplierQualityRecord.count.mockResolvedValue(1);
    mockPrisma.qualityCapaRecord.count.mockResolvedValue(3);
    mockPrisma.qualityScore.update.mockResolvedValue({ percentage: 75, score: 75, ncrCount: 5 });
    const r = await svc.getScore('c-1');
    expect(r.percentage).toBeDefined();
  });

  it('should get dashboard', async () => {
    mockPrisma.ncrRecord.count.mockResolvedValue(10);
    mockPrisma.qualityCapaRecord.count.mockResolvedValue(2);
    mockPrisma.ncrRecord.groupBy.mockResolvedValue([{ severity: 'major', _count: 5 }]);
    mockPrisma.calibrationEquipment.count.mockResolvedValue(3);
    mockPrisma.customerComplaint.count.mockResolvedValue(4);
    mockPrisma.supplierQualityRecord.count.mockResolvedValue(6);
    mockPrisma.defectRecord.count.mockResolvedValue(7);
    mockPrisma.punchList.count.mockResolvedValue(8);
    const r = await svc.getDashboard('c-1');
    expect(r).toHaveProperty('openNcr');
    expect(r).toHaveProperty('overdueCapa');
  });
});

describe('QualityLinkService', () => {
  let svc: QualityLinkService;
  beforeEach(() => { vi.clearAllMocks(); svc = new QualityLinkService(mockPrisma); });

  it('should create link', async () => {
    mockPrisma.qualityLink.create.mockResolvedValue({ id: 'l-1', qualityRecordId: 'n-1', linkedModule: 'audit', companyId: 'c-1' });
    const r = await svc.createLink({ qualityRecordId: 'n-1', qualityRecordType: 'NCR', linkedModule: 'audit', linkedRecordId: 'a-1', linkedRecordType: 'AuditFinding' }, 'c-1');
    expect(r.linkedModule).toBe('audit');
  });

  it('should list links', async () => {
    mockPrisma.qualityLink.findMany.mockResolvedValue([{ id: 'l-1', qualityRecordId: 'n-1' }]);
    mockPrisma.qualityLink.count.mockResolvedValue(1);
    const r = await svc.findLinks('c-1', {});
    expect(r.data).toHaveLength(1);
  });
});
