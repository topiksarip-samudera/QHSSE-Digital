import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportTemplateDto, CreateScheduledReportDto } from './dto/reporting.dto';

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(dto: CreateReportTemplateDto, companyId: string, userId: string) {
    return this.prisma.reportTemplate.create({ data: { companyId, name: dto.name, type: dto.type || 'custom', description: dto.description, config: dto.config || {}, createdBy: userId } });
  }

  async getTemplates(companyId: string, type?: string) {
    return this.prisma.reportTemplate.findMany({ where: { companyId, isActive: true, ...(type ? { type } : {}) }, include: { _count: { select: { runHistory: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findTemplate(id: string, companyId: string) {
    const t = await this.prisma.reportTemplate.findUnique({ where: { id } });
    if (!t || t.companyId !== companyId) throw new NotFoundException('Not found');
    return t;
  }

  async updateTemplate(id: string, data: any, companyId: string) {
    await this.findTemplate(id, companyId);
    return this.prisma.reportTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    await this.prisma.reportTemplate.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async runReport(id: string, companyId: string, userId: string) {
    await this.findTemplate(id, companyId);
    const run = await this.prisma.reportRun.create({ data: { templateId: id, companyId, status: 'completed', format: 'pdf', triggeredBy: 'manual', startedAt: new Date(), completedAt: new Date(), filePath: `reports/report-${id}-${Date.now()}.pdf` } });
    return { runId: run.id, status: 'completed', filePath: run.filePath };
  }

  async getRunHistory(companyId: string, templateId?: string) {
    return this.prisma.reportRun.findMany({
      where: { companyId, ...(templateId ? { templateId } : {}) },
      orderBy: { createdAt: 'desc' }, take: 50,
      include: { exports: true },
    });
  }

  async createScheduledReport(dto: CreateScheduledReportDto, companyId: string, userId: string) {
    const schedule = await this.prisma.scheduledReport.create({
      data: { companyId, templateId: dto.templateId, name: dto.name, frequency: dto.frequency || 'monthly', time: dto.time || '08:00', format: dto.format || 'pdf', createdBy: userId },
    });
    if (dto.recipients) {
      for (const email of dto.recipients) {
        await this.prisma.reportRecipient.create({ data: { scheduleId: schedule.id, email } });
      }
    }
    return schedule;
  }

  async getScheduledReports(companyId: string) {
    return this.prisma.scheduledReport.findMany({ where: { companyId }, include: { recipients: true, template: { select: { name: true, type: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async deleteSchedule(id: string) {
    await this.prisma.scheduledReport.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }
}
