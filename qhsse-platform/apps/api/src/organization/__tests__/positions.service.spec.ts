import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PositionsService } from '../positions.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  position: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  userCompanyAssignment: { findUnique: vi.fn() },
};

describe('PositionsService', () => {
  let service: PositionsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new PositionsService(mockPrisma as any);
  });

  describe('findAll', () => {
    it('should return paginated positions for super admin', async () => {
      mockPrisma.position.findMany.mockResolvedValue([{ id: 'p1', name: 'Safety Mgr', status: 'active' }]);
      mockPrisma.position.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', true);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should apply tenant filter for non-super-admin', async () => {
      mockPrisma.position.findMany.mockResolvedValue([]);
      mockPrisma.position.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', false);

      const where = mockPrisma.position.findMany.mock.calls[0][0].where;
      expect(where.company).toBeDefined();
    });

    it('should apply search filter', async () => {
      mockPrisma.position.findMany.mockResolvedValue([]);
      mockPrisma.position.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'safety' } as any, 'u1', true);

      const where = mockPrisma.position.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return position for super admin', async () => {
      mockPrisma.position.findUnique.mockResolvedValue({ id: 'p1', companyId: 'c1', status: 'active' });
      const result = await service.findOne('p1', 'u1', true);
      expect(result.id).toBe('p1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.position.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x', 'u1', true)).rejects.toThrow(NotFoundException);
    });

    it('should check tenant access for non-super-admin', async () => {
      mockPrisma.position.findUnique.mockResolvedValue({ id: 'p1', companyId: 'c1', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue(null);
      await expect(service.findOne('p1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create position with valid data', async () => {
      mockPrisma.position.findUnique.mockResolvedValue(null);
      mockPrisma.position.create.mockResolvedValue({ id: 'p1', name: 'Safety Mgr', code: 'SM' });
      const result = await service.create({ companyId: 'c1', name: 'Safety Mgr', code: 'SM' } as any, 'u1');
      expect(result.id).toBe('p1');
    });

    it('should throw ConflictException on duplicate code', async () => {
      mockPrisma.position.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ companyId: 'c1', name: 'X', code: 'DUP' } as any, 'u1')).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update position', async () => {
      mockPrisma.position.findUnique.mockResolvedValue({ id: 'p1', companyId: 'c1', code: 'OLD', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({ status: 'active' });
      mockPrisma.position.update.mockResolvedValue({ id: 'p1', name: 'Updated' });
      const result = await service.update('p1', { name: 'Updated' } as any, 'u1', false);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should soft delete for super admin', async () => {
      mockPrisma.position.findUnique.mockResolvedValue({ id: 'p1', status: 'active' });
      mockPrisma.position.update.mockResolvedValue({});
      await service.remove('p1', 'u1', true);
      expect(mockPrisma.position.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(service.remove('p1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });
});
