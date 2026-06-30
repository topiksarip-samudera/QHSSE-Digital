import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmergencyService } from '../emergency.service';

describe('EmergencyService', () => {
  let service: EmergencyService;

  const mockPrisma = {
    emergencySetting: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
    masterDataGroup: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    masterDataItem: { findFirst: vi.fn(), create: vi.fn() },
    emergencyPlan: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    emergencyTeam: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn() },
    emergencyTeamMember: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    emergencyContact: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn() },
    emergencyDrill: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    drillResult: { create: vi.fn(), update: vi.fn() },
    emergencyEquipment: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    emergencyIncident: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    emergencyResponse: { create: vi.fn(), findMany: vi.fn(), count: vi.fn(), update: vi.fn() },
    emergencyLink: { create: vi.fn(), findMany: vi.fn(), count: vi.fn(), deleteMany: vi.fn() },
    emergencyScore: { findUnique: vi.fn(), upsert: vi.fn() },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EmergencyService(mockPrisma);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  // ─── Settings ────────────────────────────────────────────────────────────
  describe('getSettings', () => {
    it('should return existing settings', async () => {
      mockPrisma.emergencySetting.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1', enableCrisisNotification: true });
      const result = await service.getSettings('c1');
      expect(result).toBeDefined();
      expect(result.enableCrisisNotification).toBe(true);
    });

    it('should create settings if none exist', async () => {
      mockPrisma.emergencySetting.findUnique.mockResolvedValue(null);
      mockPrisma.emergencySetting.create.mockResolvedValue({ id: 's2', companyId: 'c1', enableCrisisNotification: true });
      const result = await service.getSettings('c1');
      expect(mockPrisma.emergencySetting.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('updateSettings', () => {
    it('should upsert settings', async () => {
      mockPrisma.emergencySetting.upsert.mockResolvedValue({ id: 's1', companyId: 'c1', enableCrisisNotification: false });
      const result = await service.updateSettings('c1', { enableCrisisNotification: false });
      expect(result.enableCrisisNotification).toBe(false);
    });
  });

  // ─── Master Data ─────────────────────────────────────────────────────────
  describe('getMasterData', () => {
    it('should return master data groups with items', async () => {
      mockPrisma.masterDataGroup.findMany.mockResolvedValue([{ id: 'g1', name: 'Emergency Type', items: [{ id: 'i1', name: 'Fire' }] }]);
      const result = await service.getMasterData('c1');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Emergency Type');
    });
  });

  describe('seedDefaults', () => {
    it('should seed master data groups and items', async () => {
      mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
      mockPrisma.masterDataGroup.create.mockResolvedValue({ id: 'g1', name: 'Emergency Type' });
      mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
      mockPrisma.masterDataItem.create.mockResolvedValue({ id: 'i1', name: 'Fire' });
      const result = await service.seedDefaults('c1');
      expect(result.groups).toBeGreaterThan(0);
      expect(result.seeded).toBeGreaterThan(0);
    });

    it('should skip existing master data items', async () => {
      mockPrisma.masterDataGroup.findFirst.mockResolvedValue({ id: 'g1', name: 'Emergency Type' });
      mockPrisma.masterDataItem.findFirst.mockResolvedValue({ id: 'i1', name: 'Fire' });
      const result = await service.seedDefaults('c1');
      expect(result.seeded).toBe(0);
    });
  });

  // ─── Plans ───────────────────────────────────────────────────────────────
  describe('createPlan', () => {
    it('should create an emergency plan', async () => {
      mockPrisma.emergencyPlan.create.mockResolvedValue({ id: 'p1', name: 'Fire Plan', companyId: 'c1', emergencyType: 'Fire', status: 'draft' });
      const result = await service.createPlan({ name: 'Fire Plan', emergencyType: 'Fire' }, 'c1', 'u1');
      expect(result.name).toBe('Fire Plan');
    });
  });

  describe('findAllPlans', () => {
    it('should return paginated plans with filters', async () => {
      mockPrisma.emergencyPlan.findMany.mockResolvedValue([{ id: 'p1', name: 'Plan 1', companyId: 'c1', status: 'draft' }]);
      mockPrisma.emergencyPlan.count.mockResolvedValue(1);
      const result = await service.findAllPlans('c1', { status: 'draft', page: 1, limit: 20 });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findPlan', () => {
    it('should return a plan by id', async () => {
      mockPrisma.emergencyPlan.findFirst.mockResolvedValue({ id: 'p1', name: 'Plan 1' });
      const result = await service.findPlan('p1', 'c1');
      expect(result?.name).toBe('Plan 1');
    });

    it('should return null for invalid id', async () => {
      mockPrisma.emergencyPlan.findFirst.mockResolvedValue(null);
      const result = await service.findPlan('invalid', 'c1');
      expect(result).toBeNull();
    });
  });

  describe('deletePlan', () => {
    it('should soft-delete a plan', async () => {
      mockPrisma.emergencyPlan.updateMany.mockResolvedValue({ count: 1 });
      await service.deletePlan('p1', 'c1');
      expect(mockPrisma.emergencyPlan.updateMany).toHaveBeenCalled();
    });
  });

  describe('submitPlan', () => {
    it('should submit a draft plan', async () => {
      mockPrisma.emergencyPlan.updateMany.mockResolvedValue({ count: 1 });
      await service.submitPlan('p1', 'c1');
      expect(mockPrisma.emergencyPlan.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ id: 'p1', companyId: 'c1', status: 'draft' }),
      }));
    });
  });

  describe('approvePlan', () => {
    it('should approve a submitted plan', async () => {
      mockPrisma.emergencyPlan.updateMany.mockResolvedValue({ count: 1 });
      await service.approvePlan('p1', 'c1', 'u1');
      expect(mockPrisma.emergencyPlan.updateMany).toHaveBeenCalled();
    });
  });

  describe('activatePlan', () => {
    it('should activate an approved plan', async () => {
      mockPrisma.emergencyPlan.updateMany.mockResolvedValue({ count: 1 });
      await service.activatePlan('p1', 'c1');
      expect(mockPrisma.emergencyPlan.updateMany).toHaveBeenCalled();
    });
  });

  // ─── Teams ───────────────────────────────────────────────────────────────
  describe('createTeam', () => {
    it('should create a team', async () => {
      mockPrisma.emergencyTeam.create.mockResolvedValue({ id: 't1', name: 'ERT Alpha', companyId: 'c1' });
      const result = await service.createTeam({ name: 'ERT Alpha' }, 'c1', 'u1');
      expect(result.name).toBe('ERT Alpha');
    });
  });

  describe('findAllTeams', () => {
    it('should return paginated teams with members', async () => {
      mockPrisma.emergencyTeam.findMany.mockResolvedValue([{ id: 't1', name: 'ERT Alpha', members: [] }]);
      mockPrisma.emergencyTeam.count.mockResolvedValue(1);
      const result = await service.findAllTeams('c1', {});
      expect(result.items).toHaveLength(1);
    });
  });

  describe('addTeamMember', () => {
    it('should add a member to a team', async () => {
      mockPrisma.emergencyTeam.findFirst.mockResolvedValue({ id: 't1', companyId: 'c1' });
      mockPrisma.emergencyTeamMember.create.mockResolvedValue({ id: 'm1', teamId: 't1', role: 'Fire Warden' });
      const result = await service.addTeamMember('t1', { userId: 'u2', role: 'Fire Warden' }, 'c1');
      expect(result.role).toBe('Fire Warden');
    });

    it('should throw if team not found', async () => {
      mockPrisma.emergencyTeam.findFirst.mockResolvedValue(null);
      await expect(service.addTeamMember('invalid', { userId: 'u2', role: 'Fire Warden' }, 'c1')).rejects.toThrow('Team not found');
    });
  });

  describe('removeTeamMember', () => {
    it('should remove a member', async () => {
      mockPrisma.emergencyTeam.findFirst.mockResolvedValue({ id: 't1', companyId: 'c1' });
      mockPrisma.emergencyTeamMember.delete.mockResolvedValue({ id: 'm1' });
      await service.removeTeamMember('m1', 't1', 'c1');
      expect(mockPrisma.emergencyTeamMember.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
    });
  });

  // ─── Contacts ────────────────────────────────────────────────────────────
  describe('createContact', () => {
    it('should create a contact', async () => {
      mockPrisma.emergencyContact.create.mockResolvedValue({ id: 'c1', name: 'John', contactType: 'internal' });
      const result = await service.createContact({ name: 'John', contactType: 'internal' }, 'c1', 'u1');
      expect(result.name).toBe('John');
    });
  });

  describe('findAllContacts', () => {
    it('should return paginated contacts with filters', async () => {
      mockPrisma.emergencyContact.findMany.mockResolvedValue([{ id: 'c1', name: 'John', contactType: 'internal', status: 'active' }]);
      mockPrisma.emergencyContact.count.mockResolvedValue(1);
      const result = await service.findAllContacts('c1', { contactType: 'internal' });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('deleteContact', () => {
    it('should soft-delete a contact', async () => {
      mockPrisma.emergencyContact.updateMany.mockResolvedValue({ count: 1 });
      await service.deleteContact('c1', 'c1');
      expect(mockPrisma.emergencyContact.updateMany).toHaveBeenCalled();
    });
  });

  // ─── Drills ──────────────────────────────────────────────────────────────
  describe('createDrill', () => {
    it('should create a drill', async () => {
      mockPrisma.emergencyDrill.create.mockResolvedValue({ id: 'd1', name: 'Fire Drill Q1', drillType: 'fire', scheduledDate: new Date('2026-07-01') });
      const result = await service.createDrill({ name: 'Fire Drill Q1', drillType: 'fire', scheduledDate: '2026-07-01' }, 'c1', 'u1');
      expect(result.name).toBe('Fire Drill Q1');
    });
  });

  describe('findAllDrills', () => {
    it('should return drills with date range filter', async () => {
      mockPrisma.emergencyDrill.findMany.mockResolvedValue([{ id: 'd1', name: 'Fire Drill', results: [] }]);
      mockPrisma.emergencyDrill.count.mockResolvedValue(1);
      const result = await service.findAllDrills('c1', {});
      expect(result.items).toHaveLength(1);
    });
  });

  describe('startDrill', () => {
    it('should start a planned drill', async () => {
      mockPrisma.emergencyDrill.updateMany.mockResolvedValue({ count: 1 });
      await service.startDrill('d1', 'c1', 'u1');
      expect(mockPrisma.emergencyDrill.updateMany).toHaveBeenCalled();
    });
  });

  describe('completeDrill', () => {
    it('should complete an in-progress drill', async () => {
      mockPrisma.emergencyDrill.updateMany.mockResolvedValue({ count: 1 });
      await service.completeDrill('d1', 'c1');
      expect(mockPrisma.emergencyDrill.updateMany).toHaveBeenCalled();
    });
  });

  describe('addDrillResult', () => {
    it('should add a result to a drill', async () => {
      mockPrisma.emergencyDrill.findFirst.mockResolvedValue({ id: 'd1', companyId: 'c1' });
      mockPrisma.drillResult.create.mockResolvedValue({ id: 'r1', drillId: 'd1', score: 85 });
      const result = await service.addDrillResult('d1', { score: 85 }, 'c1', 'u1');
      expect(result.score).toBe(85);
    });

    it('should throw if drill not found', async () => {
      mockPrisma.emergencyDrill.findFirst.mockResolvedValue(null);
      await expect(service.addDrillResult('invalid', { score: 85 }, 'c1', 'u1')).rejects.toThrow('Drill not found');
    });
  });

  // ─── Equipment ───────────────────────────────────────────────────────────
  describe('createEquipment', () => {
    it('should create equipment', async () => {
      mockPrisma.emergencyEquipment.create.mockResolvedValue({ id: 'e1', name: 'FE#1', equipmentType: 'Fire Extinguisher' });
      const result = await service.createEquipment({ name: 'FE#1', equipmentType: 'Fire Extinguisher' }, 'c1', 'u1');
      expect(result.name).toBe('FE#1');
    });
  });

  describe('findAllEquipment', () => {
    it('should return equipment with filter', async () => {
      mockPrisma.emergencyEquipment.findMany.mockResolvedValue([{ id: 'e1', name: 'FE#1', inspectionStatus: 'ready' }]);
      mockPrisma.emergencyEquipment.count.mockResolvedValue(1);
      const result = await service.findAllEquipment('c1', {});
      expect(result.items).toHaveLength(1);
    });
  });

  describe('deleteEquipment', () => {
    it('should soft-delete equipment', async () => {
      mockPrisma.emergencyEquipment.updateMany.mockResolvedValue({ count: 1 });
      await service.deleteEquipment('e1', 'c1');
      expect(mockPrisma.emergencyEquipment.updateMany).toHaveBeenCalled();
    });
  });

  // ─── Incidents ───────────────────────────────────────────────────────────
  describe('createIncident', () => {
    it('should create an incident', async () => {
      mockPrisma.emergencyIncident.create.mockResolvedValue({ id: 'i1', title: 'Gas Leak', severity: 'high', status: 'reported' });
      const result = await service.createIncident({ title: 'Gas Leak', incidentType: 'Gas Leak', severity: 'high', incidentDate: '2026-06-15' }, 'c1', 'u1');
      expect(result.title).toBe('Gas Leak');
    });
  });

  describe('findAllIncidents', () => {
    it('should return incidents with filter', async () => {
      mockPrisma.emergencyIncident.findMany.mockResolvedValue([{ id: 'i1', title: 'Test', severity: 'high', responses: [] }]);
      mockPrisma.emergencyIncident.count.mockResolvedValue(1);
      const result = await service.findAllIncidents('c1', { severity: 'high' });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('deleteIncident', () => {
    it('should soft-delete an incident', async () => {
      mockPrisma.emergencyIncident.updateMany.mockResolvedValue({ count: 1 });
      await service.deleteIncident('i1', 'c1');
      expect(mockPrisma.emergencyIncident.updateMany).toHaveBeenCalled();
    });
  });

  // ─── Responses ───────────────────────────────────────────────────────────
  describe('createResponse', () => {
    it('should add response to an incident', async () => {
      mockPrisma.emergencyIncident.findFirst.mockResolvedValue({ id: 'i1', companyId: 'c1' });
      mockPrisma.emergencyResponse.create.mockResolvedValue({ id: 'r1', incidentId: 'i1', actionTaken: 'Evacuated area' });
      const result = await service.createResponse('i1', { actionTaken: 'Evacuated area' }, 'c1');
      expect(result.actionTaken).toBe('Evacuated area');
    });

    it('should throw if incident not found', async () => {
      mockPrisma.emergencyIncident.findFirst.mockResolvedValue(null);
      await expect(service.createResponse('invalid', { actionTaken: 'Test' }, 'c1')).rejects.toThrow('Incident not found');
    });
  });

  describe('findAllResponses', () => {
    it('should return incident responses', async () => {
      mockPrisma.emergencyResponse.findMany.mockResolvedValue([{ id: 'r1', actionTaken: 'Evac' }]);
      mockPrisma.emergencyResponse.count.mockResolvedValue(1);
      const result = await service.findAllResponses('c1', 'i1', {});
      expect(result.items).toHaveLength(1);
    });
  });

  // ─── Links ───────────────────────────────────────────────────────────────
  describe('createLink', () => {
    it('should create a cross-module link', async () => {
      mockPrisma.emergencyLink.create.mockResolvedValue({ id: 'l1', emergencyRecordId: 'p1', linkedModule: 'incident' });
      const result = await service.createLink('p1', { emergencyRecordType: 'plan', linkedModule: 'incident', linkedRecordId: 'inc1', linkedRecordType: 'incident_report' }, 'c1');
      expect(result.linkedModule).toBe('incident');
    });
  });

  describe('findAllLinks', () => {
    it('should return links with filter', async () => {
      mockPrisma.emergencyLink.findMany.mockResolvedValue([{ id: 'l1', linkedModule: 'incident' }]);
      mockPrisma.emergencyLink.count.mockResolvedValue(1);
      const result = await service.findAllLinks('c1', {});
      expect(result.items).toHaveLength(1);
    });
  });

  describe('deleteLink', () => {
    it('should delete a link', async () => {
      mockPrisma.emergencyLink.deleteMany.mockResolvedValue({ count: 1 });
      await service.deleteLink('l1', 'c1');
      expect(mockPrisma.emergencyLink.deleteMany).toHaveBeenCalled();
    });
  });

  // ─── Dashboard & Score ────────────────────────────────────────────────────
  describe('getDashboard', () => {
    it('should return aggregated dashboard data', async () => {
      mockPrisma.emergencyPlan.count.mockResolvedValue(5);
      mockPrisma.emergencyDrill.count.mockResolvedValue(3);
      mockPrisma.emergencyEquipment.count.mockResolvedValue(10);
      mockPrisma.emergencyIncident.count.mockResolvedValue(2);
      mockPrisma.emergencyPlan.groupBy.mockResolvedValue([{ status: 'active', _count: 3 }]);
      mockPrisma.emergencyDrill.groupBy.mockResolvedValue([{ status: 'conducted', _count: 2 }]);
      mockPrisma.emergencyEquipment.groupBy.mockResolvedValue([{ inspectionStatus: 'ready', _count: 8 }]);
      mockPrisma.emergencyIncident.groupBy.mockResolvedValue([{ status: 'resolved', _count: 1 }]);
      mockPrisma.emergencyScore.upsert.mockResolvedValue({ readinessScore: 78, drillCompletionRate: 66.7, equipmentReadyRate: 80 });
      const result = await service.getDashboard('c1');
      expect(result.totalPlans).toBe(5);
      expect(result.score).toBeDefined();
    });
  });

  describe('calculateScore', () => {
    it('should calculate and persist readiness score', async () => {
      mockPrisma.emergencyPlan.count.mockResolvedValue(5);
      mockPrisma.emergencyDrill.count.mockResolvedValue(3);
      mockPrisma.emergencyEquipment.count.mockResolvedValue(10);
      mockPrisma.emergencyIncident.count.mockResolvedValue(2);
      mockPrisma.emergencyScore.upsert.mockResolvedValue({ readinessScore: 78, drillCompletionRate: 66.7, equipmentReadyRate: 80 });
      const result = await service.calculateScore('c1');
      expect(result.readinessScore).toBe(78);
      expect(mockPrisma.emergencyScore.upsert).toHaveBeenCalled();
    });

    it('should handle zero totals without division error', async () => {
      mockPrisma.emergencyPlan.count.mockResolvedValue(0);
      mockPrisma.emergencyDrill.count.mockResolvedValue(0);
      mockPrisma.emergencyEquipment.count.mockResolvedValue(0);
      mockPrisma.emergencyIncident.count.mockResolvedValue(0);
      mockPrisma.emergencyScore.upsert.mockResolvedValue({ readinessScore: 0, drillCompletionRate: 0, equipmentReadyRate: 0 });
      const result = await service.calculateScore('c1');
      expect(result.readinessScore).toBe(0);
    });
  });
});
