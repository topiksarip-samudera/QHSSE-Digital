import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryGroupsDto } from './dto/query-groups.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class MasterDataService {
  constructor(private readonly prisma: PrismaService) {}

  // ═════════════════════════════════════════════════════════════════════════
  // GROUPS
  // ═════════════════════════════════════════════════════════════════════════

  async findAllGroups(query: QueryGroupsDto, userId: string, isSuperAdmin: boolean) {
    const {
      page = 1, pageSize = 20, sort = 'name', order = 'asc',
      search, status, companyId,
    } = query;

    const where: Prisma.MasterDataGroupWhereInput = {};

    // Tenant isolation
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
          { companyId: null }, // global groups visible to all
        ];
      } else {
        where.OR = [
          { companyId: { in: companyIds } },
          { companyId: null },
        ];
      }
    } else if (companyId) {
      where.companyId = companyId;
    }

    if (status) where.status = status as Status;
    if (search) {
      const existingAnd = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
      where.AND = [
        ...existingAnd,
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.masterDataGroup.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          _count: { select: { items: true } },
        },
      }),
      this.prisma.masterDataGroup.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOneGroup(id: string) {
    const group = await this.prisma.masterDataGroup.findUnique({
      where: { id },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            parent: { select: { id: true, name: true, code: true } },
          },
        },
        _count: { select: { items: true } },
      },
    });

    if (!group) throw new NotFoundException('Master data group not found');
    return group;
  }

  async createGroup(dto: CreateGroupDto, creatorId: string) {
    // Check unique code within company scope
    const existing = await this.prisma.masterDataGroup.findFirst({
      where: {
        code: dto.code,
        companyId: dto.companyId || null,
      },
    });
    if (existing) throw new ConflictException(`Group code "${dto.code}" already exists in this scope`);

    return this.prisma.masterDataGroup.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        companyId: dto.companyId || null,
      },
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  async updateGroup(id: string, dto: UpdateGroupDto, updaterId: string) {
    const group = await this.prisma.masterDataGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('Master data group not found');

    return this.prisma.masterDataGroup.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status as Status }),
      },
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  async removeGroup(id: string, deleterId: string) {
    const group = await this.prisma.masterDataGroup.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });
    if (!group) throw new NotFoundException('Master data group not found');
    if (group.isSystem) throw new ForbiddenException('Cannot delete system groups');

    // Check if any active items exist
    const activeItems = await this.prisma.masterDataItem.count({
      where: { groupId: id, deletedAt: null },
    });
    if (activeItems > 0) {
      throw new BadRequestException(
        `Cannot delete group "${group.name}" — it has ${activeItems} active item(s). Remove all items first.`,
      );
    }

    // Hard delete if no items, or soft delete
    await this.prisma.$transaction([
      this.prisma.masterDataItem.deleteMany({ where: { groupId: id } }),
      this.prisma.masterDataGroup.delete({ where: { id } }),
    ]);

    return { message: `Group "${group.name}" deleted` };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ITEMS
  // ═════════════════════════════════════════════════════════════════════════

  async findAllItems(query: QueryItemsDto, userId: string, isSuperAdmin: boolean) {
    const {
      page = 1, pageSize = 50, sort = 'sortOrder', order = 'asc',
      search, status, groupId, companyId,
    } = query;

    const where: Prisma.MasterDataItemWhereInput = { deletedAt: null };

    if (groupId) where.groupId = groupId;

    // Tenant isolation
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
          { companyId: null },
        ];
      } else {
        where.OR = [
          { companyId: { in: companyIds } },
          { companyId: null },
        ];
      }
    } else if (companyId) {
      where.companyId = companyId;
    }

    if (status) where.status = status as Status;
    if (search) {
      const existingAnd = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
      where.AND = [
        ...existingAnd,
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { value: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.masterDataItem.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          group: { select: { id: true, name: true, code: true } },
          parent: { select: { id: true, name: true, code: true } },
          _count: { select: { children: true } },
        },
      }),
      this.prisma.masterDataItem.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOneItem(id: string) {
    const item = await this.prisma.masterDataItem.findUnique({
      where: { id, deletedAt: null },
      include: {
        group: { select: { id: true, name: true, code: true } },
        parent: { select: { id: true, name: true, code: true } },
        children: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, code: true, value: true, sortOrder: true, status: true },
        },
      },
    });

    if (!item) throw new NotFoundException('Master data item not found');
    return item;
  }

  async createItem(dto: CreateItemDto, creatorId: string) {
    // Validate group exists
    const group = await this.prisma.masterDataGroup.findUnique({ where: { id: dto.groupId } });
    if (!group) throw new NotFoundException('Master data group not found');

    // Validate parent item exists if provided
    if (dto.parentId) {
      const parent = await this.prisma.masterDataItem.findUnique({
        where: { id: dto.parentId, deletedAt: null },
      });
      if (!parent) throw new NotFoundException('Parent item not found');
      if (parent.groupId !== dto.groupId) {
        throw new BadRequestException('Parent item must belong to the same group');
      }
    }

    // Check unique code within group + company scope
    if (dto.code) {
      const existing = await this.prisma.masterDataItem.findFirst({
        where: {
          groupId: dto.groupId,
          code: dto.code,
          companyId: dto.companyId || null,
          deletedAt: null,
        },
      });
      if (existing) throw new ConflictException(`Item code "${dto.code}" already exists in this group`);
    }

    return this.prisma.masterDataItem.create({
      data: {
        groupId: dto.groupId,
        name: dto.name,
        code: dto.code,
        value: dto.value,
        sortOrder: dto.sortOrder ?? 0,
        metadata: dto.metadata ?? undefined,
        companyId: dto.companyId || null,
        createdBy: creatorId,
      },
      include: {
        group: { select: { id: true, name: true, code: true } },
        parent: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async updateItem(id: string, dto: UpdateItemDto, updaterId: string) {
    const item = await this.prisma.masterDataItem.findUnique({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Master data item not found');

    // Validate parent if changing
    if (dto.parentId && dto.parentId !== item.parentId) {
      if (dto.parentId === id) throw new BadRequestException('Item cannot be its own parent');
      const parent = await this.prisma.masterDataItem.findUnique({
        where: { id: dto.parentId, deletedAt: null },
      });
      if (!parent) throw new NotFoundException('Parent item not found');
      if (parent.groupId !== item.groupId) {
        throw new BadRequestException('Parent item must belong to the same group');
      }
    }

    return this.prisma.masterDataItem.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
        ...(dto.status && { status: dto.status as Status }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId }),
      },
      include: {
        group: { select: { id: true, name: true, code: true } },
        parent: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async removeItem(id: string, deleterId: string) {
    const item = await this.prisma.masterDataItem.findUnique({
      where: { id, deletedAt: null },
      include: { _count: { select: { children: true } } },
    });
    if (!item) throw new NotFoundException('Master data item not found');

    // Soft delete — also soft delete children
    await this.prisma.$transaction(async (tx) => {
      // Soft delete children first
      await tx.masterDataItem.updateMany({
        where: { parentId: id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      // Soft delete the item
      await tx.masterDataItem.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'archived' as Status },
      });
    });

    return { message: `Item "${item.name}" archived` };
  }

  async restoreItem(id: string) {
    const item = await this.prisma.masterDataItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Master data item not found');
    if (!item.deletedAt) throw new BadRequestException('Item is not archived');

    return this.prisma.masterDataItem.update({
      where: { id },
      data: { deletedAt: null, status: 'active' as Status },
      select: { id: true, name: true, status: true },
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // EXPORT
  // ═════════════════════════════════════════════════════════════════════════

  async exportItems(groupId?: string, companyId?: string) {
    const where: Prisma.MasterDataItemWhereInput = { deletedAt: null };
    if (groupId) where.groupId = groupId;
    if (companyId) {
      where.OR = [{ companyId }, { companyId: null }];
    }

    const items = await this.prisma.masterDataItem.findMany({
      where,
      orderBy: [{ groupId: 'asc' }, { sortOrder: 'asc' }],
      include: {
        group: { select: { name: true, code: true } },
      },
    });

    return items.map((item) => ({
      groupCode: item.group.code,
      groupName: item.group.name,
      name: item.name,
      code: item.code,
      value: item.value,
      sortOrder: item.sortOrder,
      status: item.status,
    }));
  }
}
