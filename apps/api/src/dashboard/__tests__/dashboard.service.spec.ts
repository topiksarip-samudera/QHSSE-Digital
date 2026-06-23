import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardService } from '../dashboard.service';

const mockPrisma = {
  action: {
    count: vi.fn(),
    findMany: vi.fn(),
    groupBy: vi.fn(),
  },
  workflowInstance: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  workflowInstanceStep: {
    findMany: vi.fn(),
  },
  notification: {
    count: vi.fn(),
  },
  userCompanyAssignment: {
    count: vi.fn(),
  },
  user: {
    count: vi.fn(),
  },
  site: {
    count: vi.fn(),
  },
  department: {
    count: vi.fn(),
  },
  company: {
    count: vi.fn(),
  },
  auditLog: {
    findMany: vi.fn(),
  },
  tenantModule: {
    count: vi.fn(),
  },
  attachment: {
    count: vi.fn(),
  },
  userRoleAssignment: {
    groupBy: vi.fn(),
  },
  role: {
    findMany: vi.fn(),
  },
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DashboardService(mockPrisma as any);
  });

  describe('getPersonalDashboard', () => {
    it('should return personal dashboard data', async () => {
      mockPrisma.action.count.mockResolvedValue(5);
      mockPrisma.workflowInstanceStep.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(3);
      mockPrisma.workflowInstance.count.mockResolvedValue(2);
      mockPrisma.action.groupBy.mockResolvedValue([
        { priority: 'high', _count: { id: 3 } },
        { priority: 'medium', _count: { id: 2 } },
      ]);
      mockPrisma.action.findMany.mockResolvedValue([]);

      const result = await service.getPersonalDashboard('user-1', 'comp-1');

      expect(result.summary.myActions).toBe(5);
      expect(result.summary.unreadNotifications).toBe(3);
      expect(result.summary.myWorkflowInstances).toBe(2);
    });

    it('should return zero counts for new user', async () => {
      mockPrisma.action.count.mockResolvedValue(0);
      mockPrisma.workflowInstance.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);
      mockPrisma.workflowInstance.count.mockResolvedValue(0);
      mockPrisma.action.groupBy.mockResolvedValue([]);
      mockPrisma.action.findMany.mockResolvedValue([]);

      const result = await service.getPersonalDashboard('user-new', 'comp-1');

      expect(result.summary.myActions).toBe(0);
      expect(result.summary.pendingApprovals).toBe(0);
    });
  });

  describe('getAdminDashboard', () => {
    it('should return admin dashboard data', async () => {
      mockPrisma.userCompanyAssignment.count.mockResolvedValue(50);
      mockPrisma.user.count.mockResolvedValue(42);
      mockPrisma.site.count.mockResolvedValue(10);
      mockPrisma.department.count.mockResolvedValue(8);
      mockPrisma.company.count.mockResolvedValue(3);
      mockPrisma.action.count.mockResolvedValue(120);
      mockPrisma.action.groupBy.mockResolvedValue([]);
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.tenantModule.count.mockResolvedValue(13);
      mockPrisma.attachment.count.mockResolvedValue(45);
      mockPrisma.userRoleAssignment.groupBy.mockResolvedValue([]);

      const result = await service.getAdminDashboard('comp-1');

      expect(result.summary.totalUsers).toBe(50);
      expect(result.summary.activeUsers).toBe(42);
      expect(result.summary.totalSites).toBe(10);
      expect(result.summary.totalAttachments).toBe(45);
    });

    it('should handle empty company', async () => {
      mockPrisma.userCompanyAssignment.count.mockResolvedValue(0);
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.site.count.mockResolvedValue(0);
      mockPrisma.department.count.mockResolvedValue(0);
      mockPrisma.company.count.mockResolvedValue(0);
      mockPrisma.action.count.mockResolvedValue(0);
      mockPrisma.action.groupBy.mockResolvedValue([]);
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.tenantModule.count.mockResolvedValue(0);
      mockPrisma.attachment.count.mockResolvedValue(0);
      mockPrisma.userRoleAssignment.groupBy.mockResolvedValue([]);

      const result = await service.getAdminDashboard('comp-empty');

      expect(result.summary.totalUsers).toBe(0);
      expect(result.summary.totalAttachments).toBe(0);
    });
  });

  describe('getQHSSEDashboard', () => {
    it('should return QHSSE dashboard data', async () => {
      mockPrisma.action.count
        .mockResolvedValueOnce(100) // totalActions
        .mockResolvedValueOnce(60)  // openActions
        .mockResolvedValueOnce(15); // overdueActions
      mockPrisma.action.groupBy
        .mockResolvedValueOnce([
          { priority: 'high', _count: { id: 40 } },
          { priority: 'medium', _count: { id: 35 } },
        ])
        .mockResolvedValueOnce([
          { status: 'open', _count: { id: 30 } },
          { status: 'closed', _count: { id: 40 } },
        ]);
      mockPrisma.action.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(25);

      const result = await service.getQHSSEDashboard('comp-1');

      expect(result.summary.totalActions).toBe(100);
      expect(result.summary.openActions).toBe(60);
      expect(result.summary.overdueActions).toBe(15);
      expect(result.summary.completionRate).toBe(40); // 40 closed / 100 total * 100
    });

    it('should return 0% completion rate for zero actions', async () => {
      mockPrisma.action.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockPrisma.action.groupBy.mockResolvedValue([]);
      mockPrisma.action.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);

      const result = await service.getQHSSEDashboard('comp-1');

      expect(result.summary.completionRate).toBe(0);
    });
  });
});
