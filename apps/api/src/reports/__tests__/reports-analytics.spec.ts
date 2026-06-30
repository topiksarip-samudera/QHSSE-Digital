import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportsService } from '../reports.service';
import { DashboardsService } from '../dashboards.service';

const mockPrisma: any = {
  reportTemplate: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  reportRun: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  reportSchedule: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  reportSetting: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
  globalDashboard: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  globalDashboardWidget: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  globalDashboardFilter: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  incident: { count: vi.fn(), groupBy: vi.fn() },
  risk: { count: vi.fn(), groupBy: vi.fn() },
  audit: { count: vi.fn(), groupBy: vi.fn() },
  trainingSession: { count: vi.fn(), groupBy: vi.fn() },
  action: { count: vi.fn() },
};

describe('ReportsService', () => {
  let svc: ReportsService;
  beforeEach(() => { vi.clearAllMocks(); svc = new ReportsService(mockPrisma); });

  it('should create template', async () => {
    mockPrisma.reportTemplate.create.mockResolvedValue({ id: 't-1', name: 'Safety Report', type: 'executive' });
    const r = await svc.createTemplate({ name: 'Safety Report', type: 'executive' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Safety Report');
    expect(r.type).toBe('executive');
  });

  it('should get templates with pagination', async () => {
    mockPrisma.reportTemplate.findMany.mockResolvedValue([{ id: 't-1', name: 'Test' }]);
    mockPrisma.reportTemplate.count.mockResolvedValue(1);
    const r = await svc.getTemplates('comp-1', { page: 1, limit: 10 });
    expect(r.data).toHaveLength(1);
    expect(r.meta.total).toBe(1);
  });

  it('should throw on missing template', async () => {
    mockPrisma.reportTemplate.findUnique.mockResolvedValue(null);
    await expect(svc.getTemplate('bad-id', 'comp-1')).rejects.toThrow('Report template not found');
  });

  it('should throw on cross-company access', async () => {
    mockPrisma.reportTemplate.findUnique.mockResolvedValue({ id: 't-1', companyId: 'other-co' });
    await expect(svc.getTemplate('t-1', 'comp-1')).rejects.toThrow('Access denied');
  });

  it('should run report', async () => {
    mockPrisma.reportTemplate.findUnique.mockResolvedValue({ id: 't-1', companyId: 'comp-1' });
    mockPrisma.reportRun.create.mockResolvedValue({ id: 'r-1', status: 'pending', filePath: '/reports/test.pdf' });
    const r = await svc.runReport('t-1', { templateId: 't-1', format: 'pdf' }, 'comp-1', 'user-1');
    expect(r.status).toBe('pending');
    expect(r.runId).toBe('r-1');
  });

  it('should get run history', async () => {
    mockPrisma.reportRun.findMany.mockResolvedValue([{ id: 'r-1', status: 'completed' }]);
    mockPrisma.reportRun.count.mockResolvedValue(1);
    const r = await svc.getRunHistory('comp-1', { page: 1, limit: 10 });
    expect(r.data).toHaveLength(1);
  });

  it('should create schedule', async () => {
    mockPrisma.reportSchedule.create.mockResolvedValue({ id: 's-1', frequency: 'monthly', format: 'pdf' });
    const r = await svc.createSchedule({ templateId: 't-1', frequency: 'monthly', recipients: [] }, 'comp-1', 'user-1');
    expect(r.frequency).toBe('monthly');
  });

  it('should get schedules', async () => {
    mockPrisma.reportSchedule.findMany.mockResolvedValue([{ id: 's-1', frequency: 'monthly' }]);
    const r = await svc.getSchedules('comp-1');
    expect(r).toHaveLength(1);
  });

  it('should get/auto-create settings', async () => {
    mockPrisma.reportSetting.findUnique.mockResolvedValue(null);
    mockPrisma.reportSetting.create.mockResolvedValue({ companyId: 'comp-1', defaultFormat: 'pdf', autoExport: false, exportRetentionDays: 90, maxExportRows: 10000 });
    const r = await svc.getSettings('comp-1');
    expect(r.defaultFormat).toBe('pdf');
    expect(r.maxExportRows).toBe(10000);
  });

  it('should update settings', async () => {
    mockPrisma.reportSetting.findUnique.mockResolvedValue({ companyId: 'comp-1', defaultFormat: 'pdf' });
    mockPrisma.reportSetting.update.mockResolvedValue({ companyId: 'comp-1', defaultFormat: 'xlsx' });
    const r = await svc.updateSettings('comp-1', { defaultFormat: 'xlsx' });
    expect(r.defaultFormat).toBe('xlsx');
  });

  it('should soft-delete template', async () => {
    mockPrisma.reportTemplate.findUnique.mockResolvedValue({ id: 't-1', companyId: 'comp-1' });
    mockPrisma.reportTemplate.update.mockResolvedValue({ id: 't-1', isActive: false });
    const r = await svc.deleteTemplate('t-1', 'comp-1');
    expect(r.success).toBe(true);
  });

  it('should delete schedule', async () => {
    mockPrisma.reportSchedule.findUnique.mockResolvedValue({ id: 's-1', companyId: 'comp-1' });
    mockPrisma.reportSchedule.update.mockResolvedValue({ id: 's-1', isActive: false });
    const r = await svc.deleteSchedule('s-1', 'comp-1');
    expect(r.success).toBe(true);
  });

  it('should filter run history by templateId', async () => {
    mockPrisma.reportRun.findMany.mockResolvedValue([{ id: 'r-1', templateId: 't-1' }]);
    mockPrisma.reportRun.count.mockResolvedValue(1);
    const r = await svc.getRunHistory('comp-1', { templateId: 't-1', page: 1, limit: 10 });
    expect(r.data).toHaveLength(1);
    expect(r.meta.total).toBe(1);
  });
});

describe('DashboardsService', () => {
  let svc: DashboardsService;
  beforeEach(() => { vi.clearAllMocks(); svc = new DashboardsService(mockPrisma); });

  it('should create dashboard', async () => {
    mockPrisma.globalDashboard.create.mockResolvedValue({ id: 'd-1', name: 'Exec Dashboard', type: 'executive' });
    const r = await svc.createDashboard({ name: 'Exec Dashboard', type: 'executive' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Exec Dashboard');
  });

  it('should get dashboards with pagination', async () => {
    mockPrisma.globalDashboard.findMany.mockResolvedValue([{ id: 'd-1', name: 'Test' }]);
    mockPrisma.globalDashboard.count.mockResolvedValue(1);
    const r = await svc.getDashboards('comp-1', { page: 1, limit: 10 });
    expect(r.data).toHaveLength(1);
    expect(r.meta.total).toBe(1);
  });

  it('should throw on missing dashboard', async () => {
    mockPrisma.globalDashboard.findUnique.mockResolvedValue(null);
    await expect(svc.getDashboard('bad-id', 'comp-1')).rejects.toThrow('Dashboard not found');
  });

  it('should add widget', async () => {
    mockPrisma.globalDashboard.findUnique.mockResolvedValue({ id: 'd-1', companyId: 'comp-1' });
    mockPrisma.globalDashboardWidget.create.mockResolvedValue({ id: 'w-1', title: 'Incidents', type: 'chart' });
    const r = await svc.addWidget('d-1', { title: 'Incidents', type: 'chart', config: {} }, 'comp-1');
    expect(r.title).toBe('Incidents');
  });

  it('should add filter', async () => {
    mockPrisma.globalDashboard.findUnique.mockResolvedValue({ id: 'd-1', companyId: 'comp-1' });
    mockPrisma.globalDashboardFilter.create.mockResolvedValue({ id: 'f-1', name: 'Date', field: 'date', filterType: 'date_range' });
    const r = await svc.addFilter('d-1', { name: 'Date', field: 'date', filterType: 'date_range' }, 'comp-1');
    expect(r.name).toBe('Date');
  });

  it('should get executive dashboard', async () => {
    mockPrisma.reportSetting.findUnique.mockResolvedValue({ defaultFormat: 'pdf', autoExport: false, exportRetentionDays: 90, maxExportRows: 10000 });
    mockPrisma.incident.count.mockResolvedValue(5);
    mockPrisma.risk.count.mockResolvedValue(10);
    mockPrisma.audit.count.mockResolvedValue(3);
    mockPrisma.trainingSession.count.mockResolvedValue(7);
    mockPrisma.action.count.mockResolvedValue(12);
    const r = await svc.getExecutiveDashboard('comp-1');
    expect(r.summary.incidentsThisMonth).toBe(5);
    expect(r.summary.totalRisks).toBe(10);
  });

  it('should get KPI definitions', async () => {
    mockPrisma.incident.count.mockResolvedValue(3);
    mockPrisma.risk.count.mockResolvedValue(5);
    mockPrisma.action.count.mockResolvedValue(2);
    mockPrisma.audit.count.mockResolvedValue(8);
    const r = await svc.getKpis('comp-1');
    expect(r).toHaveLength(4);
    expect(r[0].name).toBe('TRIR');
    expect(r[3].name).toBe('Audits Completed');
  });

  it('should get module analytics', async () => {
    mockPrisma.incident.count.mockResolvedValue(25);
    mockPrisma.incident.groupBy.mockResolvedValue([{ status: 'open', _count: 10 }, { status: 'closed', _count: 15 }]);
    const r = await svc.getAnalyticsForModule('comp-1', 'incident');
    expect(r.module).toBe('incident');
    expect(r.metrics.total).toBe(25);
  });

  it('should soft-delete dashboard', async () => {
    mockPrisma.globalDashboard.findUnique.mockResolvedValue({ id: 'd-1', companyId: 'comp-1' });
    mockPrisma.globalDashboard.update.mockResolvedValue({ id: 'd-1', isActive: false });
    const r = await svc.deleteDashboard('d-1', 'comp-1');
    expect(r.success).toBe(true);
  });
});
