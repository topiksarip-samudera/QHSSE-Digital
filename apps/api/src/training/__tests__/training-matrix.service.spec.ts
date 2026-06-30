import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrainingMatrixService } from '../training-matrix.service';

const mockPrisma: any = {
  trainingMatrix: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  trainingPlan: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  trainingSession: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
  trainingAttendance: { findMany: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), findFirstOrThrow: vi.fn() },
};

describe('TrainingMatrixService', () => {
  let svc: TrainingMatrixService;
  beforeEach(() => { vi.clearAllMocks(); svc = new TrainingMatrixService(mockPrisma); });

  it('should list matrices', async () => {
    mockPrisma.trainingMatrix.findMany.mockResolvedValue([{ id: 'm1', type: 'role' }]);
    mockPrisma.trainingMatrix.count.mockResolvedValue(1);
    const r = await svc.findAllMatrices('c1');
    expect(r.data).toHaveLength(1);
    expect(r.total).toBe(1);
  });

  it('should create matrix', async () => {
    mockPrisma.trainingMatrix.create.mockResolvedValue({ id: 'm1' });
    const r = await svc.createMatrix('c1', 'u1', { type: 'role', requirement: 'mandatory' });
    expect(r.id).toBe('m1');
  });

  it('should list plans', async () => {
    mockPrisma.trainingPlan.findMany.mockResolvedValue([{ id: 'p1', title: 'Test', sessions: [] }]);
    mockPrisma.trainingPlan.count.mockResolvedValue(1);
    const r = await svc.findAllPlans('c1');
    expect(r.data).toHaveLength(1);
  });

  it('should create session', async () => {
    mockPrisma.trainingSession.create.mockResolvedValue({ id: 's1', status: 'scheduled' });
    const r = await svc.createSession('c1', 'u1', { planId: 'p1', actualDate: '2026-01-01' });
    expect(r.status).toBe('scheduled');
  });

  it('should close session', async () => {
    mockPrisma.trainingSession.findFirstOrThrow.mockResolvedValue({ id: 's1' });
    mockPrisma.trainingSession.update.mockResolvedValue({ id: 's1', status: 'completed' });
    const r = await svc.closeSession('s1', 'c1');
    expect(r.status).toBe('completed');
  });

  it('should create attendance', async () => {
    mockPrisma.trainingAttendance.create.mockResolvedValue({ id: 'a1', status: 'attended' });
    const r = await svc.createAttendance('c1', { sessionId: 's1', userId: 'u1' });
    expect(r.status).toBe('attended');
  });

  it('should soft-delete matrix', async () => {
    mockPrisma.trainingMatrix.findFirstOrThrow.mockResolvedValue({ id: 'm1' });
    mockPrisma.trainingMatrix.update.mockResolvedValue({ id: 'm1', deletedAt: new Date() });
    const r = await svc.deleteMatrix('m1', 'c1');
    expect(r.deletedAt).toBeDefined();
  });
});
