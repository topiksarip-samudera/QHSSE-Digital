import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto, ApiKeyQueryDto } from './dto/api-key.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  private generateKey(): { raw: string; hash: string; prefix: string } {
    const raw = `qhsse_${crypto.randomBytes(32).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const prefix = raw.slice(0, 14);
    return { raw, hash, prefix };
  }

  async create(dto: CreateApiKeyDto, companyId: string, userId: string) {
    const { raw, hash, prefix } = this.generateKey();
    const key = await this.prisma.apiKey.create({
      data: { companyId, name: dto.name, keyHash: hash, keyPrefix: prefix, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, createdBy: userId, status: 'active' },
    });
    if (dto.scopes && dto.scopes.length > 0) {
      for (const scope of dto.scopes) {
        await this.prisma.apiKeyScope.create({ data: { apiKeyId: key.id, resource: scope } });
      }
    }
    if (dto.maxRequests) {
      await this.prisma.rateLimit.create({ data: { apiKeyId: key.id, maxRequests: dto.maxRequests, windowSec: dto.windowSec || 3600 } });
    }
    return { id: key.id, name: key.name, apiKey: raw, prefix, expiresAt: key.expiresAt, scopes: dto.scopes || [] };
  }

  async findAll(companyId: string, query: ApiKeyQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId };
    if (query.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.apiKey.findMany({ where, include: { scopes: true, rateLimit: true }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.apiKey.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const k = await this.prisma.apiKey.findUnique({ where: { id }, include: { scopes: true, rateLimit: true } });
    if (!k) throw new NotFoundException('Not found');
    if (k.companyId !== companyId) throw new ForbiddenException('Access denied');
    return k;
  }

  async revoke(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.apiKey.update({ where: { id }, data: { status: 'revoked' } });
    return { success: true };
  }

  async rotate(id: string, companyId: string) {
    const old = await this.findOne(id, companyId);
    await this.prisma.apiKey.update({ where: { id }, data: { status: 'revoked' } });
    const { raw, hash, prefix } = this.generateKey();
    const scopes = old.scopes.map((s: any) => s.resource);
    const rate = old.rateLimit;
    const newKey = await this.prisma.apiKey.create({
      data: { companyId, name: `${old.name} (rotated)`, keyHash: hash, keyPrefix: prefix, expiresAt: old.expiresAt, createdBy: 'system', status: 'active' },
    });
    for (const scope of scopes) {
      await this.prisma.apiKeyScope.create({ data: { apiKeyId: newKey.id, resource: scope } });
    }
    if (rate) {
      await this.prisma.rateLimit.create({ data: { apiKeyId: newKey.id, maxRequests: rate.maxRequests, windowSec: rate.windowSec } });
    }
    return { id: newKey.id, apiKey: raw, prefix };
  }

  async getUsage(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.apiUsageLog.findMany({ where: { apiKeyId: id }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
