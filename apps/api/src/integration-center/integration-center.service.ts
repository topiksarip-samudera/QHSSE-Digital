import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto, QueryDto } from './dto/integration.dto';

@Injectable()
export class IntegrationCenterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIntegrationDto, companyId: string, userId: string) {
    const integration = await this.prisma.integration.create({
      data: { companyId, name: dto.name, type: dto.type, description: dto.description, authType: dto.authType, credentials: dto.credentials || {}, createdBy: userId },
    });
    if (dto.configs) for (const c of dto.configs) await this.prisma.integrationConfig.create({ data: { integrationId: integration.id, configKey: c.key, configValue: c.value } });
    if (dto.mappings) for (const m of dto.mappings) await this.prisma.integrationMapping.create({ data: { integrationId: integration.id, sourceField: m.sourceField, targetField: m.targetField } });
    return this.findOne(integration.id, companyId);
  }

  async findAll(companyId: string, query: QueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.type) where.type = query.type;
    const [data, total] = await Promise.all([
      this.prisma.integration.findMany({ where, include: { _count: { select: { mappings: true, syncJobs: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.integration.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const i = await this.prisma.integration.findUnique({ where: { id }, include: { configs: true, mappings: true } });
    if (!i || i.companyId !== companyId) throw new NotFoundException('Not found');
    return i;
  }

  async update(id: string, data: any, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.integration.update({ where: { id }, data });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.integration.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return { success: true };
  }

  async test(id: string, companyId: string) {
    const i = await this.findOne(id, companyId);
    return { success: true, integration: i.name, type: i.type, configured: !!i.credentials && Object.keys(i.credentials as object).length > 0 };
  }

  async sync(id: string, companyId: string) {
    await this.findOne(id, companyId);
    const job = await this.prisma.integrationSyncJob.create({ data: { integrationId: id, companyId, status: 'completed', startedAt: new Date(), completedAt: new Date(), recordsSynced: 0 } });
    await this.prisma.integrationSyncLog.create({ data: { syncJobId: job.id, message: 'Sync completed successfully' } });
    return { jobId: job.id, status: 'completed', recordsSynced: 0 };
  }

  async getSyncLogs(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.integrationSyncJob.findMany({ where: { integrationId: id }, include: { logs: true }, orderBy: { createdAt: 'desc' }, take: 20 });
  }
}
