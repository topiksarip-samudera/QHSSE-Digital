import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export const MODULE_CODE_KEY = 'moduleCode';
export const ModuleRequired = (code: string) => SetMetadata(MODULE_CODE_KEY, code);

const PATH_TO_MODULE: Record<string, string> = {
  companies: 'company', organization: 'organization', users: 'user',
  roles: 'role', 'master-data': 'master-data', modules: 'module-management',
  workflows: 'workflow-engine-basic', notifications: 'notification-basic',
  attachments: 'attachment-evidence-basic', 'audit-logs': 'audit-log-basic',
  actions: 'action-tracking-basic', forms: 'form-builder', checklists: 'checklist-builder',
  'numbering-rules': 'numbering-format-generator', templates: 'template-management',
  imports: 'import-export-center', exports: 'import-export-center',
  schedules: 'calendar-schedule-engine', 'api-keys': 'api-key-management',
  webhooks: 'webhook-management', dashboards: 'dashboard-builder',
  search: 'global-search', records: 'collaboration-comment-thread',
  'sso-providers': 'sso-single-sign-on', mfa: 'mfa-multi-factor-authentication',
  'access-policies': 'advanced-permission', plans: 'subscription-billing-package-management',
  backups: 'backup-restore-ui', 'system-health': 'system-health-monitoring',
  ai: 'ai-governance', sync: 'offline-pwa', integrations: 'advanced-integration-center',
  'retention-policies': 'data-retention-archive-legal-hold',
  'access-reviews': 'compliance-control-center', 'report-templates': 'enterprise-reporting',
  dashboard: 'dashboard-basic', 'import-export': 'import-export-center',
};

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check explicit decorator first
    const explicitCode = this.reflector.get<string>(MODULE_CODE_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const companyId = request.user?.companyId || request.companyId;

    const moduleCode = explicitCode || this.resolveModuleFromPath(request.path);
    if (!moduleCode || !companyId) return true;

    const globalModule = await this.prisma.module.findFirst({ where: { code: moduleCode } });

    if (globalModule && !globalModule.isActive) {
      throw new ForbiddenException(`Module "${moduleCode}" is disabled globally`);
    }

    return true;
  }

  private resolveModuleFromPath(path: string): string | null {
    const match = path.match(/^\/api\/v1\/([^\/]+)/);
    if (!match) return null;
    return PATH_TO_MODULE[match[1]] || null;
  }
}
