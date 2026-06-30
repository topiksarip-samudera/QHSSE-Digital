import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AssetService } from '../asset.service';

const mockPrisma: any = {
  company: { findFirst: vi.fn() },
  assetSetting: { findUnique: vi.fn(), upsert: vi.fn(), create: vi.fn() },
  assetRegister: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetCategory: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetMaintenance: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  maintenanceSchedule: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  assetInspection: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetCertificate: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetTransfer: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetDisposal: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  assetLink: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), delete: vi.fn(), count: vi.fn() },
  assetScore: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
  $transaction: vi.fn((fns: any) => Promise.all(fns)),
};

describe('AssetService', () => {
  let svc: AssetService;
  beforeEach(() => { vi.clearAllMocks(); svc = new AssetService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.assetSetting.findUnique.mockResolvedValue(null);
    mockPrisma.assetSetting.create.mockResolvedValue({ companyId: 'c-1', enableCriticality: true, enableQrCode: true, defaultInspectionFreq: 'monthly', defaultMaintenanceFreq: 'monthly' });
    const r = await svc.getSettings('c-1');
    expect(r.defaultInspectionFreq).toBe('monthly');
  });

  it('should update settings', async () => {
    mockPrisma.assetSetting.upsert.mockResolvedValue({});
    await svc.updateSettings('c-1', { enableQrCode: false });
    expect(mockPrisma.assetSetting.upsert).toHaveBeenCalled();
  });

  it('should seed master data', async () => {
    mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g-1', name: 'Test' });
    mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataItem.create.mockResolvedValue({});
    const r = await svc.seedDefaults('c-1');
    expect(r.seeded).toBeGreaterThan(0);
  });

  it('should create asset', async () => {
    mockPrisma.assetRegister.create.mockResolvedValue({ id: 'a-1', name: 'Pump A', assetNumber: 'AS-001', companyId: 'c-1', category: {}, location: {} });
    const r = await svc.createAsset({ name: 'Pump A', assetNumber: 'AS-001', categoryId: 'cat-1' }, 'c-1', 'u-1');
    expect(r.name).toBe('Pump A');
  });

  it('should list assets with pagination', async () => {
    mockPrisma.assetRegister.findMany.mockResolvedValue([]);
    mockPrisma.assetRegister.count.mockResolvedValue(0);
    const r = await svc.findAllAssets('c-1', {});
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
  });

  it('should throw NotFoundException for missing asset', async () => {
    mockPrisma.assetRegister.findUnique.mockResolvedValue(null);
    await expect(svc.findAsset('x', 'c-1')).rejects.toThrow('Asset not found');
  });

  it('should delete asset (soft)', async () => {
    mockPrisma.assetRegister.findUnique.mockResolvedValue({ id: 'a-1', companyId: 'c-1' });
    mockPrisma.assetRegister.update.mockResolvedValue({});
    await svc.deleteAsset('a-1', 'c-1');
    expect(mockPrisma.assetRegister.update).toHaveBeenCalled();
  });

  it('should create maintenance', async () => {
    mockPrisma.assetMaintenance.create.mockResolvedValue({ id: 'm-1', title: 'Oil Change', asset: {} });
    const r = await svc.createMaintenance({ title: 'Oil Change', assetId: 'a-1', maintenanceType: 'PREVENTIVE', scheduledDate: '2026-07-01' }, 'c-1', 'u-1');
    expect(r.title).toBe('Oil Change');
  });

  it('should complete maintenance', async () => {
    mockPrisma.assetMaintenance.findUnique.mockResolvedValue({ id: 'm-1', status: 'scheduled', companyId: 'c-1' });
    mockPrisma.assetMaintenance.update.mockResolvedValue({ id: 'm-1', status: 'completed' });
    const r = await svc.completeMaintenance('m-1', 'c-1');
    expect(r.status).toBe('completed');
  });

  it('should throw on complete non-scheduled maintenance', async () => {
    mockPrisma.assetMaintenance.findUnique.mockResolvedValue({ id: 'm-1', status: 'completed', companyId: 'c-1' });
    await expect(svc.completeMaintenance('m-1', 'c-1')).rejects.toThrow();
  });

  it('should create inspection', async () => {
    mockPrisma.assetInspection.create.mockResolvedValue({ id: 'i-1', title: 'Visual Check', asset: {} });
    const r = await svc.createInspection({ title: 'Visual Check', assetId: 'a-1', inspectionType: 'VISUAL', scheduledDate: '2026-07-01', inspectorId: 'u-1' }, 'c-1', 'u-1');
    expect(r.title).toBe('Visual Check');
  });

  it('should create certificate', async () => {
    mockPrisma.assetCertificate.create.mockResolvedValue({ id: 'c-1', certificateNo: 'CERT-001', asset: {} });
    const r = await svc.createCertificate({ assetId: 'a-1', certificateType: 'CALIBRATION', certificateNo: 'CERT-001', issuedBy: 'Lab', issueDate: '2026-01-01', expiryDate: '2027-01-01' }, 'c-1', 'u-1');
    expect(r.certificateNo).toBe('CERT-001');
  });

  it('should verify certificate', async () => {
    mockPrisma.assetCertificate.findUnique.mockResolvedValue({ id: 'c-1', companyId: 'c-1' });
    mockPrisma.assetCertificate.update.mockResolvedValue({ id: 'c-1', verifiedBy: 'u-1' });
    const r = await svc.verifyCertificate('c-1', 'c-1', 'u-1');
    expect(r.verifiedBy).toBe('u-1');
  });

  it('should create transfer', async () => {
    mockPrisma.assetTransfer.create.mockResolvedValue({ id: 't-1', toLocation: 'Site B', asset: {} });
    const r = await svc.createTransfer({ assetId: 'a-1', toLocation: 'Site B', transferDate: '2026-07-01' }, 'c-1', 'u-1');
    expect(r.toLocation).toBe('Site B');
  });

  it('should approve transfer', async () => {
    mockPrisma.assetTransfer.update.mockResolvedValue({ id: 't-1', status: 'approved' });
    const r = await svc.approveTransfer('t-1', 'c-1', 'u-1');
    expect(r.status).toBe('approved');
  });

  it('should create disposal', async () => {
    mockPrisma.assetDisposal.create.mockResolvedValue({ id: 'd-1', disposalMethod: 'SALE', asset: {} });
    const r = await svc.createDisposal({ assetId: 'a-1', disposalMethod: 'SALE', disposalDate: '2026-07-01' }, 'c-1', 'u-1');
    expect(r.disposalMethod).toBe('SALE');
  });

  it('should complete disposal and update asset status', async () => {
    mockPrisma.assetDisposal.findUnique.mockResolvedValue({ id: 'd-1', assetId: 'a-1', companyId: 'c-1' });
    mockPrisma.$transaction.mockResolvedValue([{ status: 'completed' }, { status: 'disposed' }]);
    const r = await svc.completeDisposal('d-1', 'c-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('should get dashboard KPIs', async () => {
    mockPrisma.assetRegister.count.mockResolvedValueOnce(10).mockResolvedValueOnce(8).mockResolvedValueOnce(3);
    mockPrisma.assetCertificate.count.mockResolvedValue(2);
    mockPrisma.assetMaintenance.count.mockResolvedValue(5);
    const r = await svc.getDashboard('c-1');
    expect(r.totalAssets).toBe(10);
    expect(r.activeAssets).toBe(8);
  });

  it('should get score', async () => {
    mockPrisma.assetScore.findUnique.mockResolvedValue(null);
    mockPrisma.assetScore.create.mockResolvedValue({ companyId: 'c-1', totalAssets: 0, overallScore: 0 });
    const r = await svc.getScore('c-1');
    expect(r.overallScore).toBe(0);
  });

  it('should create link', async () => {
    mockPrisma.assetLink.create.mockResolvedValue({ id: 'l-1', assetId: 'a-1', linkedType: 'incident', linkedId: 'inc-1' });
    const r = await svc.createLink({ assetId: 'a-1', linkedType: 'incident', linkedId: 'inc-1' }, 'c-1');
    expect(r.linkedType).toBe('incident');
  });

  it('should enforce tenant isolation - asset', async () => {
    mockPrisma.assetRegister.findUnique.mockResolvedValue({ id: 'a-1', companyId: 'other-c' });
    await expect(svc.findAsset('a-1', 'c-1')).rejects.toThrow('Asset not found');
  });
});
