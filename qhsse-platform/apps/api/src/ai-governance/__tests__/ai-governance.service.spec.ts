import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AiGovernanceService } from '../ai-governance.service';

const mockPrisma: any = {
  aiSetting: { findUnique: vi.fn(), upsert: vi.fn() },
  aiPromptTemplate: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  aiKnowledgeSource: { create: vi.fn(), findMany: vi.fn() },
  aiUsageLog: { findMany: vi.fn(), count: vi.fn() },
  aiOutputReview: { create: vi.fn() },
  aiProviderConfig: { findFirst: vi.fn(), upsert: vi.fn() },
};

describe('AiGovernanceService', () => {
  let svc: AiGovernanceService;
  beforeEach(() => { vi.clearAllMocks(); svc = new AiGovernanceService(mockPrisma); });

  it('should get settings default', async () => {
    mockPrisma.aiSetting.findUnique.mockResolvedValue(null);
    const r = await svc.getSettings('comp-1');
    expect(r.aiEnabled).toBe(false);
  });

  it('should create prompt template', async () => {
    mockPrisma.aiPromptTemplate.create.mockResolvedValue({ id: 'p-1', name: 'Test', module: 'incident', prompt: 'Analyze this' });
    const r = await svc.createPromptTemplate({ name: 'Test', module: 'incident', prompt: 'Analyze this' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Test');
  });

  it('should get usage logs', async () => {
    mockPrisma.aiUsageLog.findMany.mockResolvedValue([]);
    mockPrisma.aiUsageLog.count.mockResolvedValue(0);
    const r = await svc.getUsageLogs('comp-1', {});
    expect(r.data).toHaveLength(0);
  });
});
