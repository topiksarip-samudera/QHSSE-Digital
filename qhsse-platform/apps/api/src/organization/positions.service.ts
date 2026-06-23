import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOrgDto, userId: string, isSuperAdmin: boolean) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, status, companyId } = query;

    const where: Prisma.PositionWhereInput = { deletedAt: null };

    if (!isSuperAdmin) {
      where.company = {
        users: { some: { userId, status: 'active' } },
      };
    }

    if (companyId) where.companyId = companyId;
    if (status) where.status = status as Status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.position.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sort]: order },
        include: {
          _count: { select: { userAssignments: true } },
        },
      }),
      this.prisma.position.count({ where }),
    ]);

    return { items, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string, userId: string, isSuperAdmin: boolean) {
    const position = await this.prisma.position.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: { select: { id: true, name: true, code: true } },
        userAssignments: {
          where: { status: 'active' },
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
    });

    if (!position) throw new NotFoundException('Position not found');

    if (!isSuperAdmin) {
      const assignment = await this.prisma.userCompanyAssignment.findUnique({
        where: { userId_companyId: { userId, companyId: position.companyId } },
      });
      if (!assignment || assignment.status !== 'active') {
        throw new ForbiddenException('You do not have access to this company');
      }
    }

    return position;
  }

  async create(dto: CreatePositionDto, userId: string) {
    if (dto.code) {
      const existing = await this.prisma.position.findUnique({
        where: { companyId_code: { companyId: dto.companyId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Position code "${dto.code}" already exists in this company`);
    }

    return this.prisma.position.create({
      data: {
        companyId: dto.companyId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        level: dto.level,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdatePositionDto, userId: string, isSuperAdmin: boolean) {
    const position = await this.findOne(id, userId, isSuperAdmin);

    if (dto.code && dto.code !== position.code) {
      const existing = await this.prisma.position.findUnique({
        where: { companyId_code: { companyId: position.companyId, code: dto.code } },
      });
      if (existing) throw new ConflictException(`Position code "${dto.code}" already exists in this company`);
    }

    return this.prisma.position.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        level: dto.level,
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId: string, isSuperAdmin: boolean) {
    if (!isSuperAdmin) throw new ForbiddenException('Only super admin can delete positions');

    const position = await this.prisma.position.findUnique({ where: { id, deletedAt: null } });
    if (!position) throw new NotFoundException('Position not found');

    return this.prisma.position.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId, status: 'archived' as Status },
    });
  }
}
