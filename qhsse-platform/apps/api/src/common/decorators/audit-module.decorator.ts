import { SetMetadata } from '@nestjs/common';

export const AUDIT_MODULE_KEY = 'auditModule';
export const AuditModule = (moduleName: string) =>
  SetMetadata(AUDIT_MODULE_KEY, moduleName);
