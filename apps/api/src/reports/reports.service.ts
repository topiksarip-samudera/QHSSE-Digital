import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReportTemplateDto, UpdateReportTemplateDto,
  CreateReportScheduleDto, UpdateReportScheduleDto,
  CreateReportRunDto, ReportRunQueryDto, ReportTemplateQueryDto,
  UpdateReportSettingDto,
} from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // ─── Report Template ──────────────────────────────────────────────────────

  async createTemplate(dto: CreateReportTemplateDto, companyId: string, userId: string) {
    return this.prisma.reportTemplate.create({
      data: { companyId, name: dto.name, type: dto.type, config: dto.config || {}, createdBy: userId },
    });
  }

  async getTemplates(companyId: string, query: ReportTemplateQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, isActive: true };
    if (query.type) where.type = query.type;
    const [data, total] = await Promise.all([
      this.prisma.reportTemplate.findMany({ where, include: { _count: { select: { runHistory: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.reportTemplate.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getTemplate(id: string, companyId: string) {
    const t = await this.prisma.reportTemplate.findUnique({ where: { id }, include: { _count: { select: { runHistory: true } } } });
    if (!t) throw new NotFoundException('Report template not found');
    if (t.companyId !== companyId) throw new ForbiddenException('Access denied');
    return t;
  }

  async updateTemplate(id: string, dto: UpdateReportTemplateDto, companyId: string) {
    await this.getTemplate(id, companyId);
    return this.prisma.reportTemplate.update({ where: { id }, data: dto });
  }

  async deleteTemplate(id: string, companyId: string) {
    await this.getTemplate(id, companyId);
    await this.prisma.reportTemplate.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  // ─── Report Run ───────────────────────────────────────────────────────────

  async runReport(id: string, dto: CreateReportRunDto, companyId: string, userId: string) {
    const templateId = id || dto.templateId;
    await this.getTemplate(templateId, companyId);
    const run = await this.prisma.reportRun.create({
      data: {
        templateId, companyId, status: 'pending', format: dto.format || 'pdf',
        triggeredBy: 'manual', startedAt: new Date(), completedAt: new Date(),
        filePath: `reports/report-${templateId}-${Date.now()}.pdf`,
        scheduleId: dto.scheduleId,
      },
    });
    return { runId: run.id, status: run.status, filePath: run.filePath };
  }

  async getRunHistory(companyId: string, query: ReportRunQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId };
    if (query.templateId) where.templateId = query.templateId;
    if (query.scheduleId) where.scheduleId = query.scheduleId;
    const [data, total] = await Promise.all([
      this.prisma.reportRun.findMany({ where, include: { exports: true }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.reportRun.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getRun(id: string, companyId: string) {
    const r = await this.prisma.reportRun.findUnique({ where: { id }, include: { exports: true } });
    if (!r) throw new NotFoundException('Report run not found');
    if (r.companyId !== companyId) throw new ForbiddenException('Access denied');
    return r;
  }

  // ─── Report Schedule ──────────────────────────────────────────────────────

  async createSchedule(dto: CreateReportScheduleDto, companyId: string, userId: string) {
    return this.prisma.reportSchedule.create({
      data: {
        companyId, templateId: dto.templateId, frequency: dto.frequency,
        recipients: dto.recipients || [], format: dto.format || 'pdf',
        nextRun: dto.nextRun ? new Date(dto.nextRun) : null, createdBy: userId,
      },
    });
  }

  async getSchedules(companyId: string, templateId?: string) {
    const where: any = { companyId, isActive: true };
    if (templateId) where.templateId = templateId;
    return this.prisma.reportSchedule.findMany({
      where, include: { template: { select: { name: true, type: true } } }, orderBy: { createdAt: 'desc' },
    });
  }

  async getSchedule(id: string, companyId: string) {
    const s = await this.prisma.reportSchedule.findUnique({ where: { id }, include: { template: { select: { name: true, type: true } } } });
    if (!s) throw new NotFoundException('Schedule not found');
    if (s.companyId !== companyId) throw new ForbiddenException('Access denied');
    return s;
  }

  async updateSchedule(id: string, dto: UpdateReportScheduleDto, companyId: string) {
    await this.getSchedule(id, companyId);
    return this.prisma.reportSchedule.update({ where: { id }, data: dto });
  }

  async deleteSchedule(id: string, companyId: string) {
    await this.getSchedule(id, companyId);
    await this.prisma.reportSchedule.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  // ─── Report Settings ──────────────────────────────────────────────────────

  async getSettings(companyId: string) {
    let s = await this.prisma.reportSetting.findUnique({ where: { companyId } });
    if (!s) {
      s = await this.prisma.reportSetting.create({
        data: { companyId, defaultFormat: 'pdf', autoExport: false, exportRetentionDays: 90, maxExportRows: 10000 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateReportSettingDto) {
    await this.getSettings(companyId);
    return this.prisma.reportSetting.update({ where: { companyId }, data: dto });
  }
}
