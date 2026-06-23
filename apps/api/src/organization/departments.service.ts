import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOrgDto, userId: string, isSuperAdmin: boolean) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, status, companyId, siteId } = query;

    const where: Prisma.DepartmentWhereInput = { deletedAt: null };

    if (!isSuperAdmin) {
      where.company = {
        users: { some: { userId, status: 'active' } },
      };
    }

    if (companyId) where.companyId = companyId;
    if (siteId) where.siteId = siteId;
    if (status) where.status = status as Status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          site: { select: { id: true, name: true, code: true } },
          parent: { select: { id: true, name: true, code: true } },
          _count: { select: { children: true, sections: true, userAssignments: true } },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string, userId: string, isSuperAdmin: boolean) {
    const dept = await this.prisma.department.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: { select: { id: true, name: true, code: true } },
        site: { select: { id: true, name: true, code: true } },
        parent: { select: { id: true, name: true, code: true } },
        children: { where: { deletedAt: null }, select: { id: true, name: true, code: true, status: true } },
        sections: { where: { deletedAt: null }, select: { id: true, name: true, code: true, status: true } },
        _count: { select: { children: true, sections: true, userAssignments: true } },
      },
    });

    if (!dept) throw new NotFoundException('Department not found');

    if (!isSuperAdmin) {
      const assignment = await this.prisma.userCompanyAssignment.findUnique({
        where: { userId_companyId: { userId, companyId: dept.companyId } },
      });
      if (!assignment || assignment.status !== 'active') {
        throw new ForbiddenException('You do not have access to this company');
      }
    }

    return dept;
  }

  async create(dto: CreateDepartmentDto, userId: string) {
    // Validate unique code within company+site scope
    if (dto.code) {
      const existing = await this.prisma.department.findFirst({
        where: {
          companyId: dto.companyId,
          siteId: dto.siteId || null,
          code: dto.code,
          deletedAt: null,
        },
      });
      if (existing) throw new ConflictException(`Department code "${dto.code}" already exists in this scope`);
    }

    // Validate parent belongs to same company
    if (dto.parentId) {
      const parent = await this.prisma.department.findUnique({ where: { id: dto.parentId } });
      if (!parent || parent.companyId !== dto.companyId) {
        throw new BadRequestException('Parent department not found in this company');
      }
    }

    // Validate site belongs to same company
    if (dto.siteId) {
      const site = await this.prisma.site.findUnique({ where: { id: dto.siteId } });
      if (!site || site.companyId !== dto.companyId) {
        throw new NotFoundException('Site not found in this company');
      }
    }

    return this.prisma.department.create({
      data: {
        companyId: dto.companyId,
        siteId: dto.siteId,
        name: dto.name,
        code: dto.code,
        headId: dto.headId,
        parentId: dto.parentId,
        createdBy: userId,
      },
      include: {
        site: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, dto: UpdateDepartmentDto, userId: string, isSuperAdmin: boolean) {
    const dept = await this.findOne(id, userId, isSuperAdmin);

    if (dto.code && dto.code !== dept.code) {
      const existing = await this.prisma.department.findFirst({
        where: {
          companyId: dept.companyId,
          siteId: dto.siteId ?? dept.siteId ?? null,
          code: dto.code,
          deletedAt: null,
          NOT: { id },
        },
      });
      if (existing) throw new ConflictException(`Department code "${dto.code}" already exists in this scope`);
    }

    // Prevent circular parent reference
    if (dto.parentId === id) {
      throw new BadRequestException('Department cannot be its own parent');
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        siteId: dto.siteId,
        headId: dto.headId,
        parentId: dto.parentId,
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) throw new ForbiddenException('Only super admin can delete departments');

    const dept = await this.prisma.department.findUnique({ where: { id, deletedAt: null } });
    if (!dept) throw new NotFoundException('Department not found');

    return this.prisma.department.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId, status: 'archived' as Status },
    });
  }
}
