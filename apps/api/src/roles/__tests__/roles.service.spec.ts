import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RolesService } from '../roles.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  role: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  permission: {
    findMany: vi.fn(),
  },
  rolePermission: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
    delete: vi.fn(),
  },
  userRoleAssignment: {
    findMany: vi.fn(),
  },
  userCompanyAssignment: {
    findMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new RolesService(mockPrisma as any);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated roles for super admin', async () => {
      const mockRoles = [
        { id: 'r1', name: 'Super Admin', code: 'super_admin', isSystem: true },
        { id: 'r2', name: 'Company Admin', code: 'company_admin', isSystem: true },
      ];
      mockPrisma.role.findMany.mockResolvedValue(mockRoles);
      mockPrisma.role.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'admin-1', true);

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by company for non-super-admin', async () => {
      mockPrisma.userCompanyAssignment.findMany.mockResolvedValue([{ companyId: 'c1' }]);
      mockPrisma.role.findMany.mockResolvedValue([]);
      mockPrisma.role.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'user-1', false);

      expect(result.items).toHaveLength(0);
      expect(mockPrisma.userCompanyAssignment.findMany).toHaveBeenCalled();
    });

    it('should return empty if non-super-admin has no company assignments', async () => {
      mockPrisma.userCompanyAssignment.findMany.mockResolvedValue([]);
      mockPrisma.role.findMany.mockResolvedValue([]);
      mockPrisma.role.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'user-1', false);

      expect(result.items).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should apply search filter', async () => {
      mockPrisma.role.findMany.mockResolvedValue([]);
      mockPrisma.role.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'admin' } as any, 'admin-1', true);

      expect(mockPrisma.role.findMany).toHaveBeenCalled();
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return role with permissions and users', async () => {
      const mockRole = {
        id: 'r1',
        name: 'Safety Officer',
        code: 'safety_officer',
        permissions: [],
        userRoles: [],
        _count: { permissions: 5, userRoles: 3 },
      };
      mockPrisma.role.findUnique.mockResolvedValue(mockRole);

      const result = await service.findOne('r1');

      expect(result.id).toBe('r1');
      expect(result.name).toBe('Safety Officer');
    });

    it('should throw NotFoundException when role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ───────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create a new role', async () => {
      mockPrisma.role.findFirst.mockResolvedValue(null);
      mockPrisma.role.create.mockResolvedValue({
        id: 'r1',
        name: 'Safety Officer',
        code: 'safety_officer',
        description: 'Responsible for safety',
        isSystem: false,
        companyId: null,
        status: 'active',
        createdAt: new Date(),
      });

      const result = await service.create(
        { name: 'Safety Officer', code: 'safety_officer', description: 'Responsible for safety' },
        'creator-1',
      );

      expect(result.name).toBe('Safety Officer');
      expect(result.code).toBe('safety_officer');
      expect(result.isSystem).toBe(false);
      expect(mockPrisma.role.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Safety Officer',
          code: 'safety_officer',
          isSystem: false,
          createdBy: 'creator-1',
        }),
        select: expect.any(Object),
      });
    });

    it('should throw ConflictException when code already exists in scope', async () => {
      mockPrisma.role.findFirst.mockResolvedValue({ id: 'r1', code: 'safety_officer' });

      await expect(
        service.create({ name: 'Safety Officer', code: 'safety_officer' }, 'creator-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should create role with company scope', async () => {
      mockPrisma.role.findFirst.mockResolvedValue(null);
      mockPrisma.role.create.mockResolvedValue({
        id: 'r1',
        name: 'Site Manager',
        code: 'site_manager',
        companyId: 'c1',
        isSystem: false,
      });

      await service.create(
        { name: 'Site Manager', code: 'site_manager', companyId: 'c1' },
        'creator-1',
      );

      expect(mockPrisma.role.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ companyId: 'c1' }),
        select: expect.any(Object),
      });
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update a custom role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'Safety Officer',
        isSystem: false,
        deletedAt: null,
      });
      mockPrisma.role.update.mockResolvedValue({
        id: 'r1',
        name: 'Senior Safety Officer',
        code: 'safety_officer',
      });

      const result = await service.update('r1', { name: 'Senior Safety Officer' }, 'updater-1');

      expect(result.name).toBe('Senior Safety Officer');
      expect(mockPrisma.role.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', { name: 'X' }, 'updater-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when modifying system role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'Super Admin',
        isSystem: true,
        deletedAt: null,
      });

      await expect(service.update('r1', { name: 'Hack' }, 'updater-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── remove ──────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should soft delete a custom role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'Safety Officer',
        isSystem: false,
        deletedAt: null,
        _count: { userRoles: 0 },
      });
      mockPrisma.role.update.mockResolvedValue({ id: 'r1' });

      await service.remove('r1', 'deleter-1');

      expect(mockPrisma.role.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      });
    });

    it('should throw ForbiddenException when deleting system role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'Super Admin',
        isSystem: true,
        deletedAt: null,
        _count: { userRoles: 0 },
      });

      await expect(service.remove('r1', 'deleter-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when role has assigned users', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'Safety Officer',
        isSystem: false,
        deletedAt: null,
        _count: { userRoles: 3 },
      });

      await expect(service.remove('r1', 'deleter-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'deleter-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getPermissionMatrix ─────────────────────────────────────────────────
  describe('getPermissionMatrix', () => {
    it('should return permissions grouped by module', async () => {
      mockPrisma.permission.findMany.mockResolvedValue([
        { id: 'p1', module: 'company', action: 'view', description: 'view company' },
        { id: 'p2', module: 'company', action: 'create', description: 'create company' },
        { id: 'p3', module: 'user', action: 'view', description: 'view user' },
      ]);

      const result = await service.getPermissionMatrix();

      expect(Object.keys(result)).toContain('company');
      expect(Object.keys(result)).toContain('user');
      expect(result['company']).toHaveLength(2);
      expect(result['user']).toHaveLength(1);
    });
  });

  // ─── getAllPermissions ────────────────────────────────────────────────────
  describe('getAllPermissions', () => {
    it('should return flat list of all permissions', async () => {
      const perms = [
        { id: 'p1', module: 'company', action: 'view' },
        { id: 'p2', module: 'user', action: 'create' },
      ];
      mockPrisma.permission.findMany.mockResolvedValue(perms);

      const result = await service.getAllPermissions();

      expect(result).toHaveLength(2);
    });
  });

  // ─── setRolePermissions ──────────────────────────────────────────────────
  describe('setRolePermissions', () => {
    it('should replace all role permissions', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', deletedAt: null });
      mockPrisma.permission.findMany.mockResolvedValue([
        { id: 'p1' },
        { id: 'p2' },
      ]);
      mockPrisma.$transaction.mockResolvedValue([]);
      // findOne for the return
      mockPrisma.role.findUnique.mockResolvedValueOnce({ id: 'r1', deletedAt: null }).mockResolvedValueOnce({
        id: 'r1',
        name: 'Test Role',
        permissions: [{ permission: { id: 'p1' } }, { permission: { id: 'p2' } }],
        userRoles: [],
        _count: { permissions: 2, userRoles: 0 },
      });

      const result = await service.setRolePermissions('r1', { permissionIds: ['p1', 'p2'] });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException when role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(
        service.setRolePermissions('nonexistent', { permissionIds: ['p1'] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when permission IDs are invalid', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', deletedAt: null });
      mockPrisma.permission.findMany.mockResolvedValue([{ id: 'p1' }]); // Only 1 of 2 found

      await expect(
        service.setRolePermissions('r1', { permissionIds: ['p1', 'p_invalid'] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── addRolePermissions ──────────────────────────────────────────────────
  describe('addRolePermissions', () => {
    it('should append new permissions to role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', deletedAt: null });
      mockPrisma.permission.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);
      mockPrisma.rolePermission.findMany.mockResolvedValue([{ permissionId: 'p1' }]); // p1 already exists
      mockPrisma.rolePermission.createMany.mockResolvedValue({ count: 1 });
      // findOne for return
      mockPrisma.role.findUnique.mockResolvedValueOnce({ id: 'r1', deletedAt: null }).mockResolvedValueOnce({
        id: 'r1',
        name: 'Test Role',
        permissions: [],
        userRoles: [],
        _count: { permissions: 2, userRoles: 0 },
      });

      await service.addRolePermissions('r1', { permissionIds: ['p1', 'p2'] });

      // Should only create p2 (p1 already exists)
      expect(mockPrisma.rolePermission.createMany).toHaveBeenCalledWith({
        data: [{ roleId: 'r1', permissionId: 'p2' }],
      });
    });
  });

  // ─── removeRolePermission ────────────────────────────────────────────────
  describe('removeRolePermission', () => {
    it('should remove a permission from a role', async () => {
      mockPrisma.rolePermission.findUnique.mockResolvedValue({ id: 'rp1' });
      mockPrisma.rolePermission.delete.mockResolvedValue({});

      const result = await service.removeRolePermission('r1', 'p1');

      expect(result.message).toBe('Permission removed from role');
    });

    it('should throw NotFoundException when assignment not found', async () => {
      mockPrisma.rolePermission.findUnique.mockResolvedValue(null);

      await expect(service.removeRolePermission('r1', 'p1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getRolePermissions ──────────────────────────────────────────────────
  describe('getRolePermissions', () => {
    it('should return role with its permissions', async () => {
      mockPrisma.role.findUnique.mockResolvedValueOnce({
        id: 'r1',
        name: 'Safety Officer',
        code: 'safety_officer',
      });
      mockPrisma.rolePermission.findMany.mockResolvedValue([
        { permission: { id: 'p1', module: 'company', action: 'view' } },
        { permission: { id: 'p2', module: 'user', action: 'create' } },
      ]);

      const result = await service.getRolePermissions('r1');

      expect(result.role.name).toBe('Safety Officer');
      expect(result.permissions).toHaveLength(2);
    });

    it('should throw NotFoundException when role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.getRolePermissions('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
