import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CalendarScheduleService } from '../calendar-schedule.service';

const mockPrisma = {
  schedule: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  scheduleOccurrence: { create: vi.fn(), findMany: vi.fn() },
  scheduleReminder: { create: vi.fn() },
  recurrenceRule: { create: vi.fn() },
};

function makeS(o: any = {}) { return { id: 's-1', companyId: 'comp-1', name: 'Monthly Audit', type: 'audit', status: 'active', priority: 'high', startDate: new Date(), endDate: null, recurrenceId: null, occurrences: [], reminders: [], recurrence: null, ...o }; }

describe('CalendarScheduleService', () => {
  let svc: CalendarScheduleService;
  beforeEach(() => { vi.clearAllMocks(); svc = new CalendarScheduleService(mockPrisma as any); });

  it('should create schedule', async () => {
    mockPrisma.schedule.create.mockResolvedValue(makeS());
    mockPrisma.schedule.findUnique.mockResolvedValue(makeS());
    const r = await svc.create({ name: 'Test', startDate: '2026-06-22', type: 'audit' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Monthly Audit');
  });

  it('should list schedules', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([makeS()]);
    mockPrisma.schedule.count.mockResolvedValue(1);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should find one', async () => {
    mockPrisma.schedule.findUnique.mockResolvedValue(makeS());
    const r = await svc.findOne('s-1', 'comp-1');
    expect(r.id).toBe('s-1');
  });

  it('should get occurrences', async () => {
    mockPrisma.scheduleOccurrence.findMany.mockResolvedValue([]);
    const r = await svc.getOccurrences('comp-1');
    expect(Array.isArray(r)).toBe(true);
  });
});
