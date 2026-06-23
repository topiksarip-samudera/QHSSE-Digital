import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertRuleDto, QueryDto } from './dto/system-health.dto';

@Injectable()
export class SystemHealthService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    const latest = await this.prisma.systemHealthLog.findFirst({ orderBy: { createdAt: 'desc' } });
    const errorCount = await this.prisma.errorLog.count({ where: { createdAt: { gte: new Date(Date.now()-86400000) } } });
    const apiCount = await this.prisma.apiMetric.count({ where: { createdAt: { gte: new Date(Date.now()-86400000) } } });
    const avgDuration = await this.prisma.apiMetric.aggregate({ _avg: { duration: true }, where: { createdAt: { gte: new Date(Date.now()-3600000) } } });
    return {
      status: latest ? 'healthy' : 'unknown',
      cpu: latest?.cpuPercent || 0,
      ram: latest?.ramPercent || 0,
      disk: latest?.diskPercent || 0,
      dbStatus: latest?.dbStatus || 'unknown',
      uptimeMin: latest?.uptimeMin || 0,
      errors24h: errorCount,
      apiCalls24h: apiCount,
      avgApiDuration: Math.round(avgDuration._avg?.duration || 0),
      timestamp: latest?.createdAt || new Date(),
    };
  }

  async getErrors(query: QueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.errorLog.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.errorLog.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getAlertRules() {
    return this.prisma.alertRule.findMany();
  }

  async createAlertRule(dto: CreateAlertRuleDto) {
    return this.prisma.alertRule.create({ data: { name: dto.name, metric: dto.metric, operator: dto.operator || 'gt', threshold: dto.threshold } });
  }

  async deleteAlertRule(id: string) {
    await this.prisma.alertRule.delete({ where: { id } });
    return { success: true };
  }

  async getAlerts() {
    return this.prisma.systemAlert.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  }

  async acknowledgeAlert(id: string) {
    await this.prisma.systemAlert.update({ where: { id }, data: { acknowledged: true } });
    return { success: true };
  }
}
