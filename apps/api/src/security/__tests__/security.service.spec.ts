import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityService } from '../security.service';

const mockPrisma: any = {
  company: { findFirst: vi.fn() },
  securitySetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  securityIncident: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  visitorRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  gatePass: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  idBadge: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  accessControl: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  securityPatrol: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  lostItem: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  theftRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  unauthorizedAccess: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  securityInvestigation: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  securityAction: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  securityLink: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), delete: vi.fn(), count: vi.fn() },
  securityScore: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
};

describe('SecurityService', () => {
  let svc: SecurityService;
  beforeEach(() => { vi.clearAllMocks(); svc = new SecurityService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.securitySetting.findUnique.mockResolvedValue(null);
    mockPrisma.securitySetting.create.mockResolvedValue({ companyId: 'c-1', requireBadgeCheck: true, defaultPatrolFrequencyHrs: 4, visitorExpiryHrs: 24, requireInvestigation: true, autoEscalate: true });
    const r = await svc.getSettings('c-1');
    expect(r.requireBadgeCheck).toBe(true);
  });

  it('should update settings', async () => {
    mockPrisma.securitySetting.upsert.mockResolvedValue({});
    await svc.updateSettings('c-1', { requireBadgeCheck: false });
    expect(mockPrisma.securitySetting.upsert).toHaveBeenCalled();
  });

  it('should create incident', async () => {
    mockPrisma.securityIncident.create.mockResolvedValue({ id: 'i-1', title: 'Test Incident', companyId: 'c-1' });
    const r = await svc.createIncident({ title: 'Test Incident', incidentType: 'Theft', incidentDate: '2025-01-01T00:00:00Z' }, 'c-1', 'u-1');
    expect(r.title).toBe('Test Incident');
  });

  it('should list incidents', async () => {
    mockPrisma.securityIncident.findMany.mockResolvedValue([{ id: 'i-1', title: 'Test', companyId: 'c-1' }]);
    mockPrisma.securityIncident.count.mockResolvedValue(1);
    const r = await svc.findAllIncidents('c-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should throw on non-existent incident', async () => {
    mockPrisma.securityIncident.findUnique.mockResolvedValue(null);
    await expect(svc.findIncident('bad-id', 'c-1')).rejects.toThrow('Incident not found');
  });

  it('should create visitor', async () => {
    mockPrisma.visitorRecord.create.mockResolvedValue({ id: 'v-1', visitorName: 'John Doe', companyId: 'c-1', status: 'checked_in' });
    const r = await svc.createVisitor({ visitorName: 'John Doe' }, 'c-1', 'u-1');
    expect(r.visitorName).toBe('John Doe');
  });

  it('should check in visitor', async () => {
    mockPrisma.visitorRecord.findUnique.mockResolvedValue({ id: 'v-1', companyId: 'c-1', status: 'pending' });
    mockPrisma.visitorRecord.update.mockResolvedValue({ id: 'v-1', status: 'checked_in' });
    const r = await svc.checkInVisitor('v-1', 'c-1', 'u-1');
    expect(r.status).toBe('checked_in');
  });

  it('should check out visitor', async () => {
    mockPrisma.visitorRecord.findUnique.mockResolvedValue({ id: 'v-1', companyId: 'c-1', status: 'checked_in' });
    mockPrisma.visitorRecord.update.mockResolvedValue({ id: 'v-1', status: 'checked_out' });
    const r = await svc.checkOutVisitor('v-1', 'c-1');
    expect(r.status).toBe('checked_out');
  });

  it('should create gate pass', async () => {
    mockPrisma.gatePass.create.mockResolvedValue({ id: 'g-1', passNumber: 'GP-001', companyId: 'c-1' });
    const r = await svc.createGatePass({ passNumber: 'GP-001' }, 'c-1', 'u-1');
    expect(r.passNumber).toBe('GP-001');
  });

  it('should create badge', async () => {
    mockPrisma.idBadge.create.mockResolvedValue({ id: 'b-1', badgeNumber: 'B-001', companyId: 'c-1' });
    const r = await svc.createBadge({ userId: 'u-1', badgeNumber: 'B-001', issuedDate: '2025-01-01T00:00:00Z', expiryDate: '2026-01-01T00:00:00Z' }, 'c-1', 'u-1');
    expect(r.badgeNumber).toBe('B-001');
  });

  it('should revoke badge', async () => {
    mockPrisma.idBadge.findUnique.mockResolvedValue({ id: 'b-1', companyId: 'c-1' });
    mockPrisma.idBadge.update.mockResolvedValue({ id: 'b-1', status: 'suspended' });
    const r = await svc.revokeBadge('b-1', 'c-1');
    expect(r.status).toBe('suspended');
  });

  it('should create patrol', async () => {
    mockPrisma.securityPatrol.create.mockResolvedValue({ id: 'p-1', patrolArea: 'Gate A', companyId: 'c-1' });
    const r = await svc.createPatrol({ patrolArea: 'Gate A', checkpointName: 'CP-1', checkpointOrder: 1, scheduledTime: '2025-01-01T00:00:00Z', patrolledBy: 'u-1' }, 'c-1', 'u-1');
    expect(r.patrolArea).toBe('Gate A');
  });

  it('should complete patrol', async () => {
    mockPrisma.securityPatrol.findUnique.mockResolvedValue({ id: 'p-1', companyId: 'c-1' });
    mockPrisma.securityPatrol.update.mockResolvedValue({ id: 'p-1', status: 'completed' });
    const r = await svc.completePatrol('p-1', 'c-1', 'All clear');
    expect(r.status).toBe('completed');
  });

  it('should create investigation', async () => {
    mockPrisma.securityInvestigation.create.mockResolvedValue({ id: 'inv-1', incidentId: 'i-1', companyId: 'c-1' });
    const r = await svc.createInvestigation({ incidentId: 'i-1', investigatorId: 'u-1' }, 'c-1', 'u-1');
    expect(r.incidentId).toBe('i-1');
  });

  it('should create security action', async () => {
    mockPrisma.securityAction.create.mockResolvedValue({ id: 'a-1', title: 'Fix gate', companyId: 'c-1' });
    const r = await svc.createSecurityAction({ incidentId: 'i-1', actionType: 'Corrective', title: 'Fix gate', assignedTo: 'u-1' }, 'c-1', 'u-1');
    expect(r.title).toBe('Fix gate');
  });

  it('should verify action', async () => {
    mockPrisma.securityAction.findUnique.mockResolvedValue({ id: 'a-1', companyId: 'c-1' });
    mockPrisma.securityAction.update.mockResolvedValue({ id: 'a-1', status: 'verified' });
    const r = await svc.verifyAction('a-1', 'v-1', 'c-1');
    expect(r.status).toBe('verified');
  });

  it('should get dashboard', async () => {
    mockPrisma.securityScore.findUnique.mockResolvedValue({ companyId: 'c-1', score: 95 });
    mockPrisma.securityIncident.count.mockResolvedValue(5);
    mockPrisma.visitorRecord.count.mockResolvedValue(3);
    mockPrisma.securityPatrol.count.mockResolvedValue(10);
    mockPrisma.securityInvestigation.count.mockResolvedValue(1);
    mockPrisma.securityAction.count.mockResolvedValue(2);
    mockPrisma.gatePass.count.mockResolvedValue(1);
    const r = await svc.getDashboard('c-1');
    expect(r.score).toBe(95);
    expect(r.totalIncidents).toBe(5);
  });

  it('should seed master data', async () => {
    mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g-1', name: 'Test' });
    mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
    mockPrisma.masterDataItem.create.mockResolvedValue({});
    const r = await svc.seedDefaults('c-1');
    expect(r.seeded).toBeGreaterThan(0);
  });
});
