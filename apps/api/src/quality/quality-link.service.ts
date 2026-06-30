import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/capa.dto';

@Injectable()
export class QualityLinkService {
  constructor(private prisma: PrismaService) {}

  async createLink(dto: CreateLinkDto, companyId: string) {
    return this.prisma.qualityLink.create({ data: { ...dto, companyId } });
  }

  async findLinks(companyId: string, query: any) {
    const { qualityRecordId, qualityRecordType, linkedModule, page = 1, limit = 50 } = query || {};
    const where: any = { companyId };
    if (qualityRecordId) where.qualityRecordId = qualityRecordId;
    if (qualityRecordType) where.qualityRecordType = qualityRecordType;
    if (linkedModule) where.linkedModule = linkedModule;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.qualityLink.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.qualityLink.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async deleteLink(id: string, companyId: string) {
    const l = await this.prisma.qualityLink.findUnique({ where: { id } });
    if (!l || l.companyId !== companyId) throw new NotFoundException('Link not found');
    return this.prisma.qualityLink.delete({ where: { id } });
  }

  async getCrossModuleView(qualityRecordId: string, companyId: string) {
    const links = await this.prisma.qualityLink.findMany({
      where: { qualityRecordId, companyId },
      orderBy: { createdAt: 'desc' },
    });

    const modules: Record<string, any[]> = {};
    for (const link of links) {
      if (!modules[link.linkedModule]) modules[link.linkedModule] = [];
      modules[link.linkedModule].push(link);
    }

    return { qualityRecordId, linkedModules: modules };
  }
}
