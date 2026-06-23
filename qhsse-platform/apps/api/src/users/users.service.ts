import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AssignScopeDto } from './dto/assign-scope.dto';
import { Prisma, Status } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUsersDto, userId: string, isSuperAdmin: boolean) {
    const {
      page = 1, pageSize = 20, sort = 'createdAt', order = 'desc',
      search, status, companyId, siteId, departmentId,
    } = query;

    const where: Prisma.UserWhereInput = { deletedAt: null };

    // Tenant isolation: non-super-admin only sees users in their companies
    if (!isSuperAdmin) {
      const userCompanies = await this.prisma.userCompanyAssignment.findMany({
        where: { userId, status: 'active' },
        select: { companyId: true },
      });
      const companyIds = userCompanies.map((uc) => uc.companyId);
      if (companyIds.length === 0) return { items: [], meta: { page, pageSize, total: 0, totalPages: 0 } };

      if (companyId) {
        if (!companyIds.includes(companyId)) {
          return { items: [], meta: { page, pageSize, total: 0, totalPages: 0 } };
        }
        where.companyAssignments = { some: { companyId, status: 'active' } };
      } else {
        where.companyAssignments = { some: { companyId: { in: companyIds }, status: 'active' } };
      }
    } else if (companyId) {
      where.companyAssignments = { some: { companyId, status: 'active' } };
    }

    if (siteId) {
      where.siteAssignments = { some: { siteId, status: 'active' } };
    }
    if (departmentId) {
      where.departmentAssignments = { some: { departmentId, status: 'active' } };
    }
    if (status) where.status = status as Status;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        select: {
          id: true, email: true, firstName: true, lastName: true, phone: true,
          avatarUrl: true, isSuperAdmin: true, status: true, lastLoginAt: true,
          createdAt: true, updatedAt: true,
          profile: { select: { employeeId: true, position: true } },
          companyAssignments: {
            where: { status: 'active' },
            select: { companyId: true, isPrimary: true, company: { select: { id: true, name: true, code: true } } },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string, companyId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        avatarUrl: true, isSuperAdmin: true, status: true, lastLoginAt: true,
        emailVerifiedAt: true, createdAt: true, updatedAt: true,
        profile: true,
        companyAssignments: {
          select: { id: true, companyId: true, isPrimary: true, status: true, company: { select: { id: true, name: true, code: true } } },
        },
        siteAssignments: {
          select: { id: true, siteId: true, role: true, status: true, site: { select: { id: true, name: true, code: true } } },
        },
        departmentAssignments: {
          select: { id: true, departmentId: true, isHead: true, status: true, department: { select: { id: true, name: true, code: true } } },
        },
        positionAssignments: {
          select: { id: true, positionId: true, startDate: true, endDate: true, status: true, position: { select: { id: true, name: true, code: true } } },
        },
        roles: {
          select: { id: true, roleId: true, companyId: true, siteId: true, role: { select: { id: true, name: true } } },
        },
        scopes: {
          select: { id: true, companyId: true, siteId: true, departmentId: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    // Tenant isolation: verify user belongs to the requesting company
    if (companyId && !user.isSuperAdmin) {
      const hasMembership = user.companyAssignments.some(
        (a) => a.companyId === companyId,
      );
      if (!hasMembership) throw new ForbiddenException('Access denied');
    }

    return user;
  }

  async create(dto: CreateUserDto, creatorId: string) {
    // Check unique email
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException(`User with email "${dto.email}" already exists`);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        status: dto.isActive === false ? 'inactive' : 'active',
        profile: {
          create: {
            employeeId: dto.employeeId,
            position: dto.position,
          },
        },
      },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        status: true, createdAt: true, profile: true,
      },
    });

    // Auto-assign to company if provided
    if (dto.companyId) {
      await this.prisma.userCompanyAssignment.create({
        data: {
          userId: user.id,
          companyId: dto.companyId,
          isPrimary: true,
          status: 'active',
        },
      });
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, updaterId: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    // Check email uniqueness if changing
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException(`Email "${dto.email}" is already taken`);
    }

    const { employeeId, position, bio, address, city, country, timezone, language, status, ...userData } = dto;

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(status && { status: status as Status }),
        profile: {
          upsert: {
            create: { employeeId, position, bio, address, city, country, timezone, language },
            update: {
              ...(employeeId !== undefined && { employeeId }),
              ...(position !== undefined && { position }),
              ...(bio !== undefined && { bio }),
              ...(address !== undefined && { address }),
              ...(city !== undefined && { city }),
              ...(country !== undefined && { country }),
              ...(timezone !== undefined && { timezone }),
              ...(language !== undefined && { language }),
            },
          },
        },
      },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        avatarUrl: true, status: true, updatedAt: true, profile: true,
      },
    });

    return updated;
  }

  async remove(id: string, deleterId: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isSuperAdmin) throw new ForbiddenException('Cannot delete super admin');

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'archived' as Status },
    });
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (user.status === 'active') throw new BadRequestException('User is already active');

    return this.prisma.user.update({
      where: { id },
      data: { status: 'active' as Status },
      select: { id: true, email: true, status: true },
    });
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isSuperAdmin) throw new ForbiddenException('Cannot deactivate super admin');
    if (user.status === 'inactive') throw new BadRequestException('User is already inactive');

    return this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' as Status },
      select: { id: true, email: true, status: true },
    });
  }

  async assignRole(userId: string, dto: AssignRoleDto, assignerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found');

    // Check for existing assignment
    const existing = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId,
        roleId: dto.roleId,
        companyId: dto.companyId || null,
        siteId: dto.siteId || null,
      },
    });
    if (existing) throw new ConflictException('Role already assigned to this user in this scope');

    return this.prisma.userRoleAssignment.create({
      data: {
        userId,
        roleId: dto.roleId,
        ...(dto.companyId && { companyId: dto.companyId }),
        ...(dto.siteId && { siteId: dto.siteId }),
        assignedBy: assignerId,
      },
      select: {
        id: true, userId: true, roleId: true, companyId: true, siteId: true,
        role: { select: { id: true, name: true } },
      },
    });
  }

  async removeRole(userId: string, roleId: string, companyId?: string, siteId?: string) {
    const assignment = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId, roleId,
        companyId: companyId || null,
        siteId: siteId || null,
      },
    });
    if (!assignment) throw new NotFoundException('Role assignment not found');

    return this.prisma.userRoleAssignment.delete({ where: { id: assignment.id } });
  }

  async assignScope(userId: string, dto: AssignScopeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    // Check for existing scope
    const existing = await this.prisma.userScope.findFirst({
      where: {
        userId,
        companyId: dto.companyId,
        siteId: dto.siteId || null,
        departmentId: dto.departmentId || null,
      },
    });
    if (existing) throw new ConflictException('Scope already assigned');

    return this.prisma.userScope.create({
      data: {
        userId,
        companyId: dto.companyId,
        siteId: dto.siteId,
        departmentId: dto.departmentId,
      },
    });
  }

  async removeScope(scopeId: string) {
    const scope = await this.prisma.userScope.findUnique({ where: { id: scopeId } });
    if (!scope) throw new NotFoundException('Scope not found');
    return this.prisma.userScope.delete({ where: { id: scopeId } });
  }

  async getLoginHistory(userId: string, page = 1, pageSize = 20) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const [items, total] = await Promise.all([
      this.prisma.loginHistory.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.loginHistory.count({ where: { userId } }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async resetPassword(userId: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password reset successfully. All sessions invalidated.' };
  }
}
