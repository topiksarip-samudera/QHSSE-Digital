import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRolesDto } from './dto/query-roles.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List Roles ────────────────────────────────────────────────────────
  async findAll(query: QueryRolesDto, userId: string, isSuperAdmin: boolean) {
    const {
      page = 1, pageSize = 20, sort = 'createdAt', order = 'desc',
      search, status, companyId, includeSystem,
    } = query;

    const where: Prisma.RoleWhereInput = { deletedAt: null };

    // Tenant isolation: non-super-admin only sees roles in their companies + system roles
    if (!isSuperAdmin) {
      const userCompanies = await this.prisma.userCompanyAssignment.findMany({
        where: { userId, status: 'active' },
        select: { companyId: true },
      });
      const companyIds = userCompanies.map((uc) => uc.companyId);

      if (companyId) {
        if (!companyIds.includes(companyId)) {
          return { items: [], meta: { page, pageSize, total: 0, totalPages: 0 } };
        }
        where.OR = [
          { companyId: companyId },
          { companyId: null, isSystem: true },
        ];
      } else {
        where.OR = [
          { companyId: { in: companyIds } },
          { companyId: null, isSystem: true },
        ];
      }
    } else {
      if (companyId === 'null') {
        where.companyId = null;
      } else if (companyId) {
        where.companyId = companyId;
      }
    }

    // Filter system roles
    if (includeSystem === false) {
      where.isSystem = false;
    }

    if (status) where.status = status as Status;
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        select: {
          id: true, name: true, code: true, description: true,
          isSystem: true, companyId: true, status: true,
          createdAt: true, updatedAt: true,
          _count: {
            select: {
              permissions: true,
              userRoles: true,
            },
          },
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  // ─── Get Single Role ───────────────────────────────────────────────────
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id, deletedAt: null },
      include: {
        permissions: {
          include: { permission: true },
        },
        userRoles: {
          select: {
            id: true, userId: true, companyId: true, siteId: true,
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
          },
        },
        _count: {
          select: { permissions: true, userRoles: true },
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  // ─── Create Role ───────────────────────────────────────────────────────
  async create(dto: CreateRoleDto, creatorId: string) {
    // Check unique code within company scope
    const existing = await this.prisma.role.findFirst({
      where: {
        code: dto.code,
        companyId: dto.companyId || null,
        deletedAt: null,
      },
    });
    if (existing) throw new ConflictException(`Role code "${dto.code}" already exists in this scope`);

    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        companyId: dto.companyId || null,
        isSystem: false,
        createdBy: creatorId,
      },
      select: {
        id: true, name: true, code: true, description: true,
        isSystem: true, companyId: true, status: true, createdAt: true,
      },
    });

    return role;
  }

  // ─── Update Role ───────────────────────────────────────────────────────
  async update(id: string, dto: UpdateRoleDto, updaterId: string) {
    const role = await this.prisma.role.findUnique({ where: { id, deletedAt: null } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new ForbiddenException('Cannot modify system roles');

    const updated = await this.prisma.role.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status as Status }),
      },
      select: {
        id: true, name: true, code: true, description: true,
        isSystem: true, companyId: true, status: true, updatedAt: true,
      },
    });

    return updated;
  }

  // ─── Delete Role (Soft) ────────────────────────────────────────────────
  async remove(id: string, deleterId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id, deletedAt: null },
      include: { _count: { select: { userRoles: true } } },
    });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new ForbiddenException('Cannot delete system roles');
    if (role._count.userRoles > 0) {
      throw new BadRequestException(
        `Cannot delete role "${role.name}" — it is assigned to ${role._count.userRoles} user(s). Remove all assignments first.`,
      );
    }

    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'archived' as Status },
    });
  }

  // ─── Get Permission Matrix ─────────────────────────────────────────────
  async getPermissionMatrix() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });

    // Group by module
    const matrix: Record<string, { id: string; action: string; description: string | null }[]> = {};
    for (const perm of permissions) {
      if (!matrix[perm.module]) matrix[perm.module] = [];
      matrix[perm.module].push({
        id: perm.id,
        action: perm.action,
        description: perm.description,
      });
    }

    return matrix;
  }

  // ─── Get All Permissions Flat ──────────────────────────────────────────
  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  // ─── Set Role Permissions (Replace All) ────────────────────────────────
  async setRolePermissions(roleId: string, dto: AssignPermissionsDto) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId, deletedAt: null } });
    if (!role) throw new NotFoundException('Role not found');

    // Validate all permission IDs exist
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
    });
    if (permissions.length !== dto.permissionIds.length) {
      const found = new Set(permissions.map((p) => p.id));
      const missing = dto.permissionIds.filter((id) => !found.has(id));
      throw new BadRequestException(`Permission IDs not found: ${missing.join(', ')}`);
    }

    // Replace all permissions: delete existing, insert new
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({ roleId, permissionId })),
      }),
    ]);

    // Return updated role with permissions
    return this.findOne(roleId);
  }

  // ─── Add Permissions to Role (Append) ──────────────────────────────────
  async addRolePermissions(roleId: string, dto: AssignPermissionsDto) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId, deletedAt: null } });
    if (!role) throw new NotFoundException('Role not found');

    // Validate permissions exist
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
    });
    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('One or more permission IDs are invalid');
    }

    // Add only new ones (skip duplicates)
    const existing = await this.prisma.rolePermission.findMany({
      where: { roleId, permissionId: { in: dto.permissionIds } },
      select: { permissionId: true },
    });
    const existingIds = new Set(existing.map((rp) => rp.permissionId));
    const newIds = dto.permissionIds.filter((id) => !existingIds.has(id));

    if (newIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: newIds.map((permissionId) => ({ roleId, permissionId })),
      });
    }

    return this.findOne(roleId);
  }

  // ─── Remove Permission from Role ───────────────────────────────────────
  async removeRolePermission(roleId: string, permissionId: string) {
    const assignment = await this.prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (!assignment) throw new NotFoundException('Permission assignment not found');

    await this.prisma.rolePermission.delete({ where: { id: assignment.id } });
    return { message: 'Permission removed from role' };
  }

  // ─── Get Role's Permissions ────────────────────────────────────────────
  async getRolePermissions(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId, deletedAt: null },
      select: { id: true, name: true, code: true },
    });
    if (!role) throw new NotFoundException('Role not found');

    const rolePerms = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
      orderBy: { permission: { module: 'asc' } },
    });

    return {
      role,
      permissions: rolePerms.map((rp) => rp.permission),
    };
  }
}
