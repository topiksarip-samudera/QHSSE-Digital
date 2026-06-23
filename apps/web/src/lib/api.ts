import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach access token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post('/auth/register', data),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken?: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  profile: () => apiClient.get('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),

  getSessions: () => apiClient.get('/auth/sessions'),

  revokeSession: (sessionId: string) =>
    apiClient.delete(`/auth/sessions/${sessionId}`),

  revokeAllSessions: () => apiClient.delete('/auth/sessions'),
};

// ─── Health API ─────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => apiClient.get('/health'),
};

// ─── Companies API ─────────────────────────────────────────────────────────
export interface CompanyQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  industry?: string;
  size?: string;
  tenantId?: string;
}

export interface CompanyData {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  legalName?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenant?: { id: string; name: string; slug: string };
  _count?: {
    sites?: number;
    departments?: number;
    users?: number;
    projects?: number;
    businessUnits?: number;
  };
  settings?: CompanySetting[];
}

export interface CompanySetting {
  id: string;
  companyId: string;
  key: string;
  value: any;
  description?: string;
}

export const companiesApi = {
  list: (query?: CompanyQuery) =>
    apiClient.get('/companies', { params: query }),

  get: (id: string) =>
    apiClient.get(`/companies/${id}`),

  create: (data: Partial<CompanyData> & { tenantId: string; name: string; code: string }) =>
    apiClient.post('/companies', data),

  update: (id: string, data: Partial<CompanyData>) =>
    apiClient.patch(`/companies/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/companies/${id}/status`, { status }),

  delete: (id: string) =>
    apiClient.delete(`/companies/${id}`),

  getSettings: (id: string) =>
    apiClient.get(`/companies/${id}/settings`),

  updateSetting: (id: string, data: { key: string; value: any; description?: string }) =>
    apiClient.patch(`/companies/${id}/settings`, data),

  getStats: (id: string) =>
    apiClient.get(`/companies/${id}/stats`),
};

// ─── Organization Structure APIs ─────────────────────────────────────────
function orgApiFactory(resource: string) {
  return {
    list: (query?: Record<string, any>) =>
      apiClient.get(`/${resource}`, { params: query }),
    get: (id: string) =>
      apiClient.get(`/${resource}/${id}`),
    create: (data: Record<string, any>) =>
      apiClient.post(`/${resource}`, data),
    update: (id: string, data: Record<string, any>) =>
      apiClient.patch(`/${resource}/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/${resource}/${id}`),
  };
}

export const sitesApi = orgApiFactory('sites');
export const departmentsApi = orgApiFactory('departments');
export const locationsApi = orgApiFactory('locations');
export const positionsApi = orgApiFactory('positions');

// ─── Users API ──────────────────────────────────────────────────────────────
export const usersApi = {
  list: (query?: Record<string, any>) =>
    apiClient.get('/users', { params: query }),

  get: (id: string) =>
    apiClient.get(`/users/${id}`),

  create: (data: Record<string, any>) =>
    apiClient.post('/users', data),

  update: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),

  activate: (id: string) =>
    apiClient.post(`/users/${id}/activate`),

  deactivate: (id: string) =>
    apiClient.post(`/users/${id}/deactivate`),

  assignRole: (id: string, data: { roleId: string; companyId?: string; siteId?: string }) =>
    apiClient.post(`/users/${id}/assign-role`, data),

  removeRole: (id: string, roleId: string, companyId?: string, siteId?: string) =>
    apiClient.delete(`/users/${id}/assign-role/${roleId}`, { params: { companyId, siteId } }),

  assignScope: (id: string, data: { companyId: string; siteId?: string; departmentId?: string }) =>
    apiClient.post(`/users/${id}/assign-scope`, data),

  removeScope: (scopeId: string) =>
    apiClient.delete(`/users/scopes/${scopeId}`),

  getLoginHistory: (id: string, page?: number, pageSize?: number) =>
    apiClient.get(`/users/${id}/login-history`, { params: { page, pageSize } }),

  resetPassword: (id: string, newPassword: string) =>
    apiClient.post(`/users/${id}/reset-password`, { newPassword }),
};

// ─── Roles API ─────────────────────────────────────────────────────────────
export interface RoleQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  companyId?: string;
  includeSystem?: boolean;
}

export interface RoleData {
  id: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  companyId?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    permissions?: number;
    userRoles?: number;
  };
}

export interface PermissionData {
  id: string;
  module: string;
  action: string;
  description?: string;
  createdAt: string;
}

export const rolesApi = {
  list: (query?: RoleQuery) =>
    apiClient.get('/roles', { params: query }),

  get: (id: string) =>
    apiClient.get(`/roles/${id}`),

  create: (data: Record<string, any>) =>
    apiClient.post('/roles', data),

  update: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/roles/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/roles/${id}`),

  getPermissions: (id: string) =>
    apiClient.get(`/roles/${id}/permissions`),

  setPermissions: (id: string, permissionIds: string[]) =>
    apiClient.post(`/roles/${id}/permissions`, { permissionIds }),

  addPermissions: (id: string, permissionIds: string[]) =>
    apiClient.post(`/roles/${id}/permissions/add`, { permissionIds }),

  removePermission: (roleId: string, permissionId: string) =>
    apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`),
};

// ─── Permissions API ───────────────────────────────────────────────────────
export const permissionsApi = {
  list: () => apiClient.get('/roles/permissions'),

  matrix: () => apiClient.get('/roles/permissions/matrix'),
};

// ─── Master Data API ───────────────────────────────────────────────────────
export interface MasterDataGroupQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  companyId?: string;
}

export interface MasterDataItemQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  groupId?: string;
  companyId?: string;
}

export const masterDataApi = {
  // Groups
  listGroups: (query?: MasterDataGroupQuery) =>
    apiClient.get('/master-data/groups', { params: query }),

  getGroup: (id: string) =>
    apiClient.get(`/master-data/groups/${id}`),

  createGroup: (data: Record<string, any>) =>
    apiClient.post('/master-data/groups', data),

  updateGroup: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/master-data/groups/${id}`, data),

  deleteGroup: (id: string) =>
    apiClient.delete(`/master-data/groups/${id}`),

  // Items
  listItems: (query?: MasterDataItemQuery) =>
    apiClient.get('/master-data/items', { params: query }),

  getItem: (id: string) =>
    apiClient.get(`/master-data/items/${id}`),

  createItem: (data: Record<string, any>) =>
    apiClient.post('/master-data/items', data),

  updateItem: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/master-data/items/${id}`, data),

  deleteItem: (id: string) =>
    apiClient.delete(`/master-data/items/${id}`),

  restoreItem: (id: string) =>
    apiClient.post(`/master-data/items/${id}/restore`),

  // Export
  exportItems: (groupId?: string, companyId?: string) =>
    apiClient.get('/master-data/export', { params: { groupId, companyId } }),
};

// ─── Module Management APIs ────────────────────────────────────────────

export interface ModuleData {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  features?: ModuleFeatureData[];
  tenantModules?: TenantModuleData[];
  _count?: { tenantModules: number };
}

export interface ModuleFeatureData {
  id: string;
  moduleId: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  isEnabled?: boolean;
  config?: any;
}

export interface TenantModuleData {
  id: string;
  tenantId: string;
  moduleId: string;
  isEnabled: boolean;
  config?: any;
  enabledAt: string;
  disabledAt?: string;
  module?: ModuleData;
  tenant?: { id: string; name: string };
}

export interface RoleModuleAccessData {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  moduleIcon?: string;
  canAccess: boolean;
}

export interface ModuleQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const moduleManagementApi = {
  // Modules
  listModules: (query?: ModuleQuery) =>
    apiClient.get('/modules', { params: query }),

  getModule: (id: string) =>
    apiClient.get(`/modules/${id}`),

  getModuleByCode: (code: string) =>
    apiClient.get(`/modules/code/${code}`),

  createModule: (data: { name: string; code: string; description?: string; icon?: string; sortOrder?: number }) =>
    apiClient.post('/modules', data),

  updateModule: (id: string, data: { name?: string; description?: string; icon?: string; sortOrder?: number; isActive?: boolean }) =>
    apiClient.patch(`/modules/${id}`, data),

  deleteModule: (id: string) =>
    apiClient.delete(`/modules/${id}`),

  // Features
  createFeature: (moduleId: string, data: { name: string; code: string; description?: string }) =>
    apiClient.post(`/modules/${moduleId}/features`, data),

  updateFeature: (featureId: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    apiClient.patch(`/modules/features/${featureId}`, data),

  deleteFeature: (featureId: string) =>
    apiClient.delete(`/modules/features/${featureId}`),

  // Tenant modules
  getTenantModules: (tenantId: string) =>
    apiClient.get(`/modules/tenant/${tenantId}`),

  toggleTenantModule: (tenantId: string, moduleId: string, isEnabled: boolean, config?: any) =>
    apiClient.patch(`/modules/tenant/${tenantId}/${moduleId}`, { isEnabled, config }),

  bulkToggleModules: (tenantId: string, moduleIds: string[], isEnabled: boolean) =>
    apiClient.post(`/modules/tenant/${tenantId}/bulk-toggle`, { moduleIds, isEnabled }),

  // Tenant feature flags
  toggleTenantFeature: (tenantId: string, featureId: string, isEnabled: boolean, config?: any) =>
    apiClient.patch(`/modules/tenant/${tenantId}/features/${featureId}`, { isEnabled, config }),

  // Role module access
  getRoleModuleAccess: (tenantId: string, roleId: string) =>
    apiClient.get(`/modules/access/${tenantId}/role/${roleId}`),

  setRoleModuleAccess: (tenantId: string, roleId: string, moduleId: string, canAccess: boolean) =>
    apiClient.patch(`/modules/access/${tenantId}/role/${roleId}/${moduleId}`, { canAccess }),
};

// ─── Workflow Engine ────────────────────────────────────────────────────

export interface WorkflowStepData {
  id: string;
  workflowId: string;
  name: string;
  stepOrder: number;
  assigneeType: string;
  assigneeValue: string;
  actionType: string;
  isRequired: boolean;
  slaHours?: number;
  escalateAfterHr?: number;
  approvers?: { id: string; stepId: string; userId: string }[];
}

export interface WorkflowData {
  id: string;
  companyId?: string;
  moduleCode: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  steps: WorkflowStepData[];
  _count?: { instances: number };
}

export interface WorkflowInstanceStepData {
  id: string;
  instanceId: string;
  stepId: string;
  stepOrder: number;
  assigneeType: string;
  assigneeValue: string;
  status: string;
  completedBy?: string;
  completedAt?: string;
  comment?: string;
  dueAt?: string;
}

export interface WorkflowInstanceData {
  id: string;
  workflowId: string;
  companyId?: string;
  recordType: string;
  recordId: string;
  submitterId: string;
  currentStep: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  workflow?: WorkflowData;
  steps?: WorkflowInstanceStepData[];
  histories?: WorkflowHistoryData[];
}

export interface WorkflowHistoryData {
  id: string;
  instanceId: string;
  stepOrder: number;
  action: string;
  comment?: string;
  performedBy: string;
  performedAt?: string;
  createdAt: string;
}

export interface WorkflowQuery {
  search?: string;
  status?: string;
  moduleCode?: string;
  page?: number;
  limit?: number;
}

export const workflowApi = {
  // Workflow Templates
  list: (query?: WorkflowQuery) =>
    apiClient.get('/workflows', { params: query }),

  get: (id: string) =>
    apiClient.get(`/workflows/${id}`),

  create: (data: { name: string; moduleCode: string; description?: string; isActive?: boolean }) =>
    apiClient.post('/workflows', data),

  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    apiClient.patch(`/workflows/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/workflows/${id}`),

  // Steps
  addStep: (workflowId: string, data: { name: string; stepOrder: number; assigneeType: string; assigneeValue: string; actionType: string; isRequired?: boolean; slaHours?: number; escalateAfterHr?: number }) =>
    apiClient.post(`/workflows/${workflowId}/steps`, data),

  updateStep: (stepId: string, data: { name?: string; stepOrder?: number; assigneeType?: string; assigneeValue?: string; actionType?: string; isRequired?: boolean; slaHours?: number }) =>
    apiClient.patch(`/workflows/steps/${stepId}`, data),

  removeStep: (stepId: string) =>
    apiClient.delete(`/workflows/steps/${stepId}`),

  // Approvers
  addApprover: (stepId: string, userId: string) =>
    apiClient.post(`/workflows/steps/${stepId}/approvers`, { userId }),

  removeApprover: (stepId: string, userId: string) =>
    apiClient.delete(`/workflows/steps/${stepId}/approvers/${userId}`),

  // Instances
  createInstance: (data: { workflowId: string; recordType: string; recordId: string }) =>
    apiClient.post('/workflows/instances', data),

  listInstances: (query?: WorkflowQuery) =>
    apiClient.get('/workflows/instances/list', { params: query }),

  getInstance: (id: string) =>
    apiClient.get(`/workflows/instances/${id}`),

  // Actions
  submitInstance: (id: string, comment?: string) =>
    apiClient.post(`/workflows/instances/${id}/submit`, { comment }),

  approveStep: (id: string, comment?: string) =>
    apiClient.post(`/workflows/instances/${id}/approve`, { comment }),

  rejectStep: (id: string, comment: string) =>
    apiClient.post(`/workflows/instances/${id}/reject`, { comment }),

  requestRevision: (id: string, comment: string) =>
    apiClient.post(`/workflows/instances/${id}/request-revision`, { comment }),

  closeInstance: (id: string) =>
    apiClient.post(`/workflows/instances/${id}/close`),

  // History & SLA
  getInstanceHistory: (id: string) =>
    apiClient.get(`/workflows/instances/${id}/history`),

  getSlaBreaches: () =>
    apiClient.get('/workflows/sla/breaches'),
};

// ─── Notification Types ────────────────────────────────────────────────────

export interface NotificationData {
  id: string;
  userId: string;
  companyId?: string;
  templateId?: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
  channel: string;
  isRead: boolean;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
  template?: { code: string; name: string };
}

export interface NotificationTemplateData {
  id: string;
  companyId?: string;
  code: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  channel: string;
  isActive: boolean;
  variables?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferenceData {
  id: string;
  userId: string;
  companyId?: string;
  moduleCode: string;
  eventType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

export interface NotificationLogData {
  id: string;
  notificationId: string;
  channel: string;
  status: string;
  recipient: string;
  errorMessage?: string;
  sentAt?: string;
  createdAt: string;
}

export interface NotificationQuery {
  type?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

// ─── Notification API ──────────────────────────────────────────────────────

export const notificationApi = {
  // Notifications
  getNotifications: (query?: NotificationQuery) =>
    apiClient.get('/notifications', { params: query }),

  getUnreadCount: () =>
    apiClient.get('/notifications/unread-count'),

  createNotification: (data: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    link?: string;
    channel?: string;
    companyId?: string;
    templateId?: string;
  }) => apiClient.post('/notifications', data),

  markAsRead: (id: string) =>
    apiClient.post(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.post('/notifications/read-all'),

  deleteNotification: (id: string) =>
    apiClient.delete(`/notifications/${id}`),

  // Templates
  getTemplates: () =>
    apiClient.get('/notifications/templates'),

  getTemplateById: (id: string) =>
    apiClient.get(`/notifications/templates/${id}`),

  createTemplate: (data: {
    code: string;
    name: string;
    subject: string;
    body: string;
    type: string;
    channel?: string;
    isActive?: boolean;
    variables?: Record<string, string>;
    companyId?: string;
  }) => apiClient.post('/notifications/templates', data),

  updateTemplate: (id: string, data: {
    name?: string;
    subject?: string;
    body?: string;
    type?: string;
    channel?: string;
    isActive?: boolean;
    variables?: Record<string, string>;
  }) => apiClient.patch(`/notifications/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    apiClient.delete(`/notifications/templates/${id}`),

  // Preferences
  getPreferences: () =>
    apiClient.get('/notifications/preferences'),

  updatePreference: (moduleCode: string, eventType: string, data: {
    inAppEnabled?: boolean;
    emailEnabled?: boolean;
  }) => apiClient.patch(`/notifications/preferences/${moduleCode}/${eventType}`, data),

  // Logs
  getLogs: (notificationId: string) =>
    apiClient.get(`/notifications/${notificationId}/logs`),
};

// ─── Attachment Types ──────────────────────────────────────────────────────

export interface AttachmentFileData {
  id: string;
  companyId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  bucket: string;
  hash: string | null;
  uploadedBy: string;
  createdAt: string;
}

export interface AttachmentData {
  id: string;
  companyId: string;
  recordType: string;
  recordId: string;
  fileId: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
  deletedAt?: string;
  file?: FileData;
  fileLinks?: FileLinkData[];
}

export interface FileData {
  id: string;
  companyId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  bucket: string;
  hash?: string;
  uploadedBy: string;
  createdAt: string;
  deletedAt?: string;
}

export interface FileLinkData {
  id: string;
  companyId: string;
  attachmentId: string;
  linkedModule: string;
  linkedRecordType: string;
  linkedRecordId: string;
  linkContext?: string;
  createdBy: string;
  createdAt: string;
  deletedAt?: string;
  attachment?: AttachmentData;
}

export interface AttachmentStats {
  totalAttachments: number;
  totalSize: number;
  byType: { recordType: string; count: number }[];
}

export interface AttachmentQuery {
  recordType?: string;
  recordId?: string;
  mimeType?: string;
  page?: number;
  limit?: number;
}

// ─── Attachment API ────────────────────────────────────────────────────────

export const attachmentApi = {
  // Upload
  upload: (file: File, recordType: string, recordId: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recordType', recordType);
    formData.append('recordId', recordId);
    if (description) formData.append('description', description);
    return apiClient.post('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // List all (paginated)
  getAttachments: (query?: AttachmentQuery) =>
    apiClient.get('/attachments', { params: query }),

  // Get by ID
  getAttachment: (id: string) =>
    apiClient.get(`/attachments/${id}`),

  // Get download URL
  getDownloadUrl: (id: string) =>
    `${apiClient.defaults.baseURL}/attachments/${id}/download`,

  // Get attachments for a record
  getByRecord: (recordType: string, recordId: string) =>
    apiClient.get(`/attachments/record/${recordType}/${recordId}`),

  // Update metadata
  updateAttachment: (id: string, data: { description?: string }) =>
    apiClient.patch(`/attachments/${id}`, data),

  // Soft delete
  deleteAttachment: (id: string) =>
    apiClient.delete(`/attachments/${id}`),

  // Bulk delete
  bulkDelete: (ids: string[]) =>
    apiClient.post('/attachments/bulk-delete', { ids }),

  // Restore
  restoreAttachment: (id: string) =>
    apiClient.post(`/attachments/${id}/restore`),

  // Stats
  getStats: () =>
    apiClient.get('/attachments/stats/overview'),

  // File Links
  createFileLink: (data: {
    attachmentId: string;
    linkedModule: string;
    linkedRecordType: string;
    linkedRecordId: string;
    linkContext?: string;
  }) => apiClient.post('/attachments/file-links', data),

  getFileLinksByAttachment: (attachmentId: string) =>
    apiClient.get(`/attachments/${attachmentId}/file-links`),

  getFileLinksByRecord: (linkedModule: string, linkedRecordType: string, linkedRecordId: string) =>
    apiClient.get(`/attachments/file-links/record/${linkedModule}/${linkedRecordType}/${linkedRecordId}`),

  deleteFileLink: (fileLinkId: string) =>
    apiClient.delete(`/attachments/file-links/${fileLinkId}`),

  // Cross-module records
  getAttachmentsByRecord: (module: string, recordType: string, recordId: string) =>
    apiClient.get(`/attachments/records/${module}/${recordType}/${recordId}`),
};

// ─── Audit Log Types ───────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  companyId?: string;
  actorId: string;
  module: string;
  action: string;
  recordType?: string;
  recordId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
  actor?: { id: string; email: string; firstName: string; lastName: string };
}

export interface AuditLogStats {
  total: number;
  byModule: { module: string; count: number }[];
  byAction: { action: string; count: number }[];
  recentActivity: AuditLogEntry[];
}

export interface AuditLogQuery {
  module?: string;
  action?: string;
  actorId?: string;
  recordType?: string;
  recordId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  email: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  createdAt: string;
  user?: { id: string; email: string; firstName: string; lastName: string };
}

export interface LoginHistoryStats {
  total: number;
  success: number;
  failed: number;
  blocked: number;
  recent: LoginHistoryEntry[];
}

// ─── Audit Log API ─────────────────────────────────────────────────────────

export const auditLogApi = {
  getAuditLogs: (query?: AuditLogQuery) =>
    apiClient.get('/audit-logs', { params: query }),

  getAuditLogById: (id: string) =>
    apiClient.get(`/audit-logs/${id}`),

  getStats: () =>
    apiClient.get('/audit-logs/stats'),

  exportAuditLogs: async (query?: AuditLogQuery) => {
    const res = await apiClient.get('/audit-logs/export', {
      params: query,
      responseType: 'blob',
    });
    return res.data;
  },

  getLoginHistory: (query?: { status?: string; email?: string; fromDate?: string; toDate?: string; page?: number; limit?: number }) =>
    apiClient.get('/audit-logs/login-history', { params: query }),

  getLoginHistoryStats: () =>
    apiClient.get('/audit-logs/login-history/stats'),

  getActivityLogs: (query?: any) =>
    apiClient.get('/audit-logs/activity/list', { params: query }),

  createActivityLog: (data: any) =>
    apiClient.post('/audit-logs/activity', data),
};

// ─── Dashboard Types ──────────────────────────────────────────────────────

export interface PersonalDashboard {
  summary: {
    myActions: number;
    overdue: number;
    upcoming: number;
    pendingApprovals: number;
    unreadNotifications: number;
    myWorkflowInstances: number;
  };
  actionsByPriority: { priority: string; count: number }[];
  pendingApprovalsList: { id: string; workflowName: string; status: string; createdAt: string }[];
  recentActions: { id: string; title: string; priority: string; status: string; dueDate?: string; createdAt: string }[];
}

export interface AdminDashboard {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalSites: number;
    totalDepartments: number;
    totalCompanies: number;
    totalActions: number;
    modulesEnabled: number;
    totalAttachments: number;
  };
  actionsByStatus: { status: string; count: number }[];
  usersByRole: { roleName: string; count: number }[];
  recentAuditLogs: { id: string; module: string; action: string; actorEmail?: string; createdAt: string }[];
}

export interface QHSSEDashboard {
  summary: {
    totalActions: number;
    openActions: number;
    overdueActions: number;
    completionRate: number;
    notificationsLastWeek: number;
  };
  actionsByPriority: { priority: string; count: number }[];
  actionsByStatus: { status: string; count: number }[];
  recentActions: { id: string; title: string; priority: string; status: string; dueDate?: string; createdAt: string }[];
}

// ─── Dashboard API ────────────────────────────────────────────────────────

export const dashboardApi = {
  getPersonal: () => apiClient.get('/dashboard/personal'),
  getAdmin: () => apiClient.get('/dashboard/admin'),
  getQHSSE: () => apiClient.get('/dashboard/qhsse'),
};

// ─── Action Tracking Types ────────────────────────────────────────────────

export interface ActionData {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  sourceType?: string;
  sourceId?: string;
  priority: string;
  dueDate?: string;
  assignedTo: string;
  createdBy: string;
  status: string;
  completedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  assignee?: { id: string; email: string; firstName: string; lastName: string };
  creator?: { id: string; email: string; firstName: string; lastName: string };
  comments?: any[];
  evidences?: any[];
  verifications?: any[];
  histories?: any[];
  _count?: { comments: number; evidences: number; verifications: number };
}

export interface ActionQuery {
  status?: string;
  priority?: string;
  assignedTo?: string;
  sourceType?: string;
  overdue?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateActionDto {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: string;
  dueDate?: string;
  sourceType?: string;
  sourceId?: string;
}

export interface UpdateActionDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
}

// ─── Action Tracking API ──────────────────────────────────────────────────

export const actionApi = {
  createAction: (data: CreateActionDto) =>
    apiClient.post('/actions', data),

  getActions: (query?: ActionQuery) =>
    apiClient.get('/actions', { params: query }),

  getAction: (id: string) =>
    apiClient.get(`/actions/${id}`),

  updateAction: (id: string, data: UpdateActionDto) =>
    apiClient.patch(`/actions/${id}`, data),

  deleteAction: (id: string) =>
    apiClient.delete(`/actions/${id}`),

  addComment: (id: string, data: { content: string }) =>
    apiClient.post(`/actions/${id}/comment`, data),

  addEvidence: (actionId: string, attachmentId: string, description?: string) =>
    apiClient.post(`/actions/${actionId}/evidence/${attachmentId}`, { description }),

  removeEvidence: (actionId: string, evidenceId: string) =>
    apiClient.delete(`/actions/${actionId}/evidence/${evidenceId}`),

  submitForVerification: (id: string) =>
    apiClient.post(`/actions/${id}/submit-verification`),

  verify: (id: string, data?: { notes?: string }) =>
    apiClient.post(`/actions/${id}/verify`, data || {}),

  rejectVerification: (id: string, data?: { notes?: string }) =>
    apiClient.post(`/actions/${id}/reject`, data || {}),
};

// ─── Form Builder Types ──────────────────────────────────────────────────

export interface FormData {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  status: string;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sections?: any[];
  versions?: any[];
  _count?: { sections: number; submissions: number };
}

export interface FormQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Form Builder API ────────────────────────────────────────────────────

export const formApi = {
  createForm: (data: { name: string; description?: string; sections?: any[] }) =>
    apiClient.post('/forms', data),

  getForms: (query?: FormQuery) =>
    apiClient.get('/forms', { params: query }),

  getForm: (id: string) =>
    apiClient.get(`/forms/${id}`),

  updateForm: (id: string, data: any) =>
    apiClient.patch(`/forms/${id}`, data),

  deleteForm: (id: string) =>
    apiClient.delete(`/forms/${id}`),

  publishForm: (id: string) =>
    apiClient.post(`/forms/${id}/publish`),

  cloneForm: (id: string) =>
    apiClient.post(`/forms/${id}/clone`),

  submitForm: (data: { formVersionId: string; values: Record<string, any> }) =>
    apiClient.post('/forms/submissions', data),

  getSubmissions: (formId: string, page?: number, limit?: number) =>
    apiClient.get(`/forms/${formId}/submissions`, { params: { page, limit } }),

  getSubmissionDetail: (submissionId: string) =>
    apiClient.get(`/forms/submissions/${submissionId}`),
};

// ─── Checklist Builder Types ─────────────────────────────────────────────

export interface ChecklistData {
  id: string; companyId: string; name: string; description?: string; status: string; version: number;
  passScore?: number; maxScore?: number; createdBy: string; createdAt: string; updatedAt: string;
  sections?: any[]; versions?: any[]; _count?: { sections: number; responses: number };
}

// ─── Checklist Builder API ────────────────────────────────────────────────

export const checklistApi = {
  createChecklist: (data: any) => apiClient.post('/checklists', data),
  getChecklists: (query?: any) => apiClient.get('/checklists', { params: query }),
  getChecklist: (id: string) => apiClient.get(`/checklists/${id}`),
  updateChecklist: (id: string, data: any) => apiClient.patch(`/checklists/${id}`, data),
  deleteChecklist: (id: string) => apiClient.delete(`/checklists/${id}`),
  publishChecklist: (id: string) => apiClient.post(`/checklists/${id}/publish`),
  submitResponse: (data: any) => apiClient.post('/checklists/responses', data),
  getResponses: (checklistId: string, page?: number, limit?: number) => apiClient.get(`/checklists/${checklistId}/responses`, { params: { page, limit } }),
  getResponseDetail: (responseId: string) => apiClient.get(`/checklists/responses/${responseId}`),
};

// ─── Advanced Workflow API ───────────────────────────────────────────────

export const advancedWorkflowApi = {
  simulate: (workflowId: string, recordData?: any) =>
    apiClient.post(`/workflows/${workflowId}/simulate`, { recordData }),

  addCondition: (workflowId: string, stepId: string, data: any) =>
    apiClient.post(`/workflows/${workflowId}/steps/${stepId}/conditions`, data),

  getConditions: (workflowId: string, stepId: string) =>
    apiClient.get(`/workflows/${workflowId}/steps/${stepId}/conditions`),

  deleteCondition: (workflowId: string, conditionId: string) =>
    apiClient.delete(`/workflows/${workflowId}/conditions/${conditionId}`),

  createEscalation: (data: any) =>
    apiClient.post('/workflows/escalations', data),

  getEscalations: (workflowId: string) =>
    apiClient.get('/workflows/escalations', { params: { workflowId } }),

  deleteEscalation: (id: string) =>
    apiClient.delete(`/workflows/escalations/${id}`),

  createDelegation: (data: any) =>
    apiClient.post('/workflows/delegations', data),

  getDelegations: () =>
    apiClient.get('/workflows/delegations'),

  revokeDelegation: (id: string) =>
    apiClient.delete(`/workflows/delegations/${id}`),

  createSlaRule: (data: any) =>
    apiClient.post('/workflows/sla-rules', data),

  getSlaRules: (workflowId: string) =>
    apiClient.get('/workflows/sla-rules', { params: { workflowId } }),

  deleteSlaRule: (id: string) =>
    apiClient.delete(`/workflows/sla-rules/${id}`),
};

// ─── Numbering Types ─────────────────────────────────────────────────────

export interface NumberingRule {
  id: string; companyId: string; name: string; moduleCode: string;
  prefix: string; suffix: string; digitCount: number; connector: string;
  resetBy?: string; sample?: string; isActive: boolean; nextNumber: number;
  counters?: { id: string; counter: number }[];
  histories?: any[];
}

export const numberingApi = {
  createRule: (data: any) => apiClient.post('/numbering-rules', data),
  getRules: (query?: any) => apiClient.get('/numbering-rules', { params: query }),
  getRule: (id: string) => apiClient.get(`/numbering-rules/${id}`),
  updateRule: (id: string, data: any) => apiClient.patch(`/numbering-rules/${id}`, data),
  deleteRule: (id: string) => apiClient.delete(`/numbering-rules/${id}`),
  preview: (id: string) => apiClient.post(`/numbering-rules/${id}/preview`),
  generate: (id: string, data: { recordType: string; recordId: string }) => apiClient.post(`/numbering-rules/${id}/generate`, data),
  resetCounter: (counterId: string, ruleId: string) => apiClient.post(`/numbering-rules/counters/${counterId}/reset`, { ruleId }),
};

// ─── Template Management Types ───────────────────────────────────────────

export interface TemplateData {
  id: string; name: string; description?: string; type: string; status: string;
  version: number; isGlobal: boolean; content?: any; category?: { name: string };
  versions?: any[]; assignments?: any[];
}

export const templateApi = {
  createTemplate: (data: any) => apiClient.post('/templates', data),
  getTemplates: (query?: any) => apiClient.get('/templates', { params: query }),
  getTemplate: (id: string) => apiClient.get(`/templates/${id}`),
  updateTemplate: (id: string, data: any) => apiClient.patch(`/templates/${id}`, data),
  deleteTemplate: (id: string) => apiClient.delete(`/templates/${id}`),
  publishTemplate: (id: string) => apiClient.post(`/templates/${id}/publish`),
  cloneTemplate: (id: string) => apiClient.post(`/templates/${id}/clone`),
  createCategory: (data: any) => apiClient.post('/templates/categories', data),
  getCategories: () => apiClient.get('/templates/categories/list'),
  createAssignment: (data: any) => apiClient.post('/templates/assignments', data),
  getAssignments: (templateId: string) => apiClient.get(`/templates/${templateId}/assignments`),
  deleteAssignment: (assignmentId: string) => apiClient.delete(`/templates/assignments/${assignmentId}`),
};

// ─── Import & Export API ─────────────────────────────────────────────────

export const importExportApi = {
  uploadImport: (file: File, moduleCode: string) => { const fd = new FormData(); fd.append('file', file); fd.append('moduleCode', moduleCode); return apiClient.post('/imports', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getImportPreview: (id: string) => apiClient.get(`/imports/${id}/preview`),
  commitImport: (id: string) => apiClient.post(`/imports/${id}/commit`),
  getImports: (query?: any) => apiClient.get('/imports', { params: query }),
  createExport: (data: any) => apiClient.post('/exports', data),
  getExports: (query?: any) => apiClient.get('/exports', { params: query }),
};

// ─── Calendar Types ──────────────────────────────────────────────────────

export interface ScheduleData {
  id: string; name: string; description?: string; type: string; status: string; priority: string;
  startDate: string; endDate?: string; recurrence?: { frequency: string; interval: number };
  occurrences?: any[]; reminders?: any[];
}

export const calendarApi = {
  createSchedule: (data: any) => apiClient.post('/schedules', data),
  getSchedules: (query?: any) => apiClient.get('/schedules', { params: query }),
  getSchedule: (id: string) => apiClient.get(`/schedules/${id}`),
  updateSchedule: (id: string, data: any) => apiClient.patch(`/schedules/${id}`, data),
  deleteSchedule: (id: string) => apiClient.delete(`/schedules/${id}`),
  generateOccurrences: (id: string) => apiClient.post(`/schedules/${id}/generate-occurrences`),
  getOccurrences: (query?: { fromDate?: string; toDate?: string }) => apiClient.get('/schedule-occurrences', { params: query }),
};

// ─── API Key Types ───────────────────────────────────────────────────────

export interface ApiKeyData {
  id: string; name: string; keyPrefix: string; status: string; expiresAt?: string;
  scopes?: { resource: string }[]; rateLimit?: { maxRequests: number; windowSec: number };
}

export const apiKeyApi = {
  createKey: (data: any) => apiClient.post('/api-keys', data),
  getKeys: (query?: any) => apiClient.get('/api-keys', { params: query }),
  getKey: (id: string) => apiClient.get(`/api-keys/${id}`),
  revokeKey: (id: string) => apiClient.post(`/api-keys/${id}/revoke`),
  rotateKey: (id: string) => apiClient.post(`/api-keys/${id}/rotate`),
  getUsage: (id: string) => apiClient.get(`/api-keys/${id}/usage`),
};

// ─── Webhook Types ───────────────────────────────────────────────────────

export interface WebhookData { id: string; name: string; url: string; isActive: boolean; events?: any[]; _count?: { logs: number }; }

export const webhookApi = {
  createWebhook: (d: any) => apiClient.post('/webhooks', d),
  getWebhooks: (q?: any) => apiClient.get('/webhooks', { params: q }),
  getWebhook: (id: string) => apiClient.get(`/webhooks/${id}`),
  updateWebhook: (id: string, d: any) => apiClient.patch(`/webhooks/${id}`, d),
  deleteWebhook: (id: string) => apiClient.delete(`/webhooks/${id}`),
  testWebhook: (id: string) => apiClient.post(`/webhooks/${id}/test`),
  getLogs: (id: string) => apiClient.get(`/webhooks/${id}/logs`),
};

// ─── Dashboard Builder Types ─────────────────────────────────────────────

export interface DashboardData { id: string; name: string; description?: string; scope: string; layout?: any; widgets?: any[]; _count?: { widgets: number }; isDefault?: boolean; }

export const dashboardBuilderApi = {
  createDashboard: (d: any) => apiClient.post('/dashboards', d),
  getDashboards: (q?: any) => apiClient.get('/dashboards', { params: q }),
  getDashboard: (id: string) => apiClient.get(`/dashboards/${id}`),
  updateDashboard: (id: string, d: any) => apiClient.patch(`/dashboards/${id}`, d),
  deleteDashboard: (id: string) => apiClient.delete(`/dashboards/${id}`),
  addWidget: (dashboardId: string, d: any) => apiClient.post(`/dashboards/${dashboardId}/widgets`, d),
  updateWidget: (dashboardId: string, widgetId: string, d: any) => apiClient.patch(`/dashboards/${dashboardId}/widgets/${widgetId}`, d),
  deleteWidget: (dashboardId: string, widgetId: string) => apiClient.delete(`/dashboards/${dashboardId}/widgets/${widgetId}`),
  updateLayout: (id: string, layout: any) => apiClient.patch(`/dashboards/${id}/layout`, layout),
};

// ─── Global Search API ───────────────────────────────────────────────────

export const globalSearchApi = {
  search: (dto: { query: string; module?: string; fromDate?: string; toDate?: string }) => apiClient.get('/search', { params: dto }),
  saveSearch: (d: { name: string; query: string; filters?: any }) => apiClient.post('/saved-searches', d),
  getSaved: (q?: any) => apiClient.get('/saved-searches', { params: q }),
  deleteSaved: (id: string) => apiClient.delete(`/saved-searches/${id}`),
  getRecent: () => apiClient.get('/recent-searches'),
};

// ─── Collaboration API ───────────────────────────────────────────────────

export const collaborationApi = {
  getComments: (module: string, recordType: string, recordId: string, query?: any) =>
    apiClient.get(`/records/${module}/${recordType}/${recordId}/comments`, { params: query }),
  addComment: (module: string, recordType: string, recordId: string, data: any) =>
    apiClient.post(`/records/${module}/${recordType}/${recordId}/comments`, data),
  deleteComment: (module: string, recordType: string, recordId: string, commentId: string) =>
    apiClient.delete(`/records/${module}/${recordType}/${recordId}/comments/${commentId}`),
};

// ─── SSO Types ───────────────────────────────────────────────────────────

export interface SsoProviderData { id: string; name: string; provider: string; isActive: boolean; mappings?: any[]; _count?: { logs: number }; }

export const ssoApi = {
  createProvider: (d: any) => apiClient.post('/sso-providers', d),
  getProviders: (q?: any) => apiClient.get('/sso-providers', { params: q }),
  getProvider: (id: string) => apiClient.get(`/sso-providers/${id}`),
  updateProvider: (id: string, d: any) => apiClient.patch(`/sso-providers/${id}`, d),
  deleteProvider: (id: string) => apiClient.delete(`/sso-providers/${id}`),
  testProvider: (id: string) => apiClient.post(`/sso-providers/${id}/test`),
  getLoginLogs: () => apiClient.get('/sso-login-logs'),
};

// ─── MFA API ─────────────────────────────────────────────────────────────

export const mfaApi = {
  getStatus: () => apiClient.get('/mfa/status'),
  setup: (d: { method: string }) => apiClient.post('/mfa/setup', d),
  verify: (d: { code: string; method: string }) => apiClient.post('/mfa/verify', d),
  disable: (d: { password: string }) => apiClient.post('/mfa/disable', d),
  getRecoveryCodes: () => apiClient.get('/mfa/recovery-codes'),
  adminReset: (userId: string) => apiClient.post(`/admin/users/${userId}/reset-mfa`),
  getSettings: () => apiClient.get('/mfa/settings'),
  updateSettings: (d: any) => apiClient.post('/mfa/settings', d),
};

// ─── Advanced Permission API ─────────────────────────────────────────────

export const advancedPermissionApi = {
  createPolicy: (d: any) => apiClient.post('/access-policies', d),
  getPolicies: (q?: any) => apiClient.get('/access-policies', { params: q }),
  updatePolicy: (id: string, d: any) => apiClient.patch(`/access-policies/${id}`, d),
  deletePolicy: (id: string) => apiClient.delete(`/access-policies/${id}`),
  simulate: (d: any) => apiClient.post('/permission-simulator', d),
  createTempAccess: (d: any) => apiClient.post('/temporary-access', d),
  getTempAccess: () => apiClient.get('/temporary-access'),
  revokeTempAccess: (id: string) => apiClient.delete(`/temporary-access/${id}`),
  getDataMasking: () => apiClient.get('/data-masking'),
  createDataMasking: (d: any) => apiClient.post('/data-masking', d),
};

// ─── Subscription & Billing API ──────────────────────────────────────────

export const subscriptionApi = {
  createPlan: (d: any) => apiClient.post('/plans', d),
  getPlans: (q?: any) => apiClient.get('/plans', { params: q }),
  getPlan: (id: string) => apiClient.get(`/plans/${id}`),
  updatePlan: (id: string, d: any) => apiClient.patch(`/plans/${id}`, d),
  deletePlan: (id: string) => apiClient.delete(`/plans/${id}`),
  getSubscription: (companyId: string) => apiClient.get(`/subscriptions/${companyId}`),
  updateSubscription: (companyId: string, d: any) => apiClient.patch(`/subscriptions/${companyId}`, d),
  getUsage: () => apiClient.get('/billing/usage'),
  getInvoices: () => apiClient.get('/invoices'),
};

// ─── Backup & Restore API ────────────────────────────────────────────────

export const backupApi = {
  createBackup: (d?: any) => apiClient.post('/backups', d || {}),
  getBackups: (q?: any) => apiClient.get('/backups', { params: q }),
  getSchedules: () => apiClient.get('/backups/schedules'),
  createSchedule: (d: any) => apiClient.post('/backups/schedules', d),
  updateSchedule: (id: string, d: any) => apiClient.patch(`/backups/schedules/${id}`, d),
  deleteSchedule: (id: string) => apiClient.delete(`/backups/schedules/${id}`),
  requestRestore: (d: any) => apiClient.post('/backups/restore-requests', d),
  getRestoreRequests: () => apiClient.get('/backups/restore-requests'),
  approveRestore: (id: string) => apiClient.post(`/backups/restore-requests/${id}/approve`),
  rejectRestore: (id: string) => apiClient.post(`/backups/restore-requests/${id}/reject`),
};

// ─── System Health API ─────────────────────────────────────────────────────

export const systemHealthApi = {
  getHealth: () => apiClient.get('/system-health'),
  getErrors: (q?: any) => apiClient.get('/system-health/errors', { params: q }),
  getAlertRules: () => apiClient.get('/system-health/alert-rules'),
  createAlertRule: (d: any) => apiClient.post('/system-health/alert-rules', d),
  deleteAlertRule: (id: string) => apiClient.delete(`/system-health/alert-rules/${id}`),
  getAlerts: () => apiClient.get('/system-health/alerts'),
  acknowledgeAlert: (id: string) => apiClient.post(`/system-health/alerts/${id}/acknowledge`),
};

// ─── AI Governance API ───────────────────────────────────────────────────

export const aiGovernanceApi = {
  getSettings: () => apiClient.get('/ai/settings'),
  updateSettings: (d: any) => apiClient.patch('/ai/settings', d),
  createPromptTemplate: (d: any) => apiClient.post('/ai/prompt-templates', d),
  getPromptTemplates: (module?: string) => apiClient.get('/ai/prompt-templates', { params: module ? { module } : {} }),
  deletePromptTemplate: (id: string) => apiClient.delete(`/ai/prompt-templates/${id}`),
  createKnowledgeSource: (d: any) => apiClient.post('/ai/knowledge-sources', d),
  getKnowledgeSources: () => apiClient.get('/ai/knowledge-sources'),
  getUsageLogs: (q?: any) => apiClient.get('/ai/usage-logs', { params: q }),
  createOutputReview: (d: any) => apiClient.post('/ai/output-reviews', d),
  getProviderConfig: () => apiClient.get('/ai/provider-config'),
  updateProviderConfig: (d: any) => apiClient.post('/ai/provider-config', d),
};

// ─── Offline PWA / Sync API ──────────────────────────────────────────────────

export const offlineSyncApi = {
  push: (items: any[]) => apiClient.post('/sync/push', { items }),
  pull: (since?: string) => apiClient.get('/sync/pull', { params: { since } }),
  getStatus: () => apiClient.get('/sync/status'),
  getConflicts: () => apiClient.get('/sync/conflicts'),
  resolveConflict: (id: string, resolution: string) => apiClient.post(`/sync/conflicts/${id}/resolve`, { resolution }),
};

// ─── Integration Center API ──────────────────────────────────────────────

export const integrationCenterApi = {
  createIntegration: (d: any) => apiClient.post('/integrations', d),
  getIntegrations: (q?: any) => apiClient.get('/integrations', { params: q }),
  getIntegration: (id: string) => apiClient.get(`/integrations/${id}`),
  updateIntegration: (id: string, d: any) => apiClient.patch(`/integrations/${id}`, d),
  deleteIntegration: (id: string) => apiClient.delete(`/integrations/${id}`),
  testIntegration: (id: string) => apiClient.post(`/integrations/${id}/test`),
  syncIntegration: (id: string) => apiClient.post(`/integrations/${id}/sync`),
  getSyncLogs: (id: string) => apiClient.get(`/integrations/${id}/logs`),
};

// ─── Data Retention API ──────────────────────────────────────────────────

export const dataRetentionApi = {
  createPolicy: (d: any) => apiClient.post('/retention-policies', d),
  getPolicies: () => apiClient.get('/retention-policies'),
  archive: (d: any) => apiClient.post('/archive', d),
  getArchives: (module?: string) => apiClient.get('/archive', { params: { module } }),
  createLegalHold: (d: any) => apiClient.post('/legal-holds', d),
  getLegalHolds: () => apiClient.get('/legal-holds'),
  releaseLegalHold: (id: string) => apiClient.post(`/legal-holds/${id}/release`),
  createPurgeRequest: (d: any) => apiClient.post('/purge-requests', d),
  getPurgeRequests: () => apiClient.get('/purge-requests'),
  approvePurge: (id: string) => apiClient.post(`/purge-requests/${id}/approve`),
};

// ─── Compliance API ──────────────────────────────────────────────────────

export const complianceApi = {
  createAccessReview: (d: any) => apiClient.post('/access-reviews', d),
  getAccessReviews: () => apiClient.get('/access-reviews'),
  updateAccessReview: (id: string, status: string) => apiClient.patch(`/access-reviews/${id}`, { status }),
  createPermissionReview: (d: any) => apiClient.post('/permission-reviews', d),
  getPermissionReviews: () => apiClient.get('/permission-reviews'),
  acknowledgePolicy: (d: any) => apiClient.post('/policy-acknowledgements', d),
  getAcknowledgements: () => apiClient.get('/policy-acknowledgements'),
  getScore: () => apiClient.get('/compliance-score'),
};

// ─── Enterprise Reporting API ────────────────────────────────────────────

export const reportingApi = {
  createTemplate: (d: any) => apiClient.post('/report-templates', d),
  getTemplates: (type?: string) => apiClient.get('/report-templates', { params: { type } }),
  updateTemplate: (id: string, d: any) => apiClient.patch(`/report-templates/${id}`, d),
  deleteTemplate: (id: string) => apiClient.delete(`/report-templates/${id}`),
  runReport: (id: string) => apiClient.post(`/reports/${id}/run`),
  getRunHistory: (templateId?: string) => apiClient.get('/report-runs', { params: { templateId } }),
  createScheduled: (d: any) => apiClient.post('/scheduled-reports', d),
  getScheduled: () => apiClient.get('/scheduled-reports'),
  deleteSchedule: (id: string) => apiClient.delete(`/scheduled-reports/${id}`),
};

// ─── Incident Management API ─────────────────────────────────────────────

export const incidentApi = {
  getSettings: () => apiClient.get('/incident/settings'),
  updateSettings: (d: any) => apiClient.patch('/incident/settings', d),
  getMasterData: () => apiClient.get('/incident/master-data'),
  seedDefaults: () => apiClient.post('/incident/master-data/seed-defaults'),
  getModuleStatus: () => apiClient.get('/incident/module-status'),
};

// ─── Incident Report API ─────────────────────────────────────────────────

export const incidentReportApi = {
  createIncident: (d: any) => apiClient.post('/incidents', d),
  getIncidents: (q?: any) => apiClient.get('/incidents', { params: q }),
  getIncident: (id: string) => apiClient.get(`/incidents/${id}`),
  updateIncident: (id: string, d: any) => apiClient.patch(`/incidents/${id}`, d),
  deleteIncident: (id: string) => apiClient.delete(`/incidents/${id}`),
  submitIncident: (id: string) => apiClient.post(`/incidents/${id}/submit`),
  getClassification: (id: string) => apiClient.get(`/incidents/${id}/classification`),
  classify: (id: string, d: any) => apiClient.patch(`/incidents/${id}/classification`, d),
  reviewClassification: (id: string) => apiClient.post(`/incidents/${id}/classification/review`),
  getRelatedIncidents: (id: string) => apiClient.get(`/incidents/${id}/related-incidents`),
  getPeople: (id: string) => apiClient.get(`/incidents/${id}/people`),
  addPerson: (id: string, d: any) => apiClient.post(`/incidents/${id}/people`, d),
  updatePerson: (id: string, personId: string, d: any) => apiClient.patch(`/incidents/${id}/people/${personId}`, d),
  deletePerson: (id: string, personId: string) => apiClient.delete(`/incidents/${id}/people/${personId}`),
  getInjuries: (id: string) => apiClient.get(`/incidents/${id}/injuries`),
  addInjury: (id: string, d: any) => apiClient.post(`/incidents/${id}/injuries`, d),
  getAssets: (id: string) => apiClient.get(`/incidents/${id}/assets`),
  addAsset: (id: string, d: any) => apiClient.post(`/incidents/${id}/assets`, d),
  getPropertyDamages: (id: string) => apiClient.get(`/incidents/${id}/property-damages`),
  addPropertyDamage: (id: string, d: any) => apiClient.post(`/incidents/${id}/property-damages`, d),
  getEnvironmental: (id: string) => apiClient.get(`/incidents/${id}/environmental-impacts`),
  addEnvironmental: (id: string, d: any) => apiClient.post(`/incidents/${id}/environmental-impacts`, d),
  getReviewQueue: () => apiClient.get('/incidents/review-queue'),
  review: (id: string, d?: any) => apiClient.post(`/incidents/${id}/review`, d || {}),
  rejectIncident: (id: string, d?: any) => apiClient.post(`/incidents/${id}/reject`, d || {}),
  requestRevision: (id: string, d?: any) => apiClient.post(`/incidents/${id}/request-revision`, d || {}),
  assignInvestigator: (id: string, d: any) => apiClient.post(`/incidents/${id}/assign-investigator`, d),
  getWorkflow: (id: string) => apiClient.get(`/incidents/${id}/workflow`),
  getInvestigation: (id: string) => apiClient.get(`/incidents/${id}/investigation`),
  startInvestigation: (id: string) => apiClient.post(`/incidents/${id}/investigation/start`),
  updateInvestigation: (id: string, d: any) => apiClient.patch(`/incidents/${id}/investigation`, d),
  addTeamMember: (id: string, d: any) => apiClient.post(`/incidents/${id}/investigation/team`, d),
  addChronology: (id: string, d: any) => apiClient.post(`/incidents/${id}/investigation/chronology`, d),
  addInterview: (id: string, d: any) => apiClient.post(`/incidents/${id}/investigation/interviews`, d),
  addBarrier: (id: string, d: any) => apiClient.post(`/incidents/${id}/investigation/barriers`, d),
  addFinding: (id: string, d: any) => apiClient.post(`/incidents/${id}/investigation/findings`, d),
  submitInvestigation: (id: string) => apiClient.post(`/incidents/${id}/investigation/submit`),
  getRca: (id: string) => apiClient.get(`/incidents/${id}/rca`),
  updateRca: (id: string, d: any) => apiClient.patch(`/incidents/${id}/rca`, d),
  add5Why: (id: string, d: any) => apiClient.post(`/incidents/${id}/rca/5why`, d),
  addFishbone: (id: string, d: any) => apiClient.post(`/incidents/${id}/rca/fishbone`, d),
  addFactor: (id: string, d: any) => apiClient.post(`/incidents/${id}/rca/factors`, d),
  submitRca: (id: string) => apiClient.post(`/incidents/${id}/rca/submit`),
  reviewRca: (id: string, d: any) => apiClient.post(`/incidents/${id}/rca/review`, d),
  getCapa: (id: string) => apiClient.get(`/incidents/${id}/capa`),
  createCapa: (id: string, d: any) => apiClient.post(`/incidents/${id}/capa`, d),
  getEffectiveness: (id: string) => apiClient.get(`/incidents/${id}/capa/effectiveness`),
  effectivenessReview: (id: string, d: any) => apiClient.post(`/incidents/${id}/capa/effectiveness-review`, d),
  getIncidentAttachments: (id: string) => apiClient.get(`/incidents/${id}/attachments`),
  getIncidentComments: (id: string) => apiClient.get(`/incidents/${id}/comments`),
  getIncidentTimeline: (id: string) => apiClient.get(`/incidents/${id}/timeline`),
  getIncidentAuditLogs: (id: string) => apiClient.get(`/incidents/${id}/audit-logs`),
  getEscalationRules: () => apiClient.get('/incident/escalation-rules'),
  createEscalationRule: (d: any) => apiClient.post('/incident/escalation-rules', d),
  getLessonsLearned: (id: string) => apiClient.get(`/incidents/${id}/lessons-learned`),
  createLessonsLearned: (id: string, d: any) => apiClient.post(`/incidents/${id}/lessons-learned`, d),
  publishLessonsLearned: (id: string) => apiClient.post(`/incidents/${id}/lessons-learned/publish`),
  acknowledgeLessons: (id: string) => apiClient.post(`/incidents/${id}/lessons-learned/acknowledge`),
};

// ─── Risk Management API ───────────────────────────────────────────────

export const riskApi = {
  getSettings: () => apiClient.get('/risk/settings'),
  updateSettings: (d: any) => apiClient.patch('/risk/settings', d),
  getMasterData: () => apiClient.get('/risk/master-data'),
  seedDefaults: () => apiClient.post('/risk/master-data/seed-defaults'),
};

// ─── Risk Register API ──────────────────────────────────────────────────────

export const riskReportApi = {
  createRisk: (d: any) => apiClient.post('/risks', d),
  getRisks: (q?: any) => apiClient.get('/risks', { params: q }),
  getRisk: (id: string) => apiClient.get(`/risks/${id}`),
  updateRisk: (id: string, d: any) => apiClient.patch(`/risks/${id}`, d),
  deleteRisk: (id: string) => apiClient.delete(`/risks/${id}`),
  submitRisk: (id: string) => apiClient.post(`/risks/${id}/submit`),
  getHazardCategories: () => apiClient.get('/risk/hazard-categories'),
  createHazardCategory: (d: any) => apiClient.post('/risk/hazard-categories', d),
  getHazards: (q?: any) => apiClient.get('/risk/hazards', { params: q }),
  createHazard: (d: any) => apiClient.post('/risk/hazards', d),
  getConsequenceCategories: () => apiClient.get('/risk/consequence-categories'),
  createConsequenceCategory: (d: any) => apiClient.post('/risk/consequence-categories', d),
  getConsequences: (q?: any) => apiClient.get('/risk/consequences', { params: q }),
  getMappings: () => apiClient.get('/risk/hazard-mappings'),
  createMapping: (d: any) => apiClient.post('/risk/hazard-mappings', d),
};

// ─── Risk Matrix API ────────────────────────────────────────────────────

export const riskMatrixApi = {
  getMatrix: () => apiClient.get('/risk/matrix'),
  updateMatrix: (d: any) => apiClient.patch('/risk/matrix', d),
  previewScore: (d: any) => apiClient.post('/risk/matrix/preview', d),
  getVersions: () => apiClient.get('/risk/matrix/versions'),
};

// ─── Risk Dashboard API ─────────────────────────────────────────────────

export const riskDashboardApi = {
  getDashboard: () => apiClient.get('/risks/dashboard'),
  getHeatmap: () => apiClient.get('/risks/heatmap'),
  exportRisks: (format?: string) => apiClient.get('/risks/export', { params: { format } }),
};

// ─── Audit & Inspection API ─────────────────────────────────────────────

export const auditInspectionApi = {
  getSettings: () => apiClient.get('/audit-inspection/settings'),
  updateSettings: (d: any) => apiClient.patch('/audit-inspection/settings', d),
  getMasterData: () => apiClient.get('/audit-inspection/master-data'),
  seedDefaults: () => apiClient.post('/audit-inspection/master-data/seed-defaults'),
};

// ─── Audit CRUD API ─────────────────────────────────────────────────────

export const auditCrudApi = {
  createProgram: (d: any) => apiClient.post('/audit-programs', d),
  getPrograms: () => apiClient.get('/audit-programs'),
  getProgram: (id: string) => apiClient.get(`/audit-programs/${id}`),
  updateProgram: (id: string, d: any) => apiClient.patch(`/audit-programs/${id}`, d),
  deleteProgram: (id: string) => apiClient.delete(`/audit-programs/${id}`),
  createPlan: (d: any) => apiClient.post('/audit-plans', d),
  getPlans: (programId?: string) => apiClient.get('/audit-plans', { params: { programId } }),
  getPlan: (id: string) => apiClient.get(`/audit-plans/${id}`),
  deletePlan: (id: string) => apiClient.delete(`/audit-plans/${id}`),
  createAudit: (d: any) => apiClient.post('/audits', d),
  getAudits: (planId?: string, programId?: string) => apiClient.get('/audits', { params: { planId, programId } }),
  getAudit: (id: string) => apiClient.get(`/audits/${id}`),
  createInspectionPlan: (d: any) => apiClient.post('/inspection-plans', d),
  getInspectionPlans: () => apiClient.get('/inspection-plans'),
  getInspectionPlan: (id: string) => apiClient.get(`/inspection-plans/${id}`),
  createInspection: (d: any) => apiClient.post('/inspections', d),
  getInspections: (planId?: string) => apiClient.get('/inspections', { params: { planId } }),
  getInspection: (id: string) => apiClient.get(`/inspections/${id}`),
};
