import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SitesService } from '../sites.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  site: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  businessUnit: { findUnique: vi.fn() },
  userCompanyAssignment: { findUnique: vi.fn() },
};

describe('SitesService', () => {
  let service: SitesService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new SitesService(mockPrisma as any);
  });

  describe('findAll', () => {
    it('should return paginated sites for super admin', async () => {
      mockPrisma.site.findMany.mockResolvedValue([{ id: 's1', name: 'HO', status: 'active' }]);
      mockPrisma.site.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', true);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      const where = mockPrisma.site.findMany.mock.calls[0][0].where;
      expect(where.company).toBeUndefined();
    });

    it('should apply tenant filter for non-super-admin', async () => {
      mockPrisma.site.findMany.mockResolvedValue([]);
      mockPrisma.site.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', false);

      const where = mockPrisma.site.findMany.mock.calls[0][0].where;
      expect(where.company).toBeDefined();
    });

    it('should apply search filter', async () => {
      mockPrisma.site.findMany.mockResolvedValue([]);
      mockPrisma.site.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'head' } as any, 'u1', true);

      const where = mockPrisma.site.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
      expect(where.OR.length).toBe(4);
    });

    it('should apply status filter', async () => {
      mockPrisma.site.findMany.mockResolvedValue([]);
      mockPrisma.site.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, status: 'active' } as any, 'u1', true);

      const where = mockPrisma.site.findMany.mock.calls[0][0].where;
      expect(where.status).toBe('active');
    });
  });

  describe('findOne', () => {
    it('should return site for super admin', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1', status: 'active' });
      const result = await service.findOne('s1', 'u1', true);
      expect(result.id).toBe('s1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.site.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x', 'u1', true)).rejects.toThrow(NotFoundException);
    });

    it('should check tenant access for non-super-admin', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue(null);
      await expect(service.findOne('s1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });

    it('should allow access for active assignment', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({ status: 'active' });
      const result = await service.findOne('s1', 'u1', false);
      expect(result.id).toBe('s1');
    });
  });

  describe('create', () => {
    it('should create site with valid data', async () => {
      mockPrisma.site.findUnique.mockResolvedValue(null);
      mockPrisma.site.create.mockResolvedValue({ id: 's1', name: 'New', code: 'N' });
      const result = await service.create({ companyId: 'c1', name: 'New', code: 'N' } as any, 'u1');
      expect(result.id).toBe('s1');
    });

    it('should throw ConflictException on duplicate code', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ companyId: 'c1', name: 'X', code: 'DUP' } as any, 'u1')).rejects.toThrow(ConflictException);
    });

    it('should validate businessUnit belongs to company', async () => {
      mockPrisma.site.findUnique.mockResolvedValue(null);
      mockPrisma.businessUnit.findUnique.mockResolvedValue({ id: 'bu1', companyId: 'other' });
      await expect(service.create({ companyId: 'c1', name: 'X', businessUnitId: 'bu1' } as any, 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update site', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1', code: 'OLD', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({ status: 'active' });
      mockPrisma.site.update.mockResolvedValue({ id: 's1', name: 'Updated' });
      const result = await service.update('s1', { name: 'Updated' } as any, 'u1', false);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should soft delete for super admin', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', status: 'active' });
      mockPrisma.site.update.mockResolvedValue({});
      await service.remove('s1', 'u1', true);
      expect(mockPrisma.site.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(service.remove('s1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });
});
