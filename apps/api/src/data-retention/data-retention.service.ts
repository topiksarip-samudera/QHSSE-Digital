import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto, CreateLegalHoldDto, CreatePurgeRequestDto } from './dto/data-retention.dto';

@Injectable()
export class DataRetentionService {
  constructor(private prisma: PrismaService) {}

  async createPolicy(dto: CreatePolicyDto, companyId: string, userId: string) {
    return this.prisma.retentionPolicy.create({ data: { companyId, name: dto.name, module: dto.module, retentionDays: dto.retentionDays, action: dto.action || 'archive', createdBy: userId } });
  }

  async getPolicies(companyId: string) {
    return this.prisma.retentionPolicy.findMany({ where: { companyId, isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  async deletePolicy(id: string) {
    await this.prisma.retentionPolicy.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async archive(companyId: string, module: string, recordType: string, recordId: string, data: any, userId: string) {
    return this.prisma.archiveRecord.create({
      data: { companyId, module, recordType, recordId, data, archivedBy: userId },
    });
  }

  async getArchives(companyId: string, module?: string) {
    return this.prisma.archiveRecord.findMany({
      where: { companyId, ...(module ? { module } : {}) },
      orderBy: { createdAt: 'desc' }, take: 50,
    });
  }

  async createLegalHold(dto: CreateLegalHoldDto, companyId: string, userId: string) {
    return this.prisma.legalHold.create({
      data: { companyId, name: dto.name, module: dto.module, recordType: dto.recordType, recordIds: dto.recordIds || [], reason: dto.reason, placedBy: userId },
    });
  }

  async getLegalHolds(companyId: string) {
    return this.prisma.legalHold.findMany({ where: { companyId, releasedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async releaseLegalHold(id: string, userId: string) {
    await this.prisma.legalHold.update({ where: { id }, data: { releasedBy: userId, releasedAt: new Date() } });
    return { released: true };
  }

  async createPurgeRequest(dto: CreatePurgeRequestDto, companyId: string, userId: string) {
    return this.prisma.purgeRequest.create({
      data: { companyId, module: dto.module, recordType: dto.recordType, recordIds: dto.recordIds, reason: dto.reason, requestedBy: userId },
    });
  }

  async getPurgeRequests(companyId: string) {
    return this.prisma.purgeRequest.findMany({ where: { companyId }, include: { logs: true }, orderBy: { createdAt: 'desc' } });
  }

  async approvePurge(id: string, companyId: string, userId: string) {
    const r = await this.prisma.purgeRequest.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Not found');
    await this.prisma.purgeRequest.update({ where: { id }, data: { status: 'completed', approvedBy: userId, approvedAt: new Date(), completedAt: new Date() } });
    await this.prisma.purgeLog.create({ data: { requestId: id, message: 'Purge approved and completed', level: 'info' } });
    return { purged: true, id };
  }
}
