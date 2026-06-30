import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrainingNeedService } from '../training-need.service';

const mockPrisma: any = {
  trainingNeedRecord: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  inductionRecord: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  toolboxMeeting: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  toolboxAttendance: { findMany: vi.fn(), count: vi.fn(), create: vi.fn() },
  certificateRecord: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
};

describe('TrainingNeedService', () => {
  let svc: TrainingNeedService;
  beforeEach(() => { vi.clearAllMocks(); svc = new TrainingNeedService(mockPrisma); });

  it('should list training needs', async () => {
    mockPrisma.trainingNeedRecord.findMany.mockResolvedValue([{ id: 'n1', status: 'open' }]);
    mockPrisma.trainingNeedRecord.count.mockResolvedValue(1);
    const r = await svc.findAllNeeds('c1');
    expect(r.data).toHaveLength(1);
  });

  it('should create need', async () => {
    mockPrisma.trainingNeedRecord.create.mockResolvedValue({ id: 'n1', status: 'open' });
    const r = await svc.createNeed('c1', 'u1', { userId: 'u2', sourceType: 'incident', priority: 'high' });
    expect(r.status).toBe('open');
  });

  it('should waive need', async () => {
    mockPrisma.trainingNeedRecord.findFirstOrThrow.mockResolvedValue({ id: 'n1' });
    mockPrisma.trainingNeedRecord.update.mockResolvedValue({ id: 'n1', status: 'waived' });
    const r = await svc.waiveNeed('n1', 'c1', 'u1');
    expect(r.status).toBe('waived');
  });

  it('should create induction record', async () => {
    mockPrisma.inductionRecord.create.mockResolvedValue({ id: 'i1', inductionType: 'site' });
    const r = await svc.createInduction('c1', 'u1', { inductionType: 'site', userId: 'u2', conductedBy: 'u3', date: '2026-01-01' });
    expect(r.inductionType).toBe('site');
  });

  it('should create toolbox meeting', async () => {
    mockPrisma.toolboxMeeting.create.mockResolvedValue({ id: 't1', topic: 'Safety' });
    const r = await svc.createToolboxMeeting('c1', 'u1', { topic: 'Safety', date: '2026-01-01', facilitator: 'John' });
    expect(r.topic).toBe('Safety');
  });

  it('should create certificate', async () => {
    mockPrisma.certificateRecord.create.mockResolvedValue({ id: 'cert1', certificateType: 'Training Certificate' });
    const r = await svc.createCertificate('c1', 'u1', { userId: 'u2', certificateType: 'Training Certificate', issuedBy: 'Admin' });
    expect(r.certificateType).toBe('Training Certificate');
  });

  it('should renew certificate', async () => {
    mockPrisma.certificateRecord.findFirstOrThrow.mockResolvedValue({ id: 'cert1' });
    mockPrisma.certificateRecord.update.mockResolvedValue({ id: 'cert1', status: 'active' });
    const r = await svc.renewCertificate('cert1', 'c1', { issuedDate: '2026-06-01', expiryDate: '2027-06-01' });
    expect(r.status).toBe('active');
  });

  it('should revoke certificate', async () => {
    mockPrisma.certificateRecord.findFirstOrThrow.mockResolvedValue({ id: 'cert1' });
    mockPrisma.certificateRecord.update.mockResolvedValue({ id: 'cert1', status: 'revoked' });
    const r = await svc.revokeCertificate('cert1', 'c1');
    expect(r.status).toBe('revoked');
  });
});
