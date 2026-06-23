import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleQueryDto } from './dto/schedule.dto';

@Injectable()
export class CalendarScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto, companyId: string, userId: string) {
    let recurrenceId: string | undefined;
    if (dto.frequency) {
      const rec = await this.prisma.recurrenceRule.create({ data: { companyId, frequency: dto.frequency, interval: dto.interval || 1 } });
      recurrenceId = rec.id;
    }
    const schedule = await this.prisma.schedule.create({
      data: { companyId, name: dto.name, description: dto.description, type: dto.type || 'inspection', priority: dto.priority || 'medium', startDate: new Date(dto.startDate), endDate: dto.endDate ? new Date(dto.endDate) : null, assigneeId: dto.assigneeId, siteId: dto.siteId, recurrenceId, createdBy: userId, status: Status.active },
    });
    if (dto.reminderMinutes) {
      for (const min of dto.reminderMinutes) {
        await this.prisma.scheduleReminder.create({ data: { scheduleId: schedule.id, companyId, minutesBefore: min } });
      }
    }
    if (recurrenceId) {
      await this.generateOccurrences(schedule.id, companyId);
    }
    return this.findOne(schedule.id, companyId);
  }

  async findAll(companyId: string, query: ScheduleQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.assigneeId) where.assigneeId = query.assigneeId;
    if (query.fromDate || query.toDate) { where.startDate = {}; if (query.fromDate) where.startDate.gte = new Date(query.fromDate); if (query.toDate) where.startDate.lte = new Date(query.toDate); }
    const [data, total] = await Promise.all([
      this.prisma.schedule.findMany({ where, include: { occurrences: { take: 5, orderBy: { dueDate: 'asc' } }, recurrence: { select: { frequency: true, interval: true } } }, orderBy: { startDate: 'asc' }, skip, take: limit }),
      this.prisma.schedule.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const s = await this.prisma.schedule.findUnique({ where: { id }, include: { occurrences: { orderBy: { dueDate: 'asc' } }, reminders: true, recurrence: true } });
    if (!s) throw new NotFoundException('Not found');
    if (s.companyId !== companyId) throw new ForbiddenException('Access denied');
    return s;
  }

  async update(id: string, dto: UpdateScheduleDto, companyId: string) {
    const s = await this.findOne(id, companyId);
    return this.prisma.schedule.update({ where: { id }, data: { name: dto.name ?? s.name, description: dto.description !== undefined ? dto.description : s.description, type: dto.type ?? s.type, status: (dto.status as Status) ?? s.status } });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.schedule.update({ where: { id }, data: { deletedAt: new Date(), status: Status.archived } });
    return { success: true };
  }

  async generateOccurrences(scheduleId: string, companyId: string) {
    const schedule = await this.findOne(scheduleId, companyId);
    if (!schedule.recurrence) return { occurrences: 0 };
    const rec = schedule.recurrence;
    const start = new Date(schedule.startDate);
    const end = schedule.endDate || new Date(start.getFullYear() + 1, 11, 31);
    const count = rec.endAfter || 52;
    const nextDates = this.calculateRecurrence(start, rec.frequency, rec.interval, count, end);
    for (const dueDate of nextDates) {
      await this.prisma.scheduleOccurrence.create({ data: { scheduleId, companyId, dueDate, status: Status.draft } });
    }
    return { occurrences: nextDates.length };
  }

  async getOccurrences(companyId: string, fromDate?: string, toDate?: string) {
    const where: any = { companyId };
    if (fromDate || toDate) { where.dueDate = {}; if (fromDate) where.dueDate.gte = new Date(fromDate); if (toDate) where.dueDate.lte = new Date(toDate); }
    return this.prisma.scheduleOccurrence.findMany({ where, include: { schedule: { select: { name: true, type: true } } }, orderBy: { dueDate: 'asc' }, take: 200 });
  }

  private calculateRecurrence(start: Date, freq: string, interval: number, count: number, end: Date): Date[] {
    const dates: Date[] = [];
    let current = new Date(start);
    let i = 0;
    while (dates.length < count && current <= end) {
      if (i > 0) dates.push(new Date(current));
      switch (freq) {
        case 'daily': current = new Date(current.getTime() + interval * 86400000); break;
        case 'weekly': current = new Date(current.getTime() + interval * 7 * 86400000); break;
        case 'monthly': current = new Date(current.getFullYear(), current.getMonth() + interval, current.getDate()); break;
        case 'quarterly': current = new Date(current.getFullYear(), current.getMonth() + interval * 3, current.getDate()); break;
        case 'yearly': current = new Date(current.getFullYear() + interval, current.getMonth(), current.getDate()); break;
        default: current = end; break;
      }
      i++;
    }
    return dates;
  }
}
