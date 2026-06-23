import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CompaniesModule } from './companies/companies.module';
import { OrganizationModule } from './organization/organization.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MasterDataModule } from './master-data/master-data.module';
import { ModuleManagementModule } from './modules/module-management.module';
import { WorkflowModule } from './workflows/workflow.module';
import { NotificationModule } from './notifications/notification.module';
import { AttachmentModule } from './attachments/attachment.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ActionTrackingModule } from './action-tracking/action-tracking.module';
import { FormBuilderModule } from './form-builder/form-builder.module';
import { ChecklistModule } from './checklist-builder/checklist.module';
import { NumberingModule } from './numbering/numbering.module';
import { TemplateManagementModule } from './template-management/template.module';
import { ImportExportModule } from './import-export/import-export.module';
import { CalendarScheduleModule } from './calendar-schedule/calendar-schedule.module';
import { ApiKeyModule } from './api-keys/api-key.module';
import { WebhookModule } from './webhooks/webhook.module';
import { DashboardBuilderModule } from './dashboard-builder/dashboard-builder.module';
import { GlobalSearchModule } from './global-search/global-search.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { SsoModule } from './sso/sso.module';
import { MfaModule } from './mfa/mfa.module';
import { AdvancedPermissionModule } from './advanced-permission/advanced-permission.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { BackupRestoreModule } from './backup-restore/backup-restore.module';
import { SystemHealthModule } from './system-health/system-health.module';
import { AiGovernanceModule } from './ai-governance/ai-governance.module';
import { OfflineSyncModule } from './offline-sync/offline-sync.module';
import { IntegrationCenterModule } from './integration-center/integration-center.module';
import { DataRetentionModule } from './data-retention/data-retention.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ReportingModule } from './reporting/reporting.module';
import { IncidentModule } from './incident/incident.module';
import { RiskModule } from './risk/risk.module';
import { AuditInspectionModule } from './audit-inspection/audit-inspection.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ModuleGuard } from './common/guards/module.guard';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }), PrismaModule, AuthModule, HealthModule, CompaniesModule, OrganizationModule, UsersModule, RolesModule, MasterDataModule, ModuleManagementModule, WorkflowModule, NotificationModule, AttachmentModule, AuditLogModule, DashboardModule, ActionTrackingModule, FormBuilderModule, ChecklistModule, NumberingModule, TemplateManagementModule, ImportExportModule, CalendarScheduleModule, ApiKeyModule, WebhookModule, DashboardBuilderModule, GlobalSearchModule, CollaborationModule, SsoModule, MfaModule, AdvancedPermissionModule, SubscriptionModule, BackupRestoreModule, SystemHealthModule, AiGovernanceModule, OfflineSyncModule, IntegrationCenterModule, DataRetentionModule, ComplianceModule, ReportingModule, IncidentModule, RiskModule, AuditInspectionModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: ModuleGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
})
export class AppModule {}
