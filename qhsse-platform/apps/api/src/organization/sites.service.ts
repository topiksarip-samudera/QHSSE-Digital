import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOrgDto, userId: string, isSuperAdmin: boolean) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, status, companyId, businessUnitId } = query;

    const where: Prisma.SiteWhereInput = { deletedAt: null };

    if (!isSuperAdmin) {
      where.company = {
        users: { some: { userId, status: 'active' } },
      };
    }

    if (companyId) where.companyId = companyId;
    if (businessUnitId) where.businessUnitId = businessUnitId;
    if (status) where.status = status as Status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.site.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          businessUnit: { select: { id: true, name: true, code: true } },
          _count: { select: { departments: true, projects: true, locations: true, userAssignments: true } },
        },
      }),
      this.prisma.site.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string, userId: string, isSuperAdmin: boolean) {
    const site = await this.prisma.site.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: { select: { id: true, name: true, code: true } },
        businessUnit: { select: { id: true, name: true, code: true } },
        departments: { where: { deletedAt: null }, select: { id: true, name: true, code: true, status: true } },
        projects: { where: { deletedAt: null }, select: { id: true, name: true, code: true, status: true } },
        locations: { where: { deletedAt: null }, select: { id: true, name: true, code: true, type: true } },
        _count: { select: { departments: true, projects: true, locations: true, userAssignments: true } },
      },
    });

    if (!site) throw new NotFoundException('Site not found');

    if (!isSuperAdmin) {
      const assignment = await this.prisma.userCompanyAssignment.findUnique({
        where: { userId_companyId: { userId, companyId: site.companyId } },
      });
      if (!assignment || assignment.status !== 'active') {
        throw new ForbiddenException('You do not have access to this company');
      }
    }

    return site;
  }

  async create(dto: CreateSiteDto, userId: string) {
    if (dto.code) {
      const existing = await this.prisma.site.findUnique({
        where: { companyId_code: { companyId: dto.companyId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Site code "${dto.code}" already exists in this company`);
    }

    if (dto.businessUnitId) {
      const bu = await this.prisma.businessUnit.findUnique({ where: { id: dto.businessUnitId } });
      if (!bu || bu.companyId !== dto.companyId) {
        throw new NotFoundException('Business unit not found in this company');
      }
    }

    return this.prisma.site.create({
      data: {
        companyId: dto.companyId,
        businessUnitId: dto.businessUnitId,
        name: dto.name,
        code: dto.code,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
        createdBy: userId,
      },
      include: { businessUnit: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: UpdateSiteDto, userId: string, isSuperAdmin: boolean) {
    const site = await this.findOne(id, userId, isSuperAdmin);

    if (dto.code && dto.code !== site.code) {
      const existing = await this.prisma.site.findUnique({
        where: { companyId_code: { companyId: site.companyId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Site code "${dto.code}" already exists in this company`);
    }

    return this.prisma.site.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        businessUnitId: dto.businessUnitId,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) throw new ForbiddenException('Only super admin can delete sites');

    const site = await this.prisma.site.findUnique({ where: { id, deletedAt: null } });
    if (!site) throw new NotFoundException('Site not found');

    return this.prisma.site.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId, status: 'archived' as Status },
    });
  }
}
