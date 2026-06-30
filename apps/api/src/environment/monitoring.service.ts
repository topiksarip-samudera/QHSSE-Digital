import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentMonitoringService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(data: any, companyId: string, userId: string) {
    return this.prisma.environmentMonitoringSchedule.create({
      data: { companyId, title: data.title, description: data.description, monitoringTypeId: data.monitoringTypeId, area: data.area, frequency: data.frequency, nextRun: data.nextRun ? new Date(data.nextRun) : null, responsibleId: data.responsibleId, createdBy: userId },
    });
  }

  async getSchedules(companyId: string) {
    return this.prisma.environmentMonitoringSchedule.findMany({ where: { companyId, deletedAt: null }, orderBy: { nextRun: 'asc' }, take: 100 });
  }

  async findOneSchedule(id: string, companyId: string) { const s = await this.prisma.environmentMonitoringSchedule.findUnique({ where: { id } }); if (!s || s.companyId !== companyId) throw new NotFoundException(); return s; }
  async updateSchedule(id: string, data: any, companyId: string) { await this.findOneSchedule(id, companyId); return this.prisma.environmentMonitoringSchedule.update({ where: { id }, data }); }

  async createResult(data: any, companyId: string, userId: string) {
    const isExceedance = data.limitValue && data.value && data.value > data.limitValue;
    return this.prisma.environmentMonitoringResult.create({
      data: { companyId, scheduleId: data.scheduleId, title: data.title, parameterGroupId: data.parameterGroupId, parameterId: data.parameterId, value: data.value, unitId: data.unitId, limitValue: data.limitValue, isExceedance, testDate: data.testDate ? new Date(data.testDate) : null, testedBy: data.testedBy, labName: data.labName, createdBy: userId },
    });
  }

  async getResults(companyId: string) {
    return this.prisma.environmentMonitoringResult.findMany({ where: { companyId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createExceedance(data: any, companyId: string, userId: string) {
    return this.prisma.environmentExceedance.create({
      data: { companyId, title: data.title, description: data.description, resultId: data.resultId, exceedanceLevelId: data.exceedanceLevelId, value: data.value, limitValue: data.limitValue, actionTaken: data.actionTaken, reportedBy: userId, createdBy: userId },
    });
  }

  async getExceedances(companyId: string) {
    return this.prisma.environmentExceedance.findMany({ where: { companyId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async resolveExceedance(id: string, companyId: string, userId: string) {
    return this.prisma.environmentExceedance.update({ where: { id }, data: { actionStatus: 'resolved', resolvedBy: userId, resolvedAt: new Date() } });
  }

  async createSpill(data: any, companyId: string, userId: string) {
    return this.prisma.environmentSpill.create({
      data: { companyId, title: data.title, description: data.description, material: data.material, quantity: data.quantity, unit: data.unit, area: data.area, severityId: data.severityId, containmentAction: data.containmentAction, cleanupAction: data.cleanupAction, reportedTo: data.reportedTo, incidentDate: data.incidentDate ? new Date(data.incidentDate) : null, reportedBy: userId, createdBy: userId },
    });
  }

  async getSpills(companyId: string) {
    return this.prisma.environmentSpill.findMany({ where: { companyId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
