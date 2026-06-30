import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompetencyService } from '../competency.service';

const mockPrisma: any = {
  competencyMatrix: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  competencyAssessment: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
};

describe('CompetencyService', () => {
  let svc: CompetencyService;
  beforeEach(() => { vi.clearAllMocks(); svc = new CompetencyService(mockPrisma); });

  it('should list competency matrices', async () => {
    mockPrisma.competencyMatrix.findMany.mockResolvedValue([{ id: 'c1', competencyItem: 'Fire Safety', assessments: [] }]);
    mockPrisma.competencyMatrix.count.mockResolvedValue(1);
    const r = await svc.findAllMatrices('c1');
    expect(r.data).toHaveLength(1);
  });

  it('should create competency matrix', async () => {
    mockPrisma.competencyMatrix.create.mockResolvedValue({ id: 'c1', competencyItem: 'Test' });
    const r = await svc.createMatrix('c1', 'u1', { positionId: 'p1', competencyItem: 'Test', requiredLevel: 'competent' });
    expect(r.id).toBe('c1');
  });

  it('should list assessments with competency item', async () => {
    mockPrisma.competencyAssessment.findMany.mockResolvedValue([{ id: 'a1', result: 'pass', competencyItem: { competencyItem: 'Fire' } }]);
    mockPrisma.competencyAssessment.count.mockResolvedValue(1);
    const r = await svc.findAllAssessments('c1');
    expect(r.data).toHaveLength(1);
  });

  it('should create assessment', async () => {
    mockPrisma.competencyAssessment.create.mockResolvedValue({ id: 'a1', result: 'pass' });
    const r = await svc.createAssessment('c1', 'u1', { userId: 'u2', competencyItemId: 'c1', assessorId: 'u3', result: 'pass', assessedDate: '2026-01-01' });
    expect(r.result).toBe('pass');
  });

  it('should soft-delete matrix', async () => {
    mockPrisma.competencyMatrix.findFirstOrThrow.mockResolvedValue({ id: 'c1' });
    mockPrisma.competencyMatrix.update.mockResolvedValue({ id: 'c1', deletedAt: new Date() });
    const r = await svc.deleteMatrix('c1', 'c1');
    expect(r.deletedAt).toBeDefined();
  });
});
