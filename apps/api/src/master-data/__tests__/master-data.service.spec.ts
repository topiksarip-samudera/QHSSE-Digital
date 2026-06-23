import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MasterDataService } from '../master-data.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  masterDataGroup: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  masterDataItem: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  },
  userCompanyAssignment: {
    findMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

describe('MasterDataService', () => {
  let service: MasterDataService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new MasterDataService(mockPrisma as any);
    // Default transaction mock: execute callback with tx
    mockPrisma.$transaction.mockImplementation(async (args: any) => {
      if (Array.isArray(args)) {
        return Promise.all(args);
      }
      if (typeof args === 'function') {
        return args(mockPrisma);
      }
      return args;
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // GROUPS
  // ═══════════════════════════════════════════════════════════════════════

  describe('findAllGroups', () => {
    it('should return paginated groups for super admin', async () => {
      const mockGroups = [
        { id: 'g1', name: 'Risk Level', code: 'risk_level' },
        { id: 'g2', name: 'Incident Type', code: 'incident_type' },
      ];
      mockPrisma.masterDataGroup.findMany.mockResolvedValue(mockGroups);
      mockPrisma.masterDataGroup.count.mockResolvedValue(2);

      const result = await service.findAllGroups({ page: 1, pageSize: 20 } as any, 'admin-1', true);

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter by company for non-super-admin', async () => {
      mockPrisma.userCompanyAssignment.findMany.mockResolvedValue([{ companyId: 'c1' }]);
      mockPrisma.masterDataGroup.findMany.mockResolvedValue([]);
      mockPrisma.masterDataGroup.count.mockResolvedValue(0);

      const result = await service.findAllGroups({ page: 1 } as any, 'user-1', false);

      expect(mockPrisma.userCompanyAssignment.findMany).toHaveBeenCalled();
      expect(result.items).toHaveLength(0);
    });

    it('should apply search filter', async () => {
      mockPrisma.masterDataGroup.findMany.mockResolvedValue([]);
      mockPrisma.masterDataGroup.count.mockResolvedValue(0);

      await service.findAllGroups({ page: 1, search: 'risk' } as any, 'admin-1', true);

      const whereArg = mockPrisma.masterDataGroup.findMany.mock.calls[0][0].where;
      expect(whereArg.AND).toBeDefined();
    });

    it('should apply status filter', async () => {
      mockPrisma.masterDataGroup.findMany.mockResolvedValue([]);
      mockPrisma.masterDataGroup.count.mockResolvedValue(0);

      await service.findAllGroups({ page: 1, status: 'active' } as any, 'admin-1', true);

      const whereArg = mockPrisma.masterDataGroup.findMany.mock.calls[0][0].where;
      expect(whereArg.status).toBe('active');
    });
  });

  describe('findOneGroup', () => {
    it('should return group with items', async () => {
      const mockGroup = {
        id: 'g1',
        name: 'Risk Level',
        code: 'risk_level',
        items: [],
        _count: { items: 0 },
      };
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue(mockGroup);

      const result = await service.findOneGroup('g1');

      expect(result.name).toBe('Risk Level');
      expect(mockPrisma.masterDataGroup.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOneGroup('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createGroup', () => {
    it('should create a new group', async () => {
      mockPrisma.masterDataGroup.findFirst.mockResolvedValue(null);
      mockPrisma.masterDataGroup.create.mockResolvedValue({
        id: 'g1',
        name: 'Risk Level',
        code: 'risk_level',
        _count: { items: 0 },
      });

      const result = await service.createGroup(
        { name: 'Risk Level', code: 'risk_level' } as any,
        'creator-1',
      );

      expect(result.name).toBe('Risk Level');
      expect(mockPrisma.masterDataGroup.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if code already exists', async () => {
      mockPrisma.masterDataGroup.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.createGroup({ name: 'Risk Level', code: 'risk_level' } as any, 'creator-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateGroup', () => {
    it('should update group name', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({ id: 'g1', name: 'Old Name' });
      mockPrisma.masterDataGroup.update.mockResolvedValue({
        id: 'g1',
        name: 'New Name',
        _count: { items: 0 },
      });

      const result = await service.updateGroup('g1', { name: 'New Name' } as any, 'updater-1');

      expect(result.name).toBe('New Name');
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue(null);

      await expect(
        service.updateGroup('nonexistent', { name: 'New' } as any, 'updater-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeGroup', () => {
    it('should delete group with no active items', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({
        id: 'g1',
        name: 'Risk Level',
        isSystem: false,
      });
      mockPrisma.masterDataItem.count.mockResolvedValue(0);
      mockPrisma.$transaction.mockResolvedValue([]);

      const result = await service.removeGroup('g1', 'deleter-1');

      expect(result.message).toContain('deleted');
    });

    it('should throw ForbiddenException for system groups', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({
        id: 'g1',
        name: 'Risk Level',
        isSystem: true,
      });

      await expect(service.removeGroup('g1', 'deleter-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if group has active items', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({
        id: 'g1',
        name: 'Risk Level',
        isSystem: false,
      });
      mockPrisma.masterDataItem.count.mockResolvedValue(3);

      await expect(service.removeGroup('g1', 'deleter-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ITEMS
  // ═══════════════════════════════════════════════════════════════════════

  describe('findAllItems', () => {
    it('should return paginated items', async () => {
      mockPrisma.masterDataItem.findMany.mockResolvedValue([
        { id: 'i1', name: 'Extreme', code: 'EXTREME' },
      ]);
      mockPrisma.masterDataItem.count.mockResolvedValue(1);

      const result = await service.findAllItems({ page: 1, groupId: 'g1' } as any, 'admin-1', true);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should exclude deleted items (deletedAt filter)', async () => {
      mockPrisma.masterDataItem.findMany.mockResolvedValue([]);
      mockPrisma.masterDataItem.count.mockResolvedValue(0);

      await service.findAllItems({ page: 1 } as any, 'admin-1', true);

      const whereArg = mockPrisma.masterDataItem.findMany.mock.calls[0][0].where;
      expect(whereArg.deletedAt).toBeNull();
    });
  });

  describe('findOneItem', () => {
    it('should return item with relations', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        name: 'Extreme',
        group: { id: 'g1', name: 'Risk Level', code: 'risk_level' },
        parent: null,
        children: [],
      } as any);

      const result = await service.findOneItem('i1');

      expect(result.name).toBe('Extreme');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue(null);

      await expect(service.findOneItem('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createItem', () => {
    it('should create a new item', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({ id: 'g1', name: 'Risk Level' });
      mockPrisma.masterDataItem.findFirst.mockResolvedValue(null);
      mockPrisma.masterDataItem.create.mockResolvedValue({
        id: 'i1',
        name: 'Extreme',
        code: 'EXTREME',
        group: { id: 'g1', name: 'Risk Level', code: 'risk_level' },
        parent: null,
      } as any);

      const result = await service.createItem(
        { groupId: 'g1', name: 'Extreme', code: 'EXTREME' } as any,
        'creator-1',
      );

      expect(result.name).toBe('Extreme');
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue(null);

      await expect(
        service.createItem({ groupId: 'nonexistent', name: 'Test' } as any, 'creator-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if code already exists in group', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({ id: 'g1' });
      mockPrisma.masterDataItem.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.createItem({ groupId: 'g1', name: 'Test', code: 'EXTREME' } as any, 'creator-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should validate parent item belongs to same group', async () => {
      mockPrisma.masterDataGroup.findUnique.mockResolvedValue({ id: 'g1' });
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'p1',
        groupId: 'g2',
        deletedAt: null,
      });

      await expect(
        service.createItem(
          { groupId: 'g1', name: 'Test', parentId: 'p1' } as any,
          'creator-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateItem', () => {
    it('should update item name', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        name: 'Old Name',
        parentId: null,
        groupId: 'g1',
        deletedAt: null,
      });
      mockPrisma.masterDataItem.update.mockResolvedValue({
        id: 'i1',
        name: 'New Name',
        group: { id: 'g1', name: 'Risk Level', code: 'risk_level' },
        parent: null,
      } as any);

      const result = await service.updateItem('i1', { name: 'New Name' } as any, 'updater-1');

      expect(result.name).toBe('New Name');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue(null);

      await expect(
        service.updateItem('nonexistent', { name: 'New' } as any, 'updater-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should prevent self-reference in parent', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        name: 'Test',
        parentId: null,
        groupId: 'g1',
        deletedAt: null,
      });

      await expect(
        service.updateItem('i1', { parentId: 'i1' } as any, 'updater-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeItem', () => {
    it('should soft delete item and its children', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        name: 'Extreme',
        deletedAt: null,
        _count: { children: 0 },
      });
      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));

      const result = await service.removeItem('i1', 'deleter-1');

      expect(result.message).toContain('archived');
      expect(mockPrisma.masterDataItem.updateMany).toHaveBeenCalled();
      expect(mockPrisma.masterDataItem.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue(null);

      await expect(service.removeItem('nonexistent', 'deleter-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restoreItem', () => {
    it('should restore archived item', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        name: 'Extreme',
        deletedAt: new Date(),
      });
      mockPrisma.masterDataItem.update.mockResolvedValue({
        id: 'i1',
        name: 'Extreme',
        status: 'active',
      });

      const result = await service.restoreItem('i1');

      expect(result.status).toBe('active');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue(null);

      await expect(service.restoreItem('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if item is not archived', async () => {
      mockPrisma.masterDataItem.findUnique.mockResolvedValue({
        id: 'i1',
        deletedAt: null,
      });

      await expect(service.restoreItem('i1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('exportItems', () => {
    it('should return items for export', async () => {
      mockPrisma.masterDataItem.findMany.mockResolvedValue([
        { id: 'i1', name: 'Extreme', group: { name: 'Risk Level', code: 'risk_level' } },
      ]);

      const result = await service.exportItems('g1');

      expect(result).toHaveLength(1);
    });

    it('should export all items when no groupId specified', async () => {
      mockPrisma.masterDataItem.findMany.mockResolvedValue([]);

      await service.exportItems(undefined as any);

      const whereArg = mockPrisma.masterDataItem.findMany.mock.calls[0][0].where;
      expect(whereArg.groupId).toBeUndefined();
    });
  });
});
