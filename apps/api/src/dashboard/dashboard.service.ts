import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getPersonalDashboard(userId: string, companyId: string) {
    const [
      myActions,
      pendingWorkflowSteps,
      unreadNotifications,
      myWorkflowInstances,
      upcomingActions,
      overdueActions,
    ] = await Promise.all([
      this.prisma.action.count({
        where: { assignedTo: userId, companyId, status: { notIn: ['closed', 'cancelled'] } },
      }),
      this.prisma.workflowInstanceStep.findMany({
        where: {
          assignedTo: userId,
          status: { not: 'approved' },
        },
        include: {
          instance: {
            include: { workflow: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
      this.prisma.workflowInstance.count({
        where: {
          submitterId: userId,
          status: { notIn: ['closed', 'cancelled'] },
        },
      }),
      this.prisma.action.count({
        where: {
          assignedTo: userId,
          companyId,
          dueDate: { gte: new Date() },
          status: { notIn: ['closed', 'cancelled'] },
        },
      }),
      this.prisma.action.count({
        where: {
          assignedTo: userId,
          companyId,
          dueDate: { lt: new Date() },
          status: { notIn: ['closed', 'cancelled'] },
        },
      }),
    ]);

    const actionsByPriority = await this.prisma.action.groupBy({
      by: ['priority'],
      where: {
        assignedTo: userId,
        companyId,
        status: { notIn: ['closed', 'cancelled'] },
      },
      _count: { id: true },
    });

    const recentActions = await this.prisma.action.findMany({
      where: { assignedTo: userId, companyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        priority: true,
        status: true,
        dueDate: true,
        createdAt: true,
      },
    });

    return {
      summary: {
        myActions: myActions,
        overdue: overdueActions,
        upcoming: upcomingActions,
        pendingApprovals: pendingWorkflowSteps.length,
        unreadNotifications,
        myWorkflowInstances,
      },
      actionsByPriority: actionsByPriority.map((a) => ({
        priority: a.priority,
        count: a._count.id,
      })),
      pendingApprovalsList: pendingWorkflowSteps.map((step) => ({
        id: step.instanceId,
        workflowName: step.instance?.workflow?.name || 'Unknown',
        status: step.status,
        createdAt: step.createdAt,
      })),
      recentActions,
    };
  }

  async getAdminDashboard(companyId: string) {
    const [
      totalUsers,
      activeUsers,
      totalSites,
      totalDepartments,
      totalCompanies,
      totalActions,
      actionsByStatus,
      recentAuditLogs,
      modulesEnabled,
      totalAttachments,
    ] = await Promise.all([
      this.prisma.userCompanyAssignment.count({ where: { companyId } }),
      this.prisma.user.count({
        where: {
          companyAssignments: { some: { companyId } },
          status: 'active',
        },
      }),
      this.prisma.site.count({ where: { companyId, deletedAt: null } }),
      this.prisma.department.count({ where: { companyId, deletedAt: null } }),
      this.prisma.company.count({ where: { status: 'active' } }),
      this.prisma.action.count({ where: { companyId } }),
      this.prisma.action.groupBy({
        by: ['status'],
        where: { companyId },
        _count: { id: true },
      }),
      this.prisma.auditLog.findMany({
        where: { companyId },
        include: { actor: { select: { email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.tenantModule.count({
        where: { isEnabled: true },
      }),
      this.prisma.attachment.count({
        where: { companyId, deletedAt: null },
      }),
    ]);

    const usersByRole = await this.prisma.userRoleAssignment.groupBy({
      by: ['roleId'],
      where: {
        user: { companyAssignments: { some: { companyId } } },
      },
      _count: { id: true },
    });

    const roles = await this.prisma.role.findMany({
      where: { id: { in: usersByRole.map((u) => u.roleId) } },
      select: { id: true, name: true },
    });

    const usersByRoleMap = usersByRole.map((u) => ({
      roleName: roles.find((r) => r.id === u.roleId)?.name || 'Unknown',
      count: u._count.id,
    }));

    return {
      summary: {
        totalUsers,
        activeUsers,
        totalSites,
        totalDepartments,
        totalCompanies,
        totalActions,
        modulesEnabled,
        totalAttachments,
      },
      actionsByStatus: actionsByStatus.map((a) => ({
        status: a.status,
        count: a._count.id,
      })),
      usersByRole: usersByRoleMap,
      recentAuditLogs: recentAuditLogs.map((log) => ({
        id: log.id,
        module: log.module,
        action: log.action,
        actorEmail: log.actor?.email,
        createdAt: log.createdAt,
      })),
    };
  }

  async getQHSSEDashboard(companyId: string) {
    const [
      totalActions,
      openActions,
      overdueActions,
      actionsByPriority,
      actionsByStatus,
      recentActions,
      notificationsLastWeek,
    ] = await Promise.all([
      this.prisma.action.count({ where: { companyId } }),
      this.prisma.action.count({
        where: { companyId, status: { notIn: ['closed', 'cancelled'] } },
      }),
      this.prisma.action.count({
        where: {
          companyId,
          dueDate: { lt: new Date() },
          status: { notIn: ['closed', 'cancelled'] },
        },
      }),
      this.prisma.action.groupBy({
        by: ['priority'],
        where: { companyId },
        _count: { id: true },
      }),
      this.prisma.action.groupBy({
        by: ['status'],
        where: { companyId },
        _count: { id: true },
      }),
      this.prisma.action.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          dueDate: true,
          createdAt: true,
        },
      }),
      this.prisma.notification.count({
        where: {
          companyId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const completionRate =
      totalActions > 0
        ? Math.round(
            ((actionsByStatus.find((a) => a.status === 'closed')?._count.id || 0) / totalActions) * 100,
          )
        : 0;

    return {
      summary: {
        totalActions,
        openActions,
        overdueActions,
        completionRate,
        notificationsLastWeek,
      },
      actionsByPriority: actionsByPriority.map((a) => ({
        priority: a.priority,
        count: a._count.id,
      })),
      actionsByStatus: actionsByStatus.map((a) => ({
        status: a.status,
        count: a._count.id,
      })),
      recentActions,
    };
  }
}
