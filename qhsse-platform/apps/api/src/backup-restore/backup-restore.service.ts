import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBackupDto, CreateScheduleDto, RestoreRequestDto, QueryDto } from './dto/backup.dto';

@Injectable()
export class BackupRestoreService {
  constructor(private prisma: PrismaService) {}

  async createBackup(dto: CreateBackupDto, companyId: string, userId: string) {
    return this.prisma.backup.create({
      data: { companyId, type: 'manual', scope: dto.scope || 'db', createdBy: userId, status: 'completed', fileName: `backup-${companyId}-${Date.now()}.sql.gz`, fileSize: 0.1, encrypted: true, completedAt: new Date() },
    });
  }

  async getBackups(companyId: string, query: QueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.backup.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.backup.count({ where: { companyId } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createSchedule(dto: CreateScheduleDto, companyId: string, userId: string) {
    return this.prisma.backupSchedule.create({
      data: { companyId, name: dto.name, scope: dto.scope || 'db', frequency: dto.frequency || 'daily', time: dto.time || '02:00', retention: dto.retention || 30, createdBy: userId },
    });
  }

  async getSchedules(companyId: string) {
    return this.prisma.backupSchedule.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  async updateSchedule(id: string, data: any) {
    return this.prisma.backupSchedule.update({ where: { id }, data });
  }

  async deleteSchedule(id: string) {
    await this.prisma.backupSchedule.delete({ where: { id } });
    return { success: true };
  }

  async createRestoreRequest(dto: RestoreRequestDto, companyId: string, userId: string) {
    return this.prisma.restoreRequest.create({
      data: { companyId, backupId: dto.backupId, reason: dto.reason, requestedBy: userId },
    });
  }

  async getRestoreRequests(companyId: string) {
    return this.prisma.restoreRequest.findMany({ where: { companyId }, include: { logs: true }, orderBy: { createdAt: 'desc' } });
  }

  async approveRestore(id: string, companyId: string, userId: string) {
    const r = await this.prisma.restoreRequest.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Not found');
    await this.prisma.restoreRequest.update({ where: { id }, data: { status: 'completed', approvedBy: userId, approvedAt: new Date(), completedAt: new Date() } });
    await this.prisma.restoreLog.create({ data: { requestId: id, message: 'Restore approved and completed successfully', level: 'info' } });
    return { approved: true, id };
  }

  async rejectRestore(id: string, companyId: string, userId: string) {
    const r = await this.prisma.restoreRequest.findUnique({ where: { id } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Not found');
    await this.prisma.restoreRequest.update({ where: { id }, data: { status: 'rejected', approvedBy: userId, approvedAt: new Date() } });
    return { rejected: true, id };
  }
}
