import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImportExportService } from '../import-export.service';

const mockPrisma = {
  importJob: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn(), count: vi.fn() },
  importJobRow: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  exportJob: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  exportLog: { create: vi.fn() },
};

describe('ImportExportService', () => {
  let svc: ImportExportService;
  beforeEach(() => { vi.clearAllMocks(); svc = new ImportExportService(mockPrisma as any); });

  it('should upload import', async () => {
    mockPrisma.importJob.create.mockResolvedValue({ id: 'j-1', totalRows: 2 });
    mockPrisma.importJobRow.create.mockResolvedValue({});
    const file = { buffer: Buffer.from('name,email\nTest,test@test.com\nTest2,test2@test.com'), originalname: 'test.csv' } as Express.Multer.File;
    const r = await svc.uploadImport(file, 'users', 'comp-1', 'user-1');
    expect((r as any).rows).toBe(2);
  });

  it('should commit import', async () => {
    mockPrisma.importJob.findUnique.mockResolvedValue({ id: 'j-1', companyId: 'comp-1' });
    mockPrisma.importJobRow.findMany.mockResolvedValue([{ id: 'r-1', data: { name: 'Test', email: 'test@test.com' } }]);
    mockPrisma.importJobRow.update.mockResolvedValue({});
    mockPrisma.importJob.update.mockResolvedValue({});
    const r = await svc.commitImport('j-1', 'comp-1');
    expect(r.total).toBe(1);
  });

  it('should list imports', async () => {
    mockPrisma.importJob.findMany.mockResolvedValue([]);
    mockPrisma.importJob.count.mockResolvedValue(0);
    const r = await svc.getImportHistory('comp-1', {});
    expect(r.data).toHaveLength(0);
  });

  it('should create export', async () => {
    mockPrisma.exportJob.create.mockResolvedValue({ id: 'e-1', fileName: 'users-export.csv' });
    mockPrisma.exportLog.create.mockResolvedValue({});
    const r = await svc.createExport({ moduleCode: 'users' }, 'comp-1', 'user-1');
    expect(r.id).toBe('e-1');
    expect(mockPrisma.exportLog.create).toHaveBeenCalled();
  });
});
