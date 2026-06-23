import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  UpdateNotificationPreferenceDto,
  NotificationQueryDto,
} from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // ─── Notifications ──────────────────────────────────────────────────────────

  async createNotification(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        companyId: dto.companyId,
        templateId: dto.templateId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        link: dto.link,
        channel: dto.channel || 'in-app',
        sentAt: new Date(),
      },
    });
  }

  async getNotifications(userId: string, companyId: string | undefined, query: NotificationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (companyId) where.companyId = companyId;
    if (query.type) where.type = query.type;
    if (query.isRead !== undefined) where.isRead = query.isRead;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { template: { select: { code: true, name: true } } },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUnreadCount(userId: string, companyId?: string) {
    const where: any = { userId, isRead: false };
    if (companyId) where.companyId = companyId;
    const count = await this.prisma.notification.count({ where });
    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('Not your notification');

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string, companyId?: string) {
    const where: any = { userId, isRead: false };
    if (companyId) where.companyId = companyId;

    const result = await this.prisma.notification.updateMany({
      where,
      data: { isRead: true, readAt: new Date() },
    });
    return { updated: result.count };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('Not your notification');

    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { success: true };
  }

  // ─── Notification Templates ────────────────────────────────────────────────

  async createTemplate(dto: CreateNotificationTemplateDto) {
    return this.prisma.notificationTemplate.create({
      data: {
        companyId: dto.companyId,
        code: dto.code,
        name: dto.name,
        subject: dto.subject,
        body: dto.body,
        type: dto.type,
        channel: dto.channel || 'both',
        isActive: dto.isActive !== false,
        variables: dto.variables || undefined,
      },
    });
  }

  async getTemplates(companyId?: string) {
    const where: any = {};
    if (companyId) {
      where.OR = [{ companyId: null }, { companyId }];
    }
    return this.prisma.notificationTemplate.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  async getTemplateById(id: string) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async getTemplateByCode(code: string) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { code },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async updateTemplate(id: string, dto: UpdateNotificationTemplateDto) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Template not found');

    return this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.channel !== undefined && { channel: dto.channel }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.variables !== undefined && { variables: dto.variables }),
      },
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Template not found');

    await this.prisma.notificationTemplate.delete({ where: { id } });
    return { success: true };
  }

  // ─── Notification Preferences ──────────────────────────────────────────────

  async getPreferences(userId: string, companyId?: string) {
    const where: any = { userId };
    if (companyId) where.companyId = companyId;
    return this.prisma.notificationPreference.findMany({
      where,
      orderBy: [{ moduleCode: 'asc' }, { eventType: 'asc' }],
    });
  }

  async upsertPreference(
    userId: string,
    moduleCode: string,
    eventType: string,
    dto: UpdateNotificationPreferenceDto,
    companyId?: string,
  ) {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_moduleCode_eventType: { userId, moduleCode, eventType },
      },
      create: {
        userId,
        companyId,
        moduleCode,
        eventType,
        inAppEnabled: dto.inAppEnabled !== false,
        emailEnabled: dto.emailEnabled !== false,
      },
      update: {
        ...(dto.inAppEnabled !== undefined && { inAppEnabled: dto.inAppEnabled }),
        ...(dto.emailEnabled !== undefined && { emailEnabled: dto.emailEnabled }),
      },
    });
  }

  // ─── Notification Logs ─────────────────────────────────────────────────────

  async getLogs(notificationId: string) {
    return this.prisma.notificationLog.findMany({
      where: { notificationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLog(notificationId: string, channel: string, recipient: string, status = 'pending') {
    return this.prisma.notificationLog.create({
      data: {
        notificationId,
        channel,
        recipient,
        status,
      },
    });
  }

  async updateLogStatus(logId: string, status: string, errorMessage?: string) {
    return this.prisma.notificationLog.update({
      where: { id: logId },
      data: {
        status,
        errorMessage,
        ...(status === 'sent' && { sentAt: new Date() }),
      },
    });
  }

  // ─── Bulk Notification (for events) ────────────────────────────────────────

  async sendBulkNotification(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    options?: { companyId?: string; link?: string; templateId?: string; channel?: string },
  ) {
    const data = userIds.map((userId) => ({
      userId,
      companyId: options?.companyId,
      templateId: options?.templateId,
      type,
      title,
      message,
      link: options?.link,
      channel: options?.channel || 'in-app',
      sentAt: new Date(),
    }));

    const result = await this.prisma.notification.createMany({ data });
    return { created: result.count };
  }
}
