import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NumberingService } from '../numbering.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  numberingRule: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  numberingCounter: { create: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  numberingHistory: { create: vi.fn() },
};

function makeRule(o: any = {}) { return { id: 'r-1', companyId: 'comp-1', name: 'Incident', moduleCode: 'incident', prefix: 'INC', suffix: '', digitCount: 5, connector: '-', resetBy: null, sample: 'INC-00001', isActive: true, nextNumber: 1, counters: [{ id: 'c-1', counter: 5 }], histories: [], ...o }; }

describe('NumberingService', () => {
  let service: NumberingService;
  beforeEach(() => { vi.clearAllMocks(); service = new NumberingService(mockPrisma as any); });

  it('should create a rule', async () => {
    mockPrisma.numberingRule.create.mockResolvedValue(makeRule());
    mockPrisma.numberingCounter.create.mockResolvedValue({});
    const r = await service.create({ name: 'Test', moduleCode: 'test' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Incident');
  });

  it('should generate number', async () => {
    mockPrisma.numberingRule.findUnique.mockResolvedValue(makeRule());
    mockPrisma.numberingCounter.findFirst.mockResolvedValue({ id: 'c-1', counter: 5 });
    mockPrisma.numberingCounter.update.mockResolvedValue({});
    mockPrisma.numberingHistory.create.mockResolvedValue({});
    const r = await service.generateNumber('r-1', 'comp-1', { recordType: 'incident', recordId: 'INC-1' }, 'user-1');
    expect(r.number).toBe('INC-00006');
  });

  it('should list rules', async () => {
    mockPrisma.numberingRule.findMany.mockResolvedValue([makeRule()]);
    mockPrisma.numberingRule.count.mockResolvedValue(1);
    const r = await service.findAll('comp-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should find one', async () => {
    mockPrisma.numberingRule.findUnique.mockResolvedValue(makeRule());
    const r = await service.findOne('r-1', 'comp-1');
    expect(r.id).toBe('r-1');
  });

  it('should throw not found', async () => {
    mockPrisma.numberingRule.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x', 'comp-1')).rejects.toThrow(NotFoundException);
  });
});
