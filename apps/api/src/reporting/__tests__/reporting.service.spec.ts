import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportingService } from '../reporting.service';

const mockPrisma: any = {
  reportTemplate: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  reportRun: { create: vi.fn(), findMany: vi.fn() },
  reportRecipient: { create: vi.fn() },
  scheduledReport: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
};

describe('ReportingService', () => {
  let svc: ReportingService;
  beforeEach(() => { vi.clearAllMocks(); svc = new ReportingService(mockPrisma); });

  it('should create template', async () => {
    mockPrisma.reportTemplate.create.mockResolvedValue({ id: 't-1', name: 'Monthly Safety', type: 'monthly_qhsse' });
    const r = await svc.createTemplate({ name: 'Monthly Safety', type: 'monthly_qhsse' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Monthly Safety');
  });

  it('should run report', async () => {
    mockPrisma.reportTemplate.findUnique.mockResolvedValue({ id: 't-1', companyId: 'comp-1' });
    mockPrisma.reportRun.create.mockResolvedValue({ id: 'r-1', status: 'completed', filePath: 'reports/test.pdf' });
    const r = await svc.runReport('t-1', 'comp-1', 'user-1');
    expect(r.status).toBe('completed');
  });

  it('should create scheduled report', async () => {
    mockPrisma.scheduledReport.create.mockResolvedValue({ id: 's-1', name: 'Monthly Report', frequency: 'monthly' });
    const r = await svc.createScheduledReport({ templateId: 't-1', name: 'Monthly Report' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Monthly Report');
  });
});
