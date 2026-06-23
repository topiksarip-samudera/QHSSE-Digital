import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemHealthService } from '../system-health.service';

const mockPrisma: any = {
  systemHealthLog: { findFirst: vi.fn() },
  errorLog: { count: vi.fn(), findMany: vi.fn() },
  apiMetric: { count: vi.fn(), aggregate: vi.fn() },
  alertRule: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
  systemAlert: { findMany: vi.fn(), update: vi.fn() },
};

describe('SystemHealthService', () => {
  let svc: SystemHealthService;
  beforeEach(() => { vi.clearAllMocks(); svc = new SystemHealthService(mockPrisma); });

  it('should get health', async () => {
    mockPrisma.systemHealthLog.findFirst.mockResolvedValue({ cpuPercent: 45, ramPercent: 60, diskPercent: 30, dbStatus: 'connected', uptimeMin: 1440, createdAt: new Date() });
    mockPrisma.errorLog.count.mockResolvedValue(5);
    mockPrisma.apiMetric.count.mockResolvedValue(1000);
    mockPrisma.apiMetric.aggregate.mockResolvedValue({ _avg: { duration: 45 } });
    const r = await svc.getHealth();
    expect(r.cpu).toBe(45);
    expect(r.apiCalls24h).toBe(1000);
  });

  it('should create alert rule', async () => {
    mockPrisma.alertRule.create.mockResolvedValue({ id: 'a-1', name: 'CPU High', metric: 'cpu', threshold: 90 });
    const r = await svc.createAlertRule({ name: 'CPU High', metric: 'cpu', threshold: 90 });
    expect(r.name).toBe('CPU High');
  });
});
