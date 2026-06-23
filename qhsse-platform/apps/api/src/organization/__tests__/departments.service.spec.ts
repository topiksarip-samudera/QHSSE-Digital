import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DepartmentsService } from '../departments.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  department: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  userCompanyAssignment: { findUnique: vi.fn() },
};

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new DepartmentsService(mockPrisma as any);
  });

  describe('findAll', () => {
    it('should return paginated departments for super admin', async () => {
      mockPrisma.department.findMany.mockResolvedValue([{ id: 'd1', name: 'HR', status: 'active' }]);
      mockPrisma.department.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', true);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should apply tenant filter for non-super-admin', async () => {
      mockPrisma.department.findMany.mockResolvedValue([]);
      mockPrisma.department.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20 } as any, 'u1', false);

      const where = mockPrisma.department.findMany.mock.calls[0][0].where;
      expect(where.company).toBeDefined();
    });

    it('should apply search filter', async () => {
      mockPrisma.department.findMany.mockResolvedValue([]);
      mockPrisma.department.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'human' } as any, 'u1', true);

      const where = mockPrisma.department.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return department for super admin', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({ id: 'd1', companyId: 'c1', status: 'active' });
      const result = await service.findOne('d1', 'u1', true);
      expect(result.id).toBe('d1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.department.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x', 'u1', true)).rejects.toThrow(NotFoundException);
    });

    it('should check tenant access for non-super-admin', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({ id: 'd1', companyId: 'c1', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue(null);
      await expect(service.findOne('d1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create department with valid data', async () => {
      mockPrisma.department.findFirst.mockResolvedValue(null);
      mockPrisma.department.create.mockResolvedValue({ id: 'd1', name: 'HR', code: 'HR' });
      const result = await service.create({ companyId: 'c1', name: 'HR', code: 'HR' } as any, 'u1');
      expect(result.id).toBe('d1');
    });

    it('should throw ConflictException on duplicate code', async () => {
      mockPrisma.department.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ companyId: 'c1', name: 'X', code: 'DUP' } as any, 'u1')).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update department', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({ id: 'd1', companyId: 'c1', code: 'OLD', status: 'active' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({ status: 'active' });
      mockPrisma.department.update.mockResolvedValue({ id: 'd1', name: 'Updated' });
      const result = await service.update('d1', { name: 'Updated' } as any, 'u1', false);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should soft delete for super admin', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({ id: 'd1', status: 'active' });
      mockPrisma.department.update.mockResolvedValue({});
      await service.remove('d1', 'u1', true);
      expect(mockPrisma.department.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(service.remove('d1', 'u1', false)).rejects.toThrow(ForbiddenException);
    });
  });
});
