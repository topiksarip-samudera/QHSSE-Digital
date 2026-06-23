import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from '../users.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  userProfile: {
    create: vi.fn(),
  },
  userCompanyAssignment: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  userRoleAssignment: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  userScope: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  role: {
    findUnique: vi.fn(),
  },
  loginHistory: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  refreshToken: {
    updateMany: vi.fn(),
  },
};

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new UsersService(mockPrisma as any);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated users for super admin', async () => {
      const mockUsers = [
        { id: 'u1', email: 'a@test.com', firstName: 'A', lastName: 'B' },
        { id: 'u2', email: 'b@test.com', firstName: 'C', lastName: 'D' },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'admin-1', true);

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by company for non-super-admin', async () => {
      mockPrisma.userCompanyAssignment.findMany.mockResolvedValue([{ companyId: 'c1' }]);
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'user-1', false);

      expect(result.items).toHaveLength(0);
      expect(mockPrisma.userCompanyAssignment.findMany).toHaveBeenCalled();
    });

    it('should return empty if non-super-admin has no company assignments', async () => {
      mockPrisma.userCompanyAssignment.findMany.mockResolvedValue([]);

      const result = await service.findAll({ page: 1, pageSize: 20 } as any, 'user-1', false);

      expect(result.items).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should apply search filter', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, search: 'john' } as any, 'admin-1', true);

      const whereArg = mockPrisma.user.findMany.mock.calls[0][0].where;
      expect(whereArg.OR).toBeDefined();
      expect(whereArg.OR.length).toBe(4); // firstName, lastName, email, phone
    });

    it('should apply status filter', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, status: 'active' } as any, 'admin-1', true);

      const whereArg = mockPrisma.user.findMany.mock.calls[0][0].where;
      expect(whereArg.status).toBe('active');
    });

    it('should apply siteId filter', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await service.findAll({ page: 1, pageSize: 20, siteId: 'site-1' } as any, 'admin-1', true);

      const whereArg = mockPrisma.user.findMany.mock.calls[0][0].where;
      expect(whereArg.siteAssignments).toBeDefined();
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return user with all relations', async () => {
      const mockUser = {
        id: 'u1', email: 'test@test.com', firstName: 'Test', lastName: 'User',
        profile: { employeeId: 'E001' },
        companyAssignments: [], siteAssignments: [],
        departmentAssignments: [], positionAssignments: [],
        roles: [], scopes: [],
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('u1');

      expect(result.id).toBe('u1');
      expect(result.email).toBe('test@test.com');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ───────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create user with profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // no existing user
      mockPrisma.user.create.mockResolvedValue({
        id: 'u1', email: 'new@test.com', firstName: 'New', lastName: 'User',
        status: 'active', createdAt: new Date(), profile: {},
      });

      const result = await service.create({
        email: 'new@test.com', password: 'Pass123!',
        firstName: 'New', lastName: 'User',
      }, 'creator-1');

      expect(result.email).toBe('new@test.com');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should create user with company assignment if companyId provided', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'u1', email: 'new@test.com', firstName: 'New', lastName: 'User',
        status: 'active', createdAt: new Date(), profile: {},
      });

      await service.create({
        email: 'new@test.com', password: 'Pass123!',
        firstName: 'New', lastName: 'User', companyId: 'c1',
      }, 'creator-1');

      expect(mockPrisma.userCompanyAssignment.create).toHaveBeenCalledWith({
        data: { userId: 'u1', companyId: 'c1', isPrimary: true, status: 'active' },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@test.com' });

      await expect(service.create({
        email: 'dup@test.com', password: 'Pass123!',
        firstName: 'Dup', lastName: 'User',
      }, 'creator-1')).rejects.toThrow(ConflictException);
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update user and profile', async () => {
      // First call: find user by id (update method)
      // Second call: findUnique for email uniqueness — should return null (no conflict)
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 'u1', email: 'old@test.com' })
        .mockResolvedValueOnce(null); // no existing user with new email
      mockPrisma.user.update.mockResolvedValue({
        id: 'u1', email: 'new@test.com', firstName: 'Updated', profile: {},
      });

      const result = await service.update('u1', { email: 'new@test.com', firstName: 'Updated' }, 'updater-1');

      expect(result.email).toBe('new@test.com');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', {}, 'updater-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email is taken', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'old@test.com' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'u1', email: 'old@test.com' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'other', email: 'taken@test.com' });

      await expect(service.update('u1', { email: 'taken@test.com' }, 'updater-1')).rejects.toThrow(ConflictException);
    });
  });

  // ─── remove (soft delete) ─────────────────────────────────────────────────
  describe('remove', () => {
    it('should soft delete user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', isSuperAdmin: false });
      mockPrisma.user.update.mockResolvedValue({ id: 'u1', status: 'archived' });

      const result = await service.remove('u1', 'deleter-1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { deletedAt: expect.any(Date), status: 'archived' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'deleter-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if trying to delete super admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', isSuperAdmin: true });

      await expect(service.remove('u1', 'deleter-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── activate ─────────────────────────────────────────────────────────────
  describe('activate', () => {
    it('should activate inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'inactive' });
      mockPrisma.user.update.mockResolvedValue({ id: 'u1', email: 'a@b.com', status: 'active' });

      const result = await service.activate('u1');

      expect(result.status).toBe('active');
    });

    it('should throw BadRequestException if already active', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'active' });

      await expect(service.activate('u1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.activate('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deactivate ───────────────────────────────────────────────────────────
  describe('deactivate', () => {
    it('should deactivate active user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'active', isSuperAdmin: false });
      mockPrisma.user.update.mockResolvedValue({ id: 'u1', email: 'a@b.com', status: 'inactive' });

      const result = await service.deactivate('u1');

      expect(result.status).toBe('inactive');
    });

    it('should throw ForbiddenException if trying to deactivate super admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'active', isSuperAdmin: true });

      await expect(service.deactivate('u1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if already inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'inactive', isSuperAdmin: false });

      await expect(service.deactivate('u1')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── assignRole ───────────────────────────────────────────────────────────
  describe('assignRole', () => {
    it('should assign role to user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', name: 'admin' });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.userRoleAssignment.create.mockResolvedValue({
        id: 'ra1', userId: 'u1', roleId: 'r1',
        role: { id: 'r1', name: 'admin' },
      });

      const result = await service.assignRole('u1', { roleId: 'r1' }, 'assigner-1');

      expect(result.role.name).toBe('admin');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.assignRole('nonexistent', { roleId: 'r1' }, 'assigner-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.assignRole('u1', { roleId: 'bad' }, 'assigner-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if role already assigned', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', name: 'admin' });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.assignRole('u1', { roleId: 'r1' }, 'assigner-1')).rejects.toThrow(ConflictException);
    });
  });

  // ─── removeRole ───────────────────────────────────────────────────────────
  describe('removeRole', () => {
    it('should remove role assignment', async () => {
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ id: 'ra1' });
      mockPrisma.userRoleAssignment.delete.mockResolvedValue({ id: 'ra1' });

      await service.removeRole('u1', 'r1');

      expect(mockPrisma.userRoleAssignment.delete).toHaveBeenCalledWith({ where: { id: 'ra1' } });
    });

    it('should throw NotFoundException if assignment not found', async () => {
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);

      await expect(service.removeRole('u1', 'r1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── assignScope ──────────────────────────────────────────────────────────
  describe('assignScope', () => {
    it('should assign scope to user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.userScope.findFirst.mockResolvedValue(null);
      mockPrisma.userScope.create.mockResolvedValue({
        id: 's1', userId: 'u1', companyId: 'c1',
      });

      const result = await service.assignScope('u1', { companyId: 'c1' });

      expect(result.companyId).toBe('c1');
    });

    it('should throw ConflictException if scope already assigned', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.userScope.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.assignScope('u1', { companyId: 'c1' })).rejects.toThrow(ConflictException);
    });
  });

  // ─── removeScope ──────────────────────────────────────────────────────────
  describe('removeScope', () => {
    it('should remove scope', async () => {
      mockPrisma.userScope.findUnique.mockResolvedValue({ id: 's1' });
      mockPrisma.userScope.delete.mockResolvedValue({ id: 's1' });

      await service.removeScope('s1');

      expect(mockPrisma.userScope.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    });

    it('should throw NotFoundException if scope not found', async () => {
      mockPrisma.userScope.findUnique.mockResolvedValue(null);

      await expect(service.removeScope('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getLoginHistory ──────────────────────────────────────────────────────
  describe('getLoginHistory', () => {
    it('should return paginated login history', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });
      mockPrisma.loginHistory.findMany.mockResolvedValue([
        { id: 'lh1', status: 'success', createdAt: new Date() },
      ]);
      mockPrisma.loginHistory.count.mockResolvedValue(1);

      const result = await service.getLoginHistory('u1', 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getLoginHistory('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── resetPassword ────────────────────────────────────────────────────────
  describe('resetPassword', () => {
    it('should reset password and revoke tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', deletedAt: null });
      mockPrisma.user.update.mockResolvedValue({ id: 'u1' });
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.resetPassword('u1', 'NewPass123!');

      expect(result.message).toContain('Password reset');
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword('nonexistent', 'NewPass123!')).rejects.toThrow(NotFoundException);
    });
  });
});
