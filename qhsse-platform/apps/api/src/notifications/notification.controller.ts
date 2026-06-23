import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  UpdateNotificationPreferenceDto,
  NotificationQueryDto,
} from './dto/create-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ─── Notifications ──────────────────────────────────────────────────────────

  @Get()
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get user notifications' })
  async getNotifications(@Request() req: any, @Query() query: NotificationQueryDto) {
    const userId = req.user.id;
    const companyId = req.user.companyId;
    return this.notificationService.getNotifications(userId, companyId, query);
  }

  @Get('unread-count')
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Request() req: any) {
    return this.notificationService.getUnreadCount(req.user.id, req.user.companyId);
  }

  @Post()
  @RequiredPermissions('notification-basic.create')
  @ApiOperation({ summary: 'Create a notification' })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  @Post(':id/read')
  @RequiredPermissions('notification-basic.view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @RequiredPermissions('notification-basic.view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req: any) {
    return this.notificationService.markAllAsRead(req.user.id, req.user.companyId);
  }

  @Delete(':id')
  @RequiredPermissions('notification-basic.delete')
  @ApiOperation({ summary: 'Delete a notification' })
  async deleteNotification(@Param('id') id: string, @Request() req: any) {
    return this.notificationService.deleteNotification(id, req.user.id);
  }

  // ─── Notification Templates ────────────────────────────────────────────────

  @Get('templates')
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get all notification templates' })
  async getTemplates(@Request() req: any) {
    return this.notificationService.getTemplates(req.user.companyId);
  }

  @Get('templates/:id')
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get template by ID' })
  async getTemplateById(@Param('id') id: string) {
    return this.notificationService.getTemplateById(id);
  }

  @Post('templates')
  @RequiredPermissions('notification-basic.create')
  @ApiOperation({ summary: 'Create a notification template' })
  async createTemplate(@Body() dto: CreateNotificationTemplateDto) {
    return this.notificationService.createTemplate(dto);
  }

  @Patch('templates/:id')
  @RequiredPermissions('notification-basic.update')
  @ApiOperation({ summary: 'Update a notification template' })
  async updateTemplate(@Param('id') id: string, @Body() dto: UpdateNotificationTemplateDto) {
    return this.notificationService.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @RequiredPermissions('notification-basic.delete')
  @ApiOperation({ summary: 'Delete a notification template' })
  async deleteTemplate(@Param('id') id: string) {
    return this.notificationService.deleteTemplate(id);
  }

  // ─── Notification Preferences ──────────────────────────────────────────────

  @Get('preferences')
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get user notification preferences' })
  async getPreferences(@Request() req: any) {
    return this.notificationService.getPreferences(req.user.id, req.user.companyId);
  }

  @Patch('preferences/:moduleCode/:eventType')
  @RequiredPermissions('notification-basic.update')
  @ApiOperation({ summary: 'Update notification preference' })
  async upsertPreference(
    @Param('moduleCode') moduleCode: string,
    @Param('eventType') eventType: string,
    @Body() dto: UpdateNotificationPreferenceDto,
    @Request() req: any,
  ) {
    return this.notificationService.upsertPreference(
      req.user.id,
      moduleCode,
      eventType,
      dto,
      req.user.companyId,
    );
  }

  // ─── Notification Logs ─────────────────────────────────────────────────────

  @Get(':id/logs')
  @RequiredPermissions('notification-basic.view')
  @ApiOperation({ summary: 'Get notification delivery logs' })
  async getLogs(@Param('id') id: string) {
    return this.notificationService.getLogs(id);
  }
}
