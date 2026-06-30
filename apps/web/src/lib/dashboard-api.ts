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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchDash<T>(path: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const json = await res.json();
  return json.data;
}

export const dashboardApi = {
  getPersonal: async () => ({ data: await fetchDash<PersonalDashboard>('/dashboard/personal') }),
  getAdmin: async () => ({ data: await fetchDash<AdminDashboard>('/dashboard/admin') }),
  getQHSSE: async () => ({ data: await fetchDash<QHSSEDashboard>('/dashboard/qhsse') }),
};
