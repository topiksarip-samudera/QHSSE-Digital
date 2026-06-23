import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ModuleManagementService } from '../module-management.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  module: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  moduleFeature: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  tenantModule: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  tenantFeatureFlag: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  roleModuleAccess: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  tenant: {
    findUnique: vi.fn(),
  },
  role: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(),
};

describe('ModuleManagementService', () => {
  let service: ModuleManagementService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ModuleManagementService(mockPrisma as any);
  });

  // ═══════════════════════════════════════════════════════════════════════
  // MODULES
  // ═══════════════════════════════════════════════════════════════════════

  describe('findAllModules', () => {
    it('should return paginated modules', async () => {
      const mockModules = [
        { id: 'm1', name: 'Risk Management', code: 'risk-management', features: [], _count: { tenantModules: 1 } },
        { id: 'm2', name: 'Incident Management', code: 'incident-management', features: [], _count: { tenantModules: 0 } },
      ];
      mockPrisma.module.findMany.mockResolvedValue(mockModules);
      mockPrisma.module.count.mockResolvedValue(2);

      const result = await service.findAllModules({ page: 1, pageSize: 50 });

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
    });

    it('should apply search filter', async () => {
      mockPrisma.module.findMany.mockResolvedValue([]);
      mockPrisma.module.count.mockResolvedValue(0);

      await service.findAllModules({ page: 1, search: 'risk' });

      const whereArg = mockPrisma.module.findMany.mock.calls[0][0].where;
      expect(whereArg.OR).toBeDefined();
    });

    it('should filter by active status', async () => {
      mockPrisma.module.findMany.mockResolvedValue([]);
      mockPrisma.module.count.mockResolvedValue(0);

      await service.findAllModules({ page: 1, status: 'active' });

      const whereArg = mockPrisma.module.findMany.mock.calls[0][0].where;
      expect(whereArg.isActive).toBe(true);
    });

    it('should filter by inactive status', async () => {
      mockPrisma.module.findMany.mockResolvedValue([]);
      mockPrisma.module.count.mockResolvedValue(0);

      await service.findAllModules({ page: 1, status: 'inactive' });

      const whereArg = mockPrisma.module.findMany.mock.calls[0][0].where;
      expect(whereArg.isActive).toBe(false);
    });
  });

  describe('findOneModule', () => {
    it('should return module with features and tenant assignments', async () => {
      const mockModule = {
        id: 'm1',
        name: 'Risk Management',
        code: 'risk-management',
        features: [{ id: 'f1', name: 'Risk Register' }],
        tenantModules: [],
        roleModuleAccess: [],
      };
      mockPrisma.module.findUnique.mockResolvedValue(mockModule);

      const result = await service.findOneModule('m1');

      expect(result.id).toBe('m1');
      expect(result.features).toHaveLength(1);
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(service.findOneModule('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createModule', () => {
    it('should create a new module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null); // No existing
      mockPrisma.module.create.mockResolvedValue({
        id: 'm1',
        name: 'Test Module',
        code: 'test-module',
        features: [],
      });

      const result = await service.createModule({
        name: 'Test Module',
        code: 'test-module',
      });

      expect(result.name).toBe('Test Module');
      expect(mockPrisma.module.create).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate code', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1', code: 'existing' });

      await expect(
        service.createModule({ name: 'Test', code: 'existing' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateModule', () => {
    it('should update a module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1' });
      mockPrisma.module.update.mockResolvedValue({
        id: 'm1',
        name: 'Updated Name',
        features: [],
      });

      const result = await service.updateModule('m1', { name: 'Updated Name' }, 'user-1');

      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(
        service.updateModule('non-existent', { name: 'Test' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteModule', () => {
    it('should delete a module with no active tenants', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1', name: 'Test' });
      mockPrisma.tenantModule.count.mockResolvedValue(0);
      mockPrisma.module.delete.mockResolvedValue({ id: 'm1' });

      const result = await service.deleteModule('m1', 'user-1');

      expect(result.id).toBe('m1');
      expect(mockPrisma.module.delete).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if module has active tenants', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1', name: 'Test' });
      mockPrisma.tenantModule.count.mockResolvedValue(3);

      await expect(service.deleteModule('m1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(service.deleteModule('non-existent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // FEATURES
  // ═══════════════════════════════════════════════════════════════════════

  describe('createFeature', () => {
    it('should create a feature for a module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1', name: 'Risk Management' });
      mockPrisma.moduleFeature.findUnique.mockResolvedValue(null);
      mockPrisma.moduleFeature.create.mockResolvedValue({
        id: 'f1',
        moduleId: 'm1',
        name: 'Risk Register',
        code: 'risk-register',
      });

      const result = await service.createFeature('m1', {
        name: 'Risk Register',
        code: 'risk-register',
      });

      expect(result.name).toBe('Risk Register');
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(
        service.createFeature('non-existent', { name: 'Test', code: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for duplicate feature code', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1', name: 'Test' });
      mockPrisma.moduleFeature.findUnique.mockResolvedValue({ id: 'f1' });

      await expect(
        service.createFeature('m1', { name: 'Test', code: 'existing' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateFeature', () => {
    it('should update a feature', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue({ id: 'f1' });
      mockPrisma.moduleFeature.update.mockResolvedValue({
        id: 'f1',
        name: 'Updated Feature',
      });

      const result = await service.updateFeature('f1', { name: 'Updated Feature' });

      expect(result.name).toBe('Updated Feature');
    });

    it('should throw NotFoundException for non-existent feature', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue(null);

      await expect(
        service.updateFeature('non-existent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteFeature', () => {
    it('should delete a feature', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue({ id: 'f1' });
      mockPrisma.moduleFeature.delete.mockResolvedValue({ id: 'f1' });

      const result = await service.deleteFeature('f1');

      expect(result.id).toBe('f1');
    });

    it('should throw NotFoundException for non-existent feature', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue(null);

      await expect(service.deleteFeature('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TENANT MODULE TOGGLE
  // ═══════════════════════════════════════════════════════════════════════

  describe('getTenantModules', () => {
    it('should return all active modules with tenant status', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1', name: 'Demo' });
      mockPrisma.module.findMany.mockResolvedValue([
        { id: 'm1', name: 'Risk Management', code: 'risk-management', isActive: true, features: [], sortOrder: 1 },
      ]);
      mockPrisma.tenantModule.findMany.mockResolvedValue([
        { moduleId: 'm1', isEnabled: true },
      ]);
      mockPrisma.tenantFeatureFlag.findMany.mockResolvedValue([]);

      const result = await service.getTenantModules('t1');

      expect(result).toHaveLength(1);
      expect(result[0].isEnabled).toBe(true);
    });

    it('should throw NotFoundException for non-existent tenant', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue(null);

      await expect(service.getTenantModules('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should default to disabled if no tenant module record exists', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.module.findMany.mockResolvedValue([
        { id: 'm1', name: 'Test', code: 'test', isActive: true, features: [], sortOrder: 1 },
      ]);
      mockPrisma.tenantModule.findMany.mockResolvedValue([]);
      mockPrisma.tenantFeatureFlag.findMany.mockResolvedValue([]);

      const result = await service.getTenantModules('t1');

      expect(result[0].isEnabled).toBe(false);
    });
  });

  describe('toggleTenantModule', () => {
    it('should enable a module for a tenant', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1' });
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.tenantModule.upsert.mockResolvedValue({
        id: 'tm1',
        isEnabled: true,
        module: { id: 'm1' },
        tenant: { id: 't1', name: 'Demo' },
      });

      const result = await service.toggleTenantModule('t1', 'm1', { isEnabled: true }, 'user-1');

      expect(result.isEnabled).toBe(true);
    });

    it('should disable a module for a tenant', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1' });
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.tenantModule.upsert.mockResolvedValue({
        id: 'tm1',
        isEnabled: false,
        module: { id: 'm1' },
        tenant: { id: 't1', name: 'Demo' },
      });

      const result = await service.toggleTenantModule('t1', 'm1', { isEnabled: false }, 'user-1');

      expect(result.isEnabled).toBe(false);
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(
        service.toggleTenantModule('t1', 'non-existent', { isEnabled: true }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent tenant', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1' });
      mockPrisma.tenant.findUnique.mockResolvedValue(null);

      await expect(
        service.toggleTenantModule('non-existent', 'm1', { isEnabled: true }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleTenantFeature', () => {
    it('should enable a feature for a tenant', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue({
        id: 'f1',
        moduleId: 'm1',
        module: { name: 'Risk Management' },
      });
      mockPrisma.tenantModule.findUnique.mockResolvedValue({ isEnabled: true });
      mockPrisma.tenantFeatureFlag.upsert.mockResolvedValue({
        id: 'tf1',
        isEnabled: true,
        feature: { id: 'f1' },
      });

      const result = await service.toggleTenantFeature('t1', 'f1', { isEnabled: true }, 'user-1');

      expect(result.isEnabled).toBe(true);
    });

    it('should throw BadRequestException if parent module is not enabled', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue({
        id: 'f1',
        moduleId: 'm1',
        module: { name: 'Risk Management' },
      });
      mockPrisma.tenantModule.findUnique.mockResolvedValue(null);

      await expect(
        service.toggleTenantFeature('t1', 'f1', { isEnabled: true }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existent feature', async () => {
      mockPrisma.moduleFeature.findUnique.mockResolvedValue(null);

      await expect(
        service.toggleTenantFeature('t1', 'non-existent', { isEnabled: true }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ROLE MODULE ACCESS
  // ═══════════════════════════════════════════════════════════════════════

  describe('getRoleModuleAccess', () => {
    it('should return module access for a role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1', name: 'Admin' });
      mockPrisma.module.findMany.mockResolvedValue([
        { id: 'm1', name: 'Risk', code: 'risk', icon: 'shield', sortOrder: 1, isActive: true },
      ]);
      mockPrisma.roleModuleAccess.findMany.mockResolvedValue([
        { moduleId: 'm1', canAccess: true },
      ]);

      const result = await service.getRoleModuleAccess('t1', 'r1');

      expect(result).toHaveLength(1);
      expect(result[0].canAccess).toBe(true);
    });

    it('should throw NotFoundException for non-existent role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.getRoleModuleAccess('t1', 'non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setRoleModuleAccess', () => {
    it('should set module access for a role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1' });
      mockPrisma.module.findUnique.mockResolvedValue({ id: 'm1' });
      mockPrisma.roleModuleAccess.upsert.mockResolvedValue({
        roleId: 'r1',
        moduleId: 'm1',
        canAccess: true,
      });

      const result = await service.setRoleModuleAccess('t1', 'r1', 'm1', true);

      expect(result.canAccess).toBe(true);
    });

    it('should throw NotFoundException for non-existent role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(
        service.setRoleModuleAccess('t1', 'non-existent', 'm1', true),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent module', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'r1' });
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(
        service.setRoleModuleAccess('t1', 'r1', 'non-existent', true),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // BULK OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  describe('bulkToggleTenantModules', () => {
    it('should toggle multiple modules', async () => {
      mockPrisma.module.findUnique
        .mockResolvedValueOnce({ id: 'm1' })
        .mockResolvedValueOnce({ id: 'm2' });
      mockPrisma.tenant.findUnique
        .mockResolvedValueOnce({ id: 't1' })
        .mockResolvedValueOnce({ id: 't1' });
      mockPrisma.tenantModule.upsert
        .mockResolvedValueOnce({ moduleId: 'm1', isEnabled: true })
        .mockResolvedValueOnce({ moduleId: 'm2', isEnabled: true });

      const result = await service.bulkToggleTenantModules('t1', ['m1', 'm2'], true, 'user-1');

      expect(result).toHaveLength(2);
      expect(result[0].success).toBe(true);
      expect(result[1].success).toBe(true);
    });

    it('should handle partial failures gracefully', async () => {
      mockPrisma.module.findUnique
        .mockResolvedValueOnce({ id: 'm1' })
        .mockResolvedValueOnce(null); // m2 not found
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.tenantModule.upsert.mockResolvedValue({ moduleId: 'm1', isEnabled: true });

      const result = await service.bulkToggleTenantModules('t1', ['m1', 'm2'], true, 'user-1');

      expect(result).toHaveLength(2);
      expect(result[0].success).toBe(true);
      expect(result[1].success).toBe(false);
    });
  });

  describe('findModuleByCode', () => {
    it('should return module by code', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({
        id: 'm1',
        name: 'Risk Management',
        code: 'risk-management',
        features: [],
      });

      const result = await service.findModuleByCode('risk-management');

      expect(result.code).toBe('risk-management');
    });

    it('should throw NotFoundException for non-existent code', async () => {
      mockPrisma.module.findUnique.mockResolvedValue(null);

      await expect(service.findModuleByCode('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
