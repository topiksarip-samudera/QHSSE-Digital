// QHSSE Shared Types & Constants
// This package contains shared types, enums, constants, and validation schemas
// used across both frontend (Next.js) and backend (NestJS)

// ─── Status Enum ────────────────────────────────────────────────────────────
export const StatusEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived',
  SUSPENDED: 'suspended',
} as const;

export type Status = (typeof StatusEnum)[keyof typeof StatusEnum];

// ─── Company Size ───────────────────────────────────────────────────────────
export const CompanySizeEnum = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ENTERPRISE: 'enterprise',
} as const;

export type CompanySize = (typeof CompanySizeEnum)[keyof typeof CompanySizeEnum];

// ─── User Roles ─────────────────────────────────────────────────────────────
export const UserRoleEnum = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  SITE_MANAGER: 'site_manager',
  DEPARTMENT_HEAD: 'department_head',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
  CUSTOM: 'custom',
} as const;

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

// ─── API Response Format ────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Query Params ───────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}

// ─── Module Codes ───────────────────────────────────────────────────────────
export const ModuleCodes = {
  RISK_MANAGEMENT: 'risk-management',
  INCIDENT_MANAGEMENT: 'incident-management',
  AUDIT_INSPECTION: 'audit-inspection',
  PERMIT_TO_WORK: 'permit-to-work',
  DOCUMENT_CONTROL: 'document-control',
  TRAINING_COMPETENCY: 'training-competency',
  LEGAL_COMPLIANCE: 'legal-compliance',
  ENVIRONMENT: 'environment',
  QUALITY: 'quality',
  SECURITY: 'security',
  CONTRACTOR_MANAGEMENT: 'contractor-management',
  ACTION_TRACKING: 'action-tracking',
  DASHBOARD: 'dashboard',
} as const;

export type ModuleCode = (typeof ModuleCodes)[keyof typeof ModuleCodes];

// ─── Audit Actions ──────────────────────────────────────────────────────────
export const AuditActions = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  RESTORE: 'restore',
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject',
  CLOSE: 'close',
  EXPORT: 'export',
  IMPORT: 'import',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  PERMISSION_CHANGE: 'permission_change',
  SETTINGS_CHANGE: 'settings_change',
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];

// ─── Notification Types ─────────────────────────────────────────────────────
export const NotificationTypes = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert',
  WORKFLOW: 'workflow',
  ACTION: 'action',
} as const;

export type NotificationType = (typeof NotificationTypes)[keyof typeof NotificationTypes];

// ─── Priority ───────────────────────────────────────────────────────────────
export const PriorityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type Priority = (typeof PriorityEnum)[keyof typeof PriorityEnum];
