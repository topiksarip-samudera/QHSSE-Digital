import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IncidentService } from '../incident.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

const mockPrisma: any = {
  incidentSetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  masterDataGroup: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn() },
  masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
  module: { findFirst: vi.fn() },
  tenantModule: { findFirst: vi.fn() },
  company: { findUnique: vi.fn() },
  incident: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  incidentStatusHistory: { create: vi.fn() },
  incidentClassification: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  incidentImpact: { deleteMany: vi.fn(), create: vi.fn(), findMany: vi.fn() },
  incidentRepeatLink: { findMany: vi.fn() },
  incidentPerson: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  incidentInjury: { findMany: vi.fn(), create: vi.fn() },
  incidentAsset: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
  incidentPropertyDamage: { findMany: vi.fn(), create: vi.fn() },
  incidentEnvironmentalImpact: { findMany: vi.fn(), create: vi.fn() },
  incidentReviewRecord: { create: vi.fn(), findMany: vi.fn() },
  incidentInvestigatorAssignment: { create: vi.fn(), findMany: vi.fn() },
  incidentInvestigation: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  incidentInvestigationTeam: { create: vi.fn() },
  incidentChronology: { create: vi.fn(), findMany: vi.fn() },
  incidentInterview: { create: vi.fn(), findMany: vi.fn() },
  incidentFailedBarrier: { create: vi.fn(), findMany: vi.fn() },
  incidentInvestigationFinding: { create: vi.fn(), findMany: vi.fn() },
};

function makeIncident(o: any = {}) { return { id: 'inc-1', companyId: 'c-1', title: 'Spill', description: 'Oil spill on floor 2', number: null, incidentDate: new Date(), reportedById: 'u-1', status: 'draft', siteId: null, statusHistories: [], ...o }; }

describe('IncidentService', () => {
  let svc: IncidentService;
  beforeEach(() => { vi.clearAllMocks(); svc = new IncidentService(mockPrisma); });

  it('should get settings with defaults', async () => {
    mockPrisma.incidentSetting.findUnique.mockResolvedValue(null);
    mockPrisma.incidentSetting.create.mockResolvedValue({ companyId: 'c-1', requireWorkflow: true, severityMatrix: [], maxReportDays: 30 });
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
    expect(r.groups).toBeGreaterThan(0);
  });

  it('should update settings', async () => {
    mockPrisma.incidentSetting.upsert.mockResolvedValue({});
    const r = await svc.updateSettings('c-1', 'u-1', { requireWorkflow: false });
    expect(mockPrisma.incidentSetting.upsert).toHaveBeenCalled();
  });

  describe('Incident CRUD', () => {

    it('should create incident', async () => {
      mockPrisma.incident.create.mockResolvedValue(makeIncident());
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      mockPrisma.incidentStatusHistory.create.mockResolvedValue({});
      const r = await svc.create({ title: 'Test', description: 'Desc', incidentDate: '2026-06-22' }, 'c-1', 'u-1');
      expect(r.title).toBe('Spill');
    });

    it('should list incidents', async () => {
      mockPrisma.incident.findMany.mockResolvedValue([makeIncident()]);
      mockPrisma.incident.count.mockResolvedValue(1);
      const r = await svc.findAll('c-1', {});
      expect(r.data).toHaveLength(1);
    });

    it('should find one with tenant check', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      const r = await svc.findOne('inc-1', 'c-1');
      expect(r.id).toBe('inc-1');
    });

    it('should throw ForbiddenException for wrong company', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident({ companyId: 'other' }));
      await expect(svc.findOne('inc-1', 'c-1')).rejects.toThrow(ForbiddenException);
    });

    it('should submit incident', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      mockPrisma.incident.update.mockResolvedValue(makeIncident({ status: 'submitted' }));
      mockPrisma.incidentStatusHistory.create.mockResolvedValue({});
      const r = await svc.submit('inc-1', 'c-1', 'u-1');
      expect(r.status).toBe('submitted');
    });

    it('should reject submit on non-draft', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident({ status: 'submitted' }));
      await expect(svc.submit('inc-1', 'c-1', 'u-1')).rejects.toThrow(BadRequestException);
    });

    it('should classify incident', async () => {
      const baseIncident = makeIncident();
      const updatedIncident = makeIncident({ actualSeverity: 'high', isHighSeverity: true, status: 'submitted' });
      (mockPrisma.incident.findUnique as any).mockResolvedValueOnce(baseIncident).mockResolvedValueOnce(updatedIncident);
      mockPrisma.incident.update.mockResolvedValue(updatedIncident);
      mockPrisma.incidentClassification.findFirst.mockResolvedValue(null);
      mockPrisma.incidentClassification.create.mockResolvedValue({});
      mockPrisma.incidentImpact.deleteMany.mockResolvedValue({});
      mockPrisma.incidentImpact.findMany.mockResolvedValue([]);
      mockPrisma.incidentRepeatLink.findMany.mockResolvedValue([]);
      const r = await svc.classify('inc-1', { actualSeverity: 'high' }, 'c-1', 'u-1');
      expect(r.incident.isHighSeverity).toBe(true);
    });
  });

  describe('People, Injury & Asset', () => {
    it('should add person', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      mockPrisma.incidentPerson.create.mockResolvedValue({ id: 'p-1', personType: 'injured', fullName: 'John' });
      const r = await svc.addPerson('inc-1', { personType: 'injured', fullName: 'John' }, 'c-1');
      expect(r.fullName).toBe('John');
    });
    it('should get assets', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      mockPrisma.incidentAsset.findMany.mockResolvedValue([]);
      const r = await svc.getAssets('inc-1', 'c-1');
      expect(Array.isArray(r)).toBe(true);
    });
    it('should add injury', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident());
      mockPrisma.incidentInjury.create.mockResolvedValue({ id: 'i-1', personId: 'p-1', bodyPart: 'Arm' });
      const r = await svc.addInjury('inc-1', { personId: 'p-1', bodyPart: 'Arm' }, 'c-1');
      expect(r.bodyPart).toBe('Arm');
    });
  });

  describe('Review & Workflow', () => {
    it('should review submitted incident', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident({ status: 'submitted' }));
      mockPrisma.incident.update.mockResolvedValue({});
      mockPrisma.incidentReviewRecord.create.mockResolvedValue({});
      mockPrisma.incidentStatusHistory.create.mockResolvedValue({});
      const r = await svc.review('inc-1', {}, 'c-1', 'u-1');
      expect(r.status).toBe('under_review');
    });
    it('should assign investigator', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident({ status: 'under_review' }));
      mockPrisma.incident.update.mockResolvedValue({});
      mockPrisma.incidentInvestigatorAssignment.create.mockResolvedValue({ id: 'a-1', incidentId: 'inc-1', investigatorId: 'inv-1' });
      mockPrisma.incidentStatusHistory.create.mockResolvedValue({});
      const r = await svc.assignInvestigator('inc-1', { investigatorId: 'inv-1' }, 'c-1', 'u-1');
      expect(r.id).toBe('a-1');
    });
  });

  describe('Investigation', () => {
    it('should start investigation', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(makeIncident({ status: 'investigation' }));
      mockPrisma.incidentInvestigation.findFirst.mockResolvedValue(null);
      mockPrisma.incidentInvestigation.create.mockResolvedValue({ id: 'inv-1', incidentId: 'inc-1' });
      mockPrisma.incidentInvestigationTeam.create.mockResolvedValue({});
      const r = await svc.startInvestigation('inc-1', 'c-1', 'u-1');
      expect(r).toBeDefined();
    });
  });
});
