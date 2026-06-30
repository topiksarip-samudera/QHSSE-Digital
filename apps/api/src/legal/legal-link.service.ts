import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/update-log.dto';

@Injectable()
export class LegalLinkService {
  constructor(private prisma: PrismaService) {}

  async createLink(dto: CreateLinkDto, companyId: string) {
    return this.prisma.legalLink.create({
      data: { ...dto, companyId },
    });
  }

  async findLinks(companyId: string, query: any) {
    const { regulationId, obligationId, linkedModule, page = 1, limit = 50 } = query || {};
    const where: any = { companyId };
    if (regulationId) where.regulationId = regulationId;
    if (obligationId) where.obligationId = obligationId;
    if (linkedModule) where.linkedModule = linkedModule;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.legalLink.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.legalLink.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async deleteLink(id: string, companyId: string) {
    const l = await this.prisma.legalLink.findUnique({ where: { id } });
    if (!l || l.companyId !== companyId) throw new NotFoundException('Link not found');
    return this.prisma.legalLink.delete({ where: { id } });
  }

  async getCrossModuleView(regulationId: string, companyId: string) {
    const links = await this.prisma.legalLink.findMany({
      where: { regulationId, companyId },
      orderBy: { createdAt: 'desc' },
    });

    const modules: Record<string, any[]> = {};
    for (const link of links) {
      if (!modules[link.linkedModule]) modules[link.linkedModule] = [];
      modules[link.linkedModule].push(link);
    }

    const regulation = await this.prisma.regulation.findUnique({
      where: { id: regulationId },
      include: { obligations: { include: { evidence: true } } },
    });

    return { regulation, linkedModules: modules };
  }
}
