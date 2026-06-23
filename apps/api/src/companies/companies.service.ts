import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { Prisma, Status, CompanySize } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List Companies ─────────────────────────────────────────────────────
  async findAll(query: QueryCompanyDto, currentUserId: string, isSuperAdmin: boolean) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, status, industry, size, tenantId } = query;

    const where: Prisma.CompanyWhereInput = { deletedAt: null };

    // Tenant isolation — non-super-admin only sees their companies
    if (!isSuperAdmin) {
      where.users = { some: { userId: currentUserId, status: 'active' } };
    }

    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status as Status;
    if (industry) where.industry = { contains: industry, mode: 'insensitive' };
    if (size) where.size = size as any;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { legalName: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          tenant: { select: { id: true, name: true, slug: true } },
          _count: {
            select: {
              sites: true,
              departments: true,
              users: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ─── Get Single Company ─────────────────────────────────────────────────
  async findOne(id: string, currentUserId: string, isSuperAdmin: boolean) {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
      include: {
        tenant: { select: { id: true, name: true, slug: true, status: true } },
        settings: true,
        _count: {
          select: {
            sites: true,
            departments: true,
            businessUnits: true,
            users: true,
            projects: true,
          },
        },
      },
    });

    if (!company) throw new NotFoundException('Company not found');

    // Tenant isolation check
    if (!isSuperAdmin) {
      const assignment = await this.prisma.userCompanyAssignment.findUnique({
        where: { userId_companyId: { userId: currentUserId, companyId: id } },
      });
      if (!assignment || assignment.status !== 'active') {
        throw new ForbiddenException('You do not have access to this company');
      }
    }

    return company;
  }

  // ─── Create Company ─────────────────────────────────────────────────────
  async create(dto: CreateCompanyDto, currentUserId: string) {
    // Validate tenant exists
    const tenant = await this.prisma.tenant.findUnique({ where: { id: dto.tenantId } });
    if (!tenant) throw new BadRequestException('Tenant not found');
    if (tenant.status !== 'active') throw new BadRequestException('Tenant is not active');

    // Check unique code
    const existingCode = await this.prisma.company.findUnique({ where: { code: dto.code } });
    if (existingCode) throw new ConflictException(`Company code "${dto.code}" already exists`);

    const company = await this.prisma.company.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code,
        legalName: dto.legalName,
        industry: dto.industry,
        size: dto.size ? (dto.size as CompanySize) : undefined,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        timezone: dto.timezone,
        language: dto.language,
        dateFormat: dto.dateFormat,
        currency: dto.currency,
        status: 'active',
        createdBy: currentUserId,
      },
      include: {
        tenant: { select: { id: true, name: true, slug: true } },
      },
    });

    return company;
  }

  // ─── Update Company ─────────────────────────────────────────────────────
  async update(id: string, dto: UpdateCompanyDto, currentUserId: string, isSuperAdmin: boolean) {
    const company = await this.findOne(id, currentUserId, isSuperAdmin);

    // If updating code, check uniqueness
    if (dto.code && dto.code !== company.code) {
      const existingCode = await this.prisma.company.findUnique({ where: { code: dto.code } });
      if (existingCode) throw new ConflictException(`Company code "${dto.code}" already exists`);
    }

    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        legalName: dto.legalName,
        industry: dto.industry,
        size: dto.size ? (dto.size as CompanySize) : undefined,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        timezone: dto.timezone,
        language: dto.language,
        dateFormat: dto.dateFormat,
        currency: dto.currency,
        updatedBy: currentUserId,
      },
      include: {
        tenant: { select: { id: true, name: true, slug: true } },
      },
    });

    return updated;
  }

  // ─── Suspend / Activate Company ─────────────────────────────────────────
  async updateStatus(id: string, status: Status, currentUserId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) {
      throw new ForbiddenException('Only super admin can change company status');
    }

    const company = await this.prisma.company.findUnique({ where: { id, deletedAt: null } });
    if (!company) throw new NotFoundException('Company not found');

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      active: ['inactive', 'suspended'],
      inactive: ['active', 'suspended'],
      suspended: ['active', 'inactive'],
    };

    if (!validTransitions[company.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from "${company.status}" to "${status}"`);
    }

    return this.prisma.company.update({
      where: { id },
      data: { status, updatedBy: currentUserId },
    });
  }

  // ─── Soft Delete Company ────────────────────────────────────────────────
  async remove(id: string, currentUserId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) {
      throw new ForbiddenException('Only super admin can delete companies');
    }

    const company = await this.prisma.company.findUnique({ where: { id, deletedAt: null } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: currentUserId,
        status: 'archived' as Status,
      },
    });
  }

  // ─── Company Settings ───────────────────────────────────────────────────
  async getSettings(companyId: string, currentUserId: string, isSuperAdmin: boolean) {
    // Verify access
    await this.findOne(companyId, currentUserId, isSuperAdmin);

    return this.prisma.companySetting.findMany({
      where: { companyId },
      orderBy: { key: 'asc' },
    });
  }

  async updateSetting(
    companyId: string,
    key: string,
    value: any,
    description: string | undefined,
    currentUserId: string,
    isSuperAdmin: boolean,
  ) {
    // Verify access
    await this.findOne(companyId, currentUserId, isSuperAdmin);

    return this.prisma.companySetting.upsert({
      where: { companyId_key: { companyId, key } },
      update: { value, description, updatedAt: new Date() },
      create: { companyId, key, value, description },
    });
  }

  async bulkUpdateSettings(
    companyId: string,
    settings: Array<{ key: string; value: any; description?: string }>,
    currentUserId: string,
    isSuperAdmin: boolean,
  ) {
    await this.findOne(companyId, currentUserId, isSuperAdmin);

    const results = [];
    for (const setting of settings) {
      const result = await this.prisma.companySetting.upsert({
        where: { companyId_key: { companyId, key: setting.key } },
        update: { value: setting.value, description: setting.description, updatedAt: new Date() },
        create: { companyId, key: setting.key, value: setting.value, description: setting.description },
      });
      results.push(result);
    }

    return results;
  }

  // ─── Stats ──────────────────────────────────────────────────────────────
  async getStats(companyId: string, currentUserId: string, isSuperAdmin: boolean) {
    await this.findOne(companyId, currentUserId, isSuperAdmin);

    const [sites, departments, users, projects, activeActions] = await Promise.all([
      this.prisma.site.count({ where: { companyId, deletedAt: null } }),
      this.prisma.department.count({ where: { companyId, deletedAt: null } }),
      this.prisma.userCompanyAssignment.count({ where: { companyId, status: 'active' } }),
      this.prisma.project.count({ where: { companyId, deletedAt: null } }),
      this.prisma.action.count({ where: { companyId, deletedAt: null, status: { notIn: ['closed', 'cancelled', 'archived'] } } }),
    ]);

    return { sites, departments, users, projects, activeActions };
  }
}
