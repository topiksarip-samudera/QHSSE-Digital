import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertRuleDto, QueryDto } from './dto/system-health.dto';
import * as os from 'os';

@Injectable()
export class SystemHealthService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    const dbConnected = await this.checkDatabase();
    const memUsage = process.memoryUsage();
    const cpuLoad = os.loadavg()[0];

    return {
      status: dbConnected ? 'healthy' : 'unhealthy',
      cpu: Math.round(cpuLoad * 100) / 100,
      ram: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      disk: 0,
      dbStatus: dbConnected ? 'connected' : 'disconnected',
      uptimeMin: Math.round(process.uptime() / 60),
      errors24h: await this.prisma.errorLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 86400000) } },
      }),
      apiCalls24h: await this.prisma.apiMetric.count({
        where: { createdAt: { gte: new Date(Date.now() - 86400000) } },
      }),
      avgApiDuration: Math.round(
        (await this.prisma.apiMetric.aggregate({
          _avg: { duration: true },
          where: { createdAt: { gte: new Date(Date.now() - 3600000) } },
        }))._avg?.duration || 0,
      ),
      timestamp: new Date(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
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
