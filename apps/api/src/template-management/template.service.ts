import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateTemplateDto, UpdateTemplateDto, TemplateQueryDto, CreateCategoryDto, CreateAssignmentDto } from './dto/template.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateDto, companyId: string, userId: string) {
    return this.prisma.template.create({
      data: { ...dto, companyId: dto.isGlobal ? null : companyId, content: dto.content || {}, createdBy: userId, status: Status.draft },
    });
  }

  async findAll(companyId: string, query: TemplateQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { deletedAt: null, OR: [{ companyId }, { isGlobal: true }] };
    if (query.type) where.type = query.type;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) where.AND = [{ OR: [{ name: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }] }];
    const [data, total] = await Promise.all([
      this.prisma.template.findMany({ where, include: { category: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.template.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const t = await this.prisma.template.findUnique({
      where: { id }, include: { category: true, versions: { orderBy: { version: 'desc' }, take: 10 }, assignments: true },
    });
    if (!t) throw new NotFoundException('Not found');
    return t;
  }

  async update(id: string, dto: UpdateTemplateDto, companyId: string) {
    const t = await this.findOne(id);
    if (t.isGlobal && t.companyId === null) throw new BadRequestException('Global template can only be edited by Super Admin');
    if (t.companyId && t.companyId !== companyId) throw new ForbiddenException('Access denied');
    if (t.status === Status.active) throw new BadRequestException('Cannot edit published template. Clone instead.');
    return this.prisma.template.update({ where: { id }, data: dto });
  }

  async softDelete(id: string, companyId: string) {
    const t = await this.findOne(id);
    if (t.companyId && t.companyId !== companyId) throw new ForbiddenException('Access denied');
    await this.prisma.template.update({ where: { id }, data: { deletedAt: new Date(), status: Status.archived } });
    return { success: true, id };
  }

  async publish(id: string, companyId: string, userId: string) {
    const t = await this.findOne(id);
    if (t.companyId && t.companyId !== companyId) throw new ForbiddenException('Access denied');
    if (t.status === Status.active) throw new BadRequestException('Already published');
    const newVersion = t.version + 1;
    await this.prisma.templateVersion.create({ data: { templateId: id, companyId, version: newVersion, content: t.content as any, publishedBy: userId, publishedAt: new Date() } });
    await this.prisma.template.update({ where: { id }, data: { status: Status.active, version: newVersion } });
    return this.findOne(id);
  }

  async clone(id: string, companyId: string, userId: string) {
    const t = await this.findOne(id);
    return this.prisma.template.create({
      data: { companyId, name: `${t.name} (Copy)`, description: t.description, content: t.content as any, type: t.type, categoryId: t.categoryId, createdBy: userId, status: Status.draft },
    });
  }

  async createCategory(dto: CreateCategoryDto, companyId: string) {
    return this.prisma.templateCategory.create({ data: { ...dto, companyId } });
  }

  async getCategories(companyId: string) {
    return this.prisma.templateCategory.findMany({ where: { OR: [{ companyId }, { companyId: null }] }, orderBy: { sortOrder: 'asc' } });
  }

  async createAssignment(dto: CreateAssignmentDto, companyId: string, userId: string) {
    return this.prisma.templateAssignment.create({ data: { ...dto, companyId, assignedBy: userId } });
  }

  async getAssignments(templateId: string) {
    return this.prisma.templateAssignment.findMany({ where: { templateId }, orderBy: { createdAt: 'desc' } });
  }

  async deleteAssignment(id: string) {
    await this.prisma.templateAssignment.delete({ where: { id } });
    return { success: true };
  }
}
