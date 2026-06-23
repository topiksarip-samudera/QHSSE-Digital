import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationService } from '../notification.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationType, NotificationChannel } from '../dto/create-notification.dto';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  notification: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  notificationTemplate: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  notificationLog: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  notificationPreference: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
};

// ─── Helper Factories ──────────────────────────────────────────────────────

function makeNotification(overrides = {}) {
  return {
    id: 'notif-1',
    userId: 'user-1',
    companyId: 'comp-1',
    templateId: null,
    type: 'info',
    title: 'Test Notification',
    message: 'Test message',
    link: '/dashboard',
    channel: 'in-app',
    isRead: false,
    readAt: null,
    sentAt: new Date(),
    createdAt: new Date(),
    template: null,
    ...overrides,
  };
}

function makeTemplate(overrides = {}) {
  return {
    id: 'tmpl-1',
    companyId: null,
    code: 'incident_created',
    name: 'Incident Created',
    subject: 'New incident: {{title}}',
    body: 'A new incident has been created.',
    type: 'info',
    channel: 'both',
    isActive: true,
    variables: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makePreference(overrides = {}) {
  return {
    id: 'pref-1',
    userId: 'user-1',
    companyId: 'comp-1',
    moduleCode: 'incident-basic',
    eventType: 'created',
    inAppEnabled: true,
    emailEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeLog(overrides = {}) {
  return {
    id: 'log-1',
    notificationId: 'notif-1',
    channel: 'email',
    status: 'sent',
    recipient: 'user@example.com',
    errorMessage: null,
    metadata: null,
    sentAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new NotificationService(mockPrisma as any);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const dto = {
        userId: 'user-1',
        type: NotificationType.INFO,        title: 'Test',
        message: 'Hello',
      };
      const expected = makeNotification(dto);
      mockPrisma.notification.create.mockResolvedValue(expected);

      const result = await service.createNotification(dto);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          companyId: undefined,
          templateId: undefined,
          type: 'info',
          title: 'Test',
          message: 'Hello',
          link: undefined,
          channel: 'in-app',
          sentAt: expect.any(Date),
        },
      });
      expect(result).toEqual(expected);
    });

    it('should create with custom channel and companyId', async () => {
      const dto = {
        userId: 'user-1',
        companyId: 'comp-1',
        type: NotificationType.ALERT,
        title: 'Alert',
        channel: NotificationChannel.EMAIL,      };
      mockPrisma.notification.create.mockResolvedValue(makeNotification(dto));

      await service.createNotification(dto);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId: 'comp-1',
          channel: 'email',
        }),
      });
    });
  });

  describe('getNotifications', () => {
    it('should return paginated notifications', async () => {
      const notifications = [makeNotification(), makeNotification({ id: 'notif-2' })];
      mockPrisma.notification.findMany.mockResolvedValue(notifications);
      mockPrisma.notification.count.mockResolvedValue(2);

      const result = await service.getNotifications('user-1', 'comp-1', {});

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ total: 2, page: 1, limit: 20, totalPages: 1 });
    });

    it('should filter by type', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);

      await service.getNotifications('user-1', 'comp-1', { type: 'alert' });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'alert' }),
        }),
      );
    });

    it('should filter by isRead', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);

      await service.getNotifications('user-1', 'comp-1', { isRead: false });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isRead: false }),
        }),
      );
    });

    it('should handle pagination', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(50);

      const result = await service.getNotifications('user-1', 'comp-1', { page: 2, limit: 10 });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
      expect(result.meta.totalPages).toBe(5);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      mockPrisma.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1', 'comp-1');

      expect(result).toEqual({ count: 5 });
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', companyId: 'comp-1', isRead: false },
      });
    });

    it('should work without companyId', async () => {
      mockPrisma.notification.count.mockResolvedValue(3);

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({ count: 3 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notif = makeNotification();
      mockPrisma.notification.findUnique.mockResolvedValue(notif);
      mockPrisma.notification.update.mockResolvedValue({ ...notif, isRead: true });

      const result = await service.markAsRead('notif-1', 'user-1');

      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException if notification not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('notif-999', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not user notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(
        makeNotification({ userId: 'other-user' }),
      );

      await expect(service.markAsRead('notif-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead('user-1', 'comp-1');

      expect(result).toEqual({ updated: 5 });
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(makeNotification());
      mockPrisma.notification.delete.mockResolvedValue({});

      const result = await service.deleteNotification('notif-1', 'user-1');

      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.deleteNotification('notif-999', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not user notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(
        makeNotification({ userId: 'other-user' }),
      );

      await expect(service.deleteNotification('notif-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('createTemplate', () => {
    it('should create template', async () => {
      const dto = {
        code: 'incident_created',
        name: 'Incident Created',
        subject: 'New Incident',
        body: 'Body text',
        type: NotificationType.INFO,      };
      mockPrisma.notificationTemplate.create.mockResolvedValue(makeTemplate(dto));

      const result = await service.createTemplate(dto);

      expect(mockPrisma.notificationTemplate.create).toHaveBeenCalled();
      expect(result.code).toBe('incident_created');
    });
  });

  describe('getTemplates', () => {
    it('should return all templates', async () => {
      const templates = [makeTemplate(), makeTemplate({ id: 'tmpl-2', code: 'action_overdue' })];
      mockPrisma.notificationTemplate.findMany.mockResolvedValue(templates);

      const result = await service.getTemplates();

      expect(result).toHaveLength(2);
    });

    it('should filter by company including global templates', async () => {
      mockPrisma.notificationTemplate.findMany.mockResolvedValue([]);

      await service.getTemplates('comp-1');

      expect(mockPrisma.notificationTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { OR: [{ companyId: null }, { companyId: 'comp-1' }] },
        }),
      );
    });
  });

  describe('getTemplateById', () => {
    it('should return template', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(makeTemplate());

      const result = await service.getTemplateById('tmpl-1');

      expect(result.id).toBe('tmpl-1');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(null);

      await expect(service.getTemplateById('tmpl-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTemplateByCode', () => {
    it('should return template by code', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(makeTemplate());

      const result = await service.getTemplateByCode('incident_created');

      expect(result.code).toBe('incident_created');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(null);

      await expect(service.getTemplateByCode('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTemplate', () => {
    it('should update template', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(makeTemplate());
      mockPrisma.notificationTemplate.update.mockResolvedValue(
        makeTemplate({ name: 'Updated Name' }),
      );

      const result = await service.updateTemplate('tmpl-1', { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(null);

      await expect(service.updateTemplate('tmpl-999', { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(makeTemplate());
      mockPrisma.notificationTemplate.delete.mockResolvedValue({});

      const result = await service.deleteTemplate('tmpl-1');

      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.notificationTemplate.findUnique.mockResolvedValue(null);

      await expect(service.deleteTemplate('tmpl-999')).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getPreferences', () => {
    it('should return user preferences', async () => {
      const prefs = [makePreference(), makePreference({ id: 'pref-2', eventType: 'overdue' })];
      mockPrisma.notificationPreference.findMany.mockResolvedValue(prefs);

      const result = await service.getPreferences('user-1', 'comp-1');

      expect(result).toHaveLength(2);
    });
  });

  describe('upsertPreference', () => {
    it('should upsert preference', async () => {
      const pref = makePreference({ inAppEnabled: false });
      mockPrisma.notificationPreference.upsert.mockResolvedValue(pref);

      const result = await service.upsertPreference(
        'user-1',
        'incident-basic',
        'created',
        { inAppEnabled: false },
        'comp-1',
      );

      expect(result.inAppEnabled).toBe(false);
      expect(mockPrisma.notificationPreference.upsert).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getLogs', () => {
    it('should return notification logs', async () => {
      const logs = [makeLog(), makeLog({ id: 'log-2', status: 'failed' })];
      mockPrisma.notificationLog.findMany.mockResolvedValue(logs);

      const result = await service.getLogs('notif-1');

      expect(result).toHaveLength(2);
    });
  });

  describe('createLog', () => {
    it('should create a log entry', async () => {
      mockPrisma.notificationLog.create.mockResolvedValue(makeLog());

      const result = await service.createLog('notif-1', 'email', 'user@example.com');

      expect(mockPrisma.notificationLog.create).toHaveBeenCalledWith({
        data: {
          notificationId: 'notif-1',
          channel: 'email',
          recipient: 'user@example.com',
          status: 'pending',
        },
      });
    });
  });

  describe('updateLogStatus', () => {
    it('should update log status to sent', async () => {
      mockPrisma.notificationLog.update.mockResolvedValue(makeLog({ status: 'sent' }));

      await service.updateLogStatus('log-1', 'sent');

      expect(mockPrisma.notificationLog.update).toHaveBeenCalledWith({
        where: { id: 'log-1' },
        data: { status: 'sent', errorMessage: undefined, sentAt: expect.any(Date) },
      });
    });

    it('should update log status to failed with error', async () => {
      mockPrisma.notificationLog.update.mockResolvedValue(
        makeLog({ status: 'failed', errorMessage: 'SMTP error' }),
      );

      await service.updateLogStatus('log-1', 'failed', 'SMTP error');

      expect(mockPrisma.notificationLog.update).toHaveBeenCalledWith({
        where: { id: 'log-1' },
        data: { status: 'failed', errorMessage: 'SMTP error' },
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BULK NOTIFICATION
  // ═══════════════════════════════════════════════════════════════════════════

  describe('sendBulkNotification', () => {
    it('should create bulk notifications', async () => {
      mockPrisma.notification.createMany.mockResolvedValue({ count: 3 });

      const result = await service.sendBulkNotification(
        ['user-1', 'user-2', 'user-3'],
        'alert',
        'Test Alert',
        'Alert message',
        { companyId: 'comp-1' },
      );

      expect(result).toEqual({ created: 3 });
      expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ userId: 'user-1', type: 'alert' }),
        ]),
      });
    });

    it('should use default channel if not specified', async () => {
      mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

      await service.sendBulkNotification(['user-1'], 'info', 'Title', 'Msg');

      expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([expect.objectContaining({ channel: 'in-app' })]),
      });
    });
  });
});
