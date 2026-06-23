import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSsoProviderDto, UpdateSsoProviderDto, SsoQueryDto } from './dto/sso.dto';
import * as crypto from 'crypto';

const PROVIDERS = ['oidc', 'saml', 'google', 'azure', 'okta', 'keycloak'];

@Injectable()
export class SsoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSsoProviderDto, companyId: string, userId: string) {
    if (!PROVIDERS.includes(dto.provider)) throw new NotFoundException(`Unsupported provider: ${dto.provider}`);
    const provider = await this.prisma.ssoProvider.create({
      data: { companyId, name: dto.name, provider: dto.provider, config: dto.config || {}, createdBy: userId },
    });
    if (dto.mappings) {
      for (const m of dto.mappings) {
        await this.prisma.ssoMapping.create({ data: { providerId: provider.id, claimPath: m.claimPath, claimValue: m.claimValue, targetRoleId: m.targetRoleId, targetSiteId: m.targetSiteId, autoProvision: m.autoProvision || false } });
      }
    }
    return this.findOne(provider.id, companyId);
  }

  async findAll(companyId: string, query: SsoQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.provider) where.provider = query.provider;
    const [data, total] = await Promise.all([
      this.prisma.ssoProvider.findMany({ where, include: { mappings: true, _count: { select: { logs: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.ssoProvider.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const p = await this.prisma.ssoProvider.findUnique({ where: { id }, include: { mappings: true } });
    if (!p) throw new NotFoundException('Not found');
    if (p.companyId !== companyId) throw new ForbiddenException('Access denied');
    return p;
  }

  async update(id: string, dto: UpdateSsoProviderDto, companyId: string) {
    const p = await this.findOne(id, companyId);
    return this.prisma.ssoProvider.update({ where: { id }, data: { name: dto.name ?? p.name, config: dto.config ?? p.config, isActive: dto.isActive ?? p.isActive } });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.ssoProvider.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return { success: true };
  }

  async testProvider(id: string, companyId: string) {
    const p = await this.findOne(id, companyId);
    const testResult = {
      provider: p.provider,
      name: p.name,
      isConfigured: !!p.config && Object.keys(p.config as object).length > 0,
      configKeys: Object.keys(p.config as object || {}),
      timestamp: new Date().toISOString(),
    };
    return { success: true, testResult };
  }

  async getLoginLogs(companyId: string) {
    return this.prisma.ssoLoginLog.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 100, include: { provider: { select: { name: true, provider: true } } } });
  }
}
