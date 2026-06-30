import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentAspectService {
  constructor(private prisma: PrismaService) {}

  async createAspect(data: any, companyId: string, userId: string) {
    return this.prisma.environmentAspect.create({
      data: { companyId, title: data.title, description: data.description, aspectId: data.aspectId,
        impactId: data.impactId, significance: data.significance || 0, legalConcern: data.legalConcern || 0,
        stakeholderConcern: data.stakeholderConcern || 0, responsibleId: data.responsibleId, createdBy: userId,
      },
    });
  }

  async getAspects(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.environmentAspect.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async findOneAspect(id: string, companyId: string) {
    const aspect = await this.prisma.environmentAspect.findUnique({ where: { id } });
    if (!aspect || aspect.companyId !== companyId) throw new NotFoundException('Aspect not found');
    return aspect;
  }

  async updateAspect(id: string, data: any, companyId: string) {
    await this.findOneAspect(id, companyId);
    return this.prisma.environmentAspect.update({ where: { id }, data });
  }

  async softDeleteAspect(id: string, companyId: string) {
    await this.prisma.environmentAspect.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async createImpact(data: any, companyId: string, userId: string) {
    return this.prisma.environmentImpact.create({
      data: { companyId, title: data.title, description: data.description, impactId: data.impactId,
        severity: data.severity || 0, likelihood: data.likelihood || 0, createdBy: userId,
      },
    });
  }

  async getImpacts(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.environmentImpact.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async findOneImpact(id: string, companyId: string) {
    const impact = await this.prisma.environmentImpact.findUnique({ where: { id } });
    if (!impact || impact.companyId !== companyId) throw new NotFoundException('Impact not found');
    return impact;
  }

  async updateImpact(id: string, data: any, companyId: string) {
    await this.findOneImpact(id, companyId);
    return this.prisma.environmentImpact.update({ where: { id }, data });
  }

  async softDeleteImpact(id: string, companyId: string) {
    await this.prisma.environmentImpact.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  // ─── Significance & Controls ─────────────────────────────────────────────

  async calculateSignificance(aspectId: string) {
    const aspect = await this.findOneAspect(aspectId, 'any');
    const legal = aspect.legalConcern || 0;
    const stakeholder = aspect.stakeholderConcern || 0;
    const severity = aspect.significance || 0;
    return { legal, stakeholder, severity, total: legal + stakeholder + severity };
  }
}
