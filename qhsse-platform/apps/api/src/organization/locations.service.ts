import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOrgDto, userId: string, isSuperAdmin: boolean) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, status, companyId, siteId } = query;

    const where: Prisma.LocationWhereInput = { deletedAt: null };

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
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.location.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          site: { select: { id: true, name: true, code: true } },
          parent: { select: { id: true, name: true, code: true } },
          _count: { select: { children: true } },
        },
      }),
      this.prisma.location.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string, userId: string, isSuperAdmin: boolean) {
    const location = await this.prisma.location.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: { select: { id: true, name: true, code: true } },
        site: { select: { id: true, name: true, code: true } },
        parent: { select: { id: true, name: true, code: true, type: true } },
        children: { where: { deletedAt: null }, select: { id: true, name: true, code: true, type: true, status: true } },
      },
    });

    if (!location) throw new NotFoundException('Location not found');

    if (!isSuperAdmin) {
      const assignment = await this.prisma.userCompanyAssignment.findUnique({
        where: { userId_companyId: { userId, companyId: location.companyId } },
      });
      if (!assignment || assignment.status !== 'active') {
        throw new ForbiddenException('You do not have access to this company');
      }
    }

    return location;
  }

  async create(dto: CreateLocationDto, userId: string) {
    // Validate site belongs to company
    const site = await this.prisma.site.findUnique({ where: { id: dto.siteId } });
    if (!site || site.companyId !== dto.companyId) {
      throw new NotFoundException('Site not found in this company');
    }

    if (dto.code) {
      const existing = await this.prisma.location.findUnique({
        where: { siteId_code: { siteId: dto.siteId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Location code "${dto.code}" already exists in this site`);
    }

    if (dto.parentId) {
      const parent = await this.prisma.location.findUnique({ where: { id: dto.parentId } });
      if (!parent || parent.siteId !== dto.siteId) {
        throw new BadRequestException('Parent location not found in this site');
      }
    }

    return this.prisma.location.create({
      data: {
        companyId: dto.companyId,
        siteId: dto.siteId,
        name: dto.name,
        code: dto.code,
        type: dto.type,
        parentId: dto.parentId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        createdBy: userId,
      },
      include: {
        site: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, dto: UpdateLocationDto, userId: string, isSuperAdmin: boolean) {
    const location = await this.findOne(id, userId, isSuperAdmin);

    if (dto.code && dto.code !== location.code) {
      const siteId = dto.siteId ?? location.siteId;
      const existing = await this.prisma.location.findUnique({
        where: { siteId_code: { siteId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Location code "${dto.code}" already exists in this site`);
    }

    if (dto.parentId === id) {
      throw new BadRequestException('Location cannot be its own parent');
    }

    return this.prisma.location.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        type: dto.type,
        parentId: dto.parentId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) throw new ForbiddenException('Only super admin can delete locations');

    const location = await this.prisma.location.findUnique({ where: { id, deletedAt: null } });
    if (!location) throw new NotFoundException('Location not found');

    return this.prisma.location.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId, status: 'archived' as Status },
    });
  }
}
