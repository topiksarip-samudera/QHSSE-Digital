import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateService } from '../template.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';

const mockPrisma = {
  template: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
  templateVersion: { create: vi.fn() },
  templateCategory: { create: vi.fn(), findMany: vi.fn() },
  templateAssignment: { create: vi.fn(), findMany: vi.fn(), delete: vi.fn() },
};

function makeT(o: any = {}) { return { id: 't-1', companyId: 'comp-1', name: 'Test', description: null, content: {}, type: 'document', status: Status.draft, version: 1, isGlobal: false, createdBy: 'user-1', category: null, versions: [], assignments: [], ...o }; }

describe('TemplateService', () => {
  let svc: TemplateService;
  beforeEach(() => { vi.clearAllMocks(); svc = new TemplateService(mockPrisma as any); });

  it('should create', async () => {
    mockPrisma.template.create.mockResolvedValue(makeT());
    const r = await svc.create({ name: 'Test' }, 'comp-1', 'user-1');
    expect(r.name).toBe('Test');
  });

  it('should list', async () => {
    mockPrisma.template.findMany.mockResolvedValue([makeT()]);
    mockPrisma.template.count.mockResolvedValue(1);
    const r = await svc.findAll('comp-1', {});
    expect(r.data).toHaveLength(1);
  });

  it('should find one', async () => {
    mockPrisma.template.findUnique.mockResolvedValue(makeT());
    const r = await svc.findOne('t-1');
    expect(r.id).toBe('t-1');
  });

  it('should throw on published edit', async () => {
    mockPrisma.template.findUnique.mockResolvedValue(makeT({ status: Status.active, companyId: 'comp-1' }));
    await expect(svc.update('t-1', { name: 'X' }, 'comp-1')).rejects.toThrow(BadRequestException);
  });

  it('should publish', async () => {
    mockPrisma.template.findUnique.mockResolvedValue(makeT({ status: Status.draft }));
    mockPrisma.templateVersion.create.mockResolvedValue({});
    mockPrisma.template.update.mockResolvedValue({});
    const r = await svc.publish('t-1', 'comp-1', 'user-1');
    expect(mockPrisma.templateVersion.create).toHaveBeenCalled();
  });

  it('should clone', async () => {
    mockPrisma.template.findUnique.mockResolvedValue(makeT());
    mockPrisma.template.create.mockResolvedValue(makeT({ id: 't-2', name: 'Test (Copy)' }));
    const r = await svc.clone('t-1', 'comp-1', 'user-1');
    expect(r.name).toContain('(Copy)');
  });
});
