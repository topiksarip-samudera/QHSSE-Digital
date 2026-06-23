import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompaniesService } from '../companies.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  company: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  tenant: {
    findUnique: vi.fn(),
  },
  userCompanyAssignment: {
    findUnique: vi.fn(),
  },
  companySetting: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  },
  site: { count: vi.fn() },
  department: { count: vi.fn() },
  userCompanyAssignment2: { count: vi.fn() },
  project: { count: vi.fn() },
  $transaction: vi.fn(),
};

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new CompaniesService(mockPrisma as any);
  });

  // ─── findAll ────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated companies for super admin (no user filter)', async () => {
      const mockCompanies = [
        { id: '1', name: 'Acme Corp', code: 'ACME', status: 'active' },
        { id: '2', name: 'Beta Inc', code: 'BETA', status: 'active' },
      ];
      mockPrisma.company.findMany.mockResolvedValue(mockCompanies);
      mockPrisma.company.count.mockResolvedValue(2);

      const result = await service.findAll(
        { page: 1, pageSize: 20 } as any,
        'user-1',
        true, // isSuperAdmin
      );

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      // Super admin should NOT have user filter
      const whereArg = mockPrisma.company.findMany.mock.calls[0][0].where;
      expect(whereArg.users).toBeUndefined();
    });

    it('should filter by user assignment for non-super-admin', async () => {
      mockPrisma.company.findMany.mockResolvedValue([]);
      mockPrisma.company.count.mockResolvedValue(0);

      await service.findAll(
        { page: 1, pageSize: 20 } as any,
        'user-1',
        false, // not super admin
      );

      const whereArg = mockPrisma.company.findMany.mock.calls[0][0].where;
      expect(whereArg.users).toEqual({
        some: { userId: 'user-1', status: 'active' },
      });
    });

    it('should apply search filter across multiple fields', async () => {
      mockPrisma.company.findMany.mockResolvedValue([]);
      mockPrisma.company.count.mockResolvedValue(0);

      await service.findAll(
        { page: 1, pageSize: 20, search: 'acme' } as any,
        'user-1',
        true,
      );

      const whereArg = mockPrisma.company.findMany.mock.calls[0][0].where;
      expect(whereArg.OR).toBeDefined();
      expect(whereArg.OR.length).toBe(5); // name, code, legalName, industry, city
    });

    it('should apply status filter', async () => {
      mockPrisma.company.findMany.mockResolvedValue([]);
      mockPrisma.company.count.mockResolvedValue(0);

      await service.findAll(
        { page: 1, pageSize: 20, status: 'active' } as any,
        'user-1',
        true,
      );

      const whereArg = mockPrisma.company.findMany.mock.calls[0][0].where;
      expect(whereArg.status).toBe('active');
    });

    it('should calculate pagination correctly', async () => {
      mockPrisma.company.findMany.mockResolvedValue([]);
      mockPrisma.company.count.mockResolvedValue(45);

      const result = await service.findAll(
        { page: 2, pageSize: 20 } as any,
        'user-1',
        true,
      );

      expect(result.meta.totalPages).toBe(3); // ceil(45/20)
      expect(mockPrisma.company.findMany.mock.calls[0][0].skip).toBe(20); // (2-1)*20
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return company when found', async () => {
      const mockCompany = { id: 'c1', name: 'Acme', status: 'active' };
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue({
        status: 'active',
      });

      const result = await service.findOne('c1', 'user-1', false);
      expect(result).toEqual(mockCompany);
    });

    it('should throw NotFoundException when company does not exist', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('nonexistent', 'user-1', false),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      mockPrisma.company.findUnique.mockResolvedValue({ id: 'c1' });
      mockPrisma.userCompanyAssignment.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('c1', 'user-1', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow super admin without assignment check', async () => {
      const mockCompany = { id: 'c1', name: 'Acme' };
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOne('c1', 'admin-1', true);
      expect(result).toEqual(mockCompany);
      // Should NOT query userCompanyAssignment
      expect(mockPrisma.userCompanyAssignment.findUnique).not.toHaveBeenCalled();
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────
  describe('create', () => {
    const createDto = {
      tenantId: 't1',
      name: 'New Corp',
      code: 'NEW',
      industry: 'Technology',
    };

    it('should create company successfully', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1', status: 'active' });
      mockPrisma.company.findUnique.mockResolvedValue(null); // no duplicate code
      mockPrisma.company.create.mockResolvedValue({
        id: 'c1',
        ...createDto,
        status: 'active',
      });

      const result = await service.create(createDto as any, 'user-1');
      expect(result.id).toBe('c1');
      expect(mockPrisma.company.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when tenant not found', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue(null);

      await expect(
        service.create(createDto as any, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when tenant is not active', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1', status: 'inactive' });

      await expect(
        service.create(createDto as any, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when code already exists', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({ id: 't1', status: 'active' });
      mockPrisma.company.findUnique.mockResolvedValue({ id: 'existing', code: 'NEW' });

      await expect(
        service.create(createDto as any, 'user-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update company successfully', async () => {
      mockPrisma.company.findUnique
        .mockResolvedValueOnce({ id: 'c1', code: 'OLD' }) // existing company
        .mockResolvedValueOnce(null); // no duplicate code
      mockPrisma.company.update.mockResolvedValue({ id: 'c1', name: 'Updated' });

      const result = await service.update('c1', { name: 'Updated' } as any, 'user-1', true);
      expect(result.name).toBe('Updated');
    });

    it('should throw ConflictException when new code already exists', async () => {
      // update() calls findOne() first which calls findUnique with {id}, then checks code uniqueness with {code}
      mockPrisma.company.findUnique.mockImplementation(async (args: any) => {
        if (args.where?.id) return { id: 'c1', code: 'OLD', status: 'active' };
        if (args.where?.code) return { id: 'c2', code: 'NEW' };
        return null;
      });

      await expect(
        service.update('c1', { code: 'NEW' } as any, 'user-1', true),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── updateStatus ───────────────────────────────────────────────────────
  describe('updateStatus', () => {
    it('should allow valid status transition: active → inactive', async () => {
      mockPrisma.company.findUnique.mockResolvedValue({ id: 'c1', status: 'active', deletedAt: null } as any);
      mockPrisma.company.update.mockResolvedValue({ id: 'c1', status: 'inactive' });

      const result = await service.updateStatus('c1', 'inactive' as any, 'user-1', true);
      expect(result.status).toBe('inactive');
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(
        service.updateStatus('c1', 'inactive', 'user-1', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when company not found', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('nonexistent', 'inactive' as any, 'user-1', true),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove (soft delete) ───────────────────────────────────────────────
  describe('remove', () => {
    it('should soft delete company (set status=archived, deletedAt)', async () => {
      mockPrisma.company.findUnique.mockResolvedValue({ id: 'c1', status: 'active' });
      mockPrisma.company.update.mockResolvedValue({
        id: 'c1',
        status: 'archived',
        deletedAt: new Date(),
      });

      const result = await service.remove('c1', 'user-1', true);
      expect(result.status).toBe('archived');
      const updateArg = mockPrisma.company.update.mock.calls[0][0];
      expect(updateArg.data.status).toBe('archived');
      expect(updateArg.data.deletedAt).toBeDefined();
    });

    it('should throw ForbiddenException for non-super-admin', async () => {
      await expect(
        service.remove('c1', 'user-1', false),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
