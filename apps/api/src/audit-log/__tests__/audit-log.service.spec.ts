import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditLogService } from '../audit-log.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  auditLog: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  activityLog: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  loginHistory: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
};

function makeAuditLog(overrides = {}) {
  return {
    id: 'log-1',
    companyId: 'comp-1',
    actorId: 'user-1',
    module: 'users',
    action: 'create',
    recordType: 'users',
    recordId: 'user-123',
    oldValue: null,
    newValue: { email: 'test@test.com' },
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    metadata: { method: 'POST', path: '/api/v1/users' },
    createdAt: new Date(),
    actor: { id: 'user-1', email: 'admin@test.com', firstName: 'Test', lastName: 'Admin' },
    ...overrides,
  };
}

describe('AuditLogService', () => {
  let service: AuditLogService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuditLogService(mockPrisma as any);
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const logs = [makeAuditLog(), makeAuditLog({ id: 'log-2' })];
      mockPrisma.auditLog.findMany.mockResolvedValue(logs);
      mockPrisma.auditLog.count.mockResolvedValue(2);

      const result = await service.getAuditLogs('comp-1', {});

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter by module', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs('comp-1', { module: 'users' });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ module: 'users' }),
        }),
      );
    });

    it('should filter by action', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs('comp-1', { action: 'delete' });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ action: 'delete' }),
        }),
      );
    });

    it('should support date range filtering', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs('comp-1', { fromDate: '2026-01-01', toDate: '2026-01-31' });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: { gte: expect.any(Date), lte: expect.any(Date) },
          }),
        }),
      );
    });

    it('should support search', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs('comp-1', { search: 'admin' });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      );
    });

    it('should include actor info', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([makeAuditLog()]);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      await service.getAuditLogs('comp-1', {});

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { actor: { select: expect.any(Object) } },
        }),
      );
    });
  });

  describe('getAuditLogById', () => {
    it('should return audit log by id', async () => {
      mockPrisma.auditLog.findUnique.mockResolvedValue(makeAuditLog());

      const result = await service.getAuditLogById('log-1', 'comp-1');

      expect(result.id).toBe('log-1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.auditLog.findUnique.mockResolvedValue(null);

      await expect(service.getAuditLogById('log-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if different company', async () => {
      mockPrisma.auditLog.findUnique.mockResolvedValue(makeAuditLog({ companyId: 'other-comp' }));

      await expect(service.getAuditLogById('log-1', 'comp-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAuditLogStats', () => {
    it('should return audit statistics', async () => {
      mockPrisma.auditLog.count.mockResolvedValue(100);
      mockPrisma.auditLog.groupBy.mockImplementation((args: any) => {
        if (args.by[0] === 'module') {
          return [{ module: 'users', _count: { id: 50 } }, { module: 'roles', _count: { id: 30 } }];
        }
        return [{ action: 'create', _count: { id: 60 } }, { action: 'update', _count: { id: 40 } }];
      });
      mockPrisma.auditLog.findMany.mockResolvedValue([makeAuditLog()]);

      const result = await service.getAuditLogStats('comp-1');

      expect(result.total).toBe(100);
      expect(result.byModule).toHaveLength(2);
      expect(result.byAction).toHaveLength(2);
      expect(result.recentActivity).toHaveLength(1);
    });
  });

  describe('exportAuditLogs', () => {
    it('should export audit logs as CSV', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([makeAuditLog()]);

      const csv = await service.exportAuditLogs('comp-1', {});

      expect(csv).toContain('ID,Timestamp,Module,Action');
      expect(csv).toContain('log-1');
      expect(csv).toContain('users');
      expect(csv).toContain('create');
    });

    it('should handle empty results', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);

      const csv = await service.exportAuditLogs('comp-1', {});

      expect(csv).toContain('ID,Timestamp,Module,Action');
      expect(csv.split('\n')).toHaveLength(2);
    });
  });

  describe('getLoginHistory', () => {
    it('should return paginated login history', async () => {
      const entries = [{ id: 'lh-1', userId: 'user-1', email: 'test@test.com', status: 'success', ipAddress: null, userAgent: null, failureReason: null, createdAt: new Date(), user: { id: 'user-1', email: 'test@test.com', firstName: 'Test', lastName: 'User' } }];
      mockPrisma.loginHistory.findMany.mockResolvedValue(entries);
      mockPrisma.loginHistory.count.mockResolvedValue(1);

      const result = await service.getLoginHistory({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.loginHistory.findMany.mockResolvedValue([]);
      mockPrisma.loginHistory.count.mockResolvedValue(0);

      await service.getLoginHistory({ status: 'failed' });

      expect(mockPrisma.loginHistory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'failed' }),
        }),
      );
    });
  });

  describe('getLoginHistoryStats', () => {
    it('should return login history statistics', async () => {
      mockPrisma.loginHistory.count.mockImplementation((args: any) => {
        if (args?.where?.status === 'success') return 80;
        if (args?.where?.status === 'failed') return 15;
        if (args?.where?.status === 'blocked') return 5;
        return 100;
      });
      mockPrisma.loginHistory.findMany.mockResolvedValue([]);

      const result = await service.getLoginHistoryStats();

      expect(result.total).toBe(100);
      expect(result.success).toBe(80);
      expect(result.failed).toBe(15);
      expect(result.blocked).toBe(5);
    });
  });

  describe('createActivityLog', () => {
    it('should create an activity log', async () => {
      const data = {
        companyId: 'comp-1',
        actorId: 'user-1',
        activity: 'login',
        entity: 'auth',
        entityId: 'session-1',
        details: { browser: 'Chrome' },
        ipAddress: '127.0.0.1',
        userAgent: 'test',
      };
      mockPrisma.activityLog.create.mockResolvedValue({ id: 'act-1', ...data, createdAt: new Date() });

      const result = await service.createActivityLog(data);

      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({ data });
      expect(result.id).toBe('act-1');
    });
  });

  describe('getActivityLogs', () => {
    it('should return paginated activity logs', async () => {
      mockPrisma.activityLog.findMany.mockResolvedValue([]);
      mockPrisma.activityLog.count.mockResolvedValue(0);

      const result = await service.getActivityLogs('comp-1', {});

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });
});
