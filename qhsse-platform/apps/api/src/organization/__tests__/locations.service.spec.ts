import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocationsService } from '../locations.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  location: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  site: { findUnique: vi.fn() },
  userCompanyAssignment: { findUnique: vi.fn() },
};

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new LocationsService(mockPrisma as any);
  });

  describe('findAll', () => {
    it('should return paginated locations for super admin', async () => {
      mockPrisma.location.findMany.mockResolvedValue([{ id: 'l1', name: 'Building A', status: 'active' }]);
      mockPrisma.location.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', true);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should apply tenant filter for non-super-admin', async () => {
      mockPrisma.location.findMany.mockResolvedValue([]);
      mockPrisma.location.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', false);

      const where = mockPrisma.location.findMany.mock.calls[0][0].where;
      expect(where.company).toBeDefined();
    });

    it('should apply search filter', async () => {
      mockPrisma.location.findMany.mockResolvedValue([]);
      mockPrisma.location.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'building' } as any, 'u1', true);

      const where = mockPrisma.location.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return location for super admin', async () => {
      mockPrisma.location.findUnique.mockResolvedValue({ id: 'l1', companyId: 'c1', status: 'active' });
      const result = await service.findOne('l1', 'u1', true);
      expect(result.id).toBe('l1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.location.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x', 'u1', true)).rejects.toThrow(NotFoundException);
    });

    it('should check tenant access for non-super-admin', async () => {
      mockPrisma.location.findUnique.mockResolvedValue({ id: 'l1', companyId: 'c1', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue(null);
      await expect(service.findOne('l1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create location with valid data', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1' });
      mockPrisma.location.findFirst.mockResolvedValue(null);
      mockPrisma.location.create.mockResolvedValue({ id: 'l1', name: 'Bldg A', code: 'BA' });
      const result = await service.create({ companyId: 'c1', siteId: 's1', name: 'Bldg A', code: 'BA' } as any, 'u1');
      expect(result.id).toBe('l1');
    });

    it('should throw ConflictException on duplicate code in site', async () => {
      mockPrisma.site.findUnique.mockResolvedValue({ id: 's1', companyId: 'c1' });
      mockPrisma.location.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ companyId: 'c1', siteId: 's1', name: 'X', code: 'DUP' } as any, 'u1')).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update location', async () => {
      mockPrisma.location.findUnique.mockResolvedValue({ id: 'l1', companyId: 'c1', siteId: 's1', code: 'OLD', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({ status: 'active' });
      mockPrisma.location.update.mockResolvedValue({ id: 'l1', name: 'Updated' });
      const result = await service.update('l1', { name: 'Updated' } as any, 'u1', false);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should soft delete for super admin', async () => {
      mockPrisma.location.findUnique.mockResolvedValue({ id: 'l1', status: 'active' });
      mockPrisma.location.update.mockResolvedValue({});
      await service.remove('l1', 'u1', true);
      expect(mockPrisma.location.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(service.remove('l1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });
});
