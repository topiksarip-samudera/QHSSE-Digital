'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, PersonalDashboard, AdminDashboard, QHSSEDashboard } from '@/lib/api';
import Link from 'next/link';

function StatCard({ label, value, href, color }: { label: string; value: number | string; href?: string; color?: string }) {
  const content = (
    <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color || 'text-foreground'}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[priority] || 'bg-gray-100 text-gray-800'}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-green-100 text-green-800',
    submitted: 'bg-purple-100 text-purple-800',
    in_review: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'personal' | 'qhsse' | 'admin'>('personal');
  const [personal, setPersonal] = useState<PersonalDashboard | null>(null);
  const [qhsse, setQhsse] = useState<QHSSEDashboard | null>(null);
  const [admin, setAdmin] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [
        dashboardApi.getPersonal().then((r) => setPersonal(r.data)).catch(() => {}),
        dashboardApi.getQHSSE().then((r) => setQhsse(r.data)).catch(() => {}),
        dashboardApi.getAdmin().then((r) => setAdmin(r.data)).catch(() => {}),
      ];
      await Promise.all(promises);
    } catch {
      // Silently fail individual fetches
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabLabels = [
    { key: 'personal' as const, label: '↗️ My Tasks' },
    { key: 'qhsse' as const, label: '🛡️ QHSSE Overview' },
    { key: 'admin' as const, label: '⚙️ Admin' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your QHSSE platform</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading dashboard...</div>
      ) : (
        <>
          {/* ======== PERSONAL TAB ======== */}
          {tab === 'personal' && personal?.summary && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatCard label="My Actions" value={personal.summary.myActions} href="/dashboard/action-tracking" color="text-blue-600" />
                <StatCard label="Overdue" value={personal.summary.overdue} color="text-red-600" />
                <StatCard label="Upcoming" value={personal.summary.upcoming} color="text-green-600" />
                <StatCard label="Pending Approvals" value={personal.summary.pendingApprovals} color="text-purple-600" />
                <StatCard label="Unread Notifications" value={personal.summary.unreadNotifications} href="/dashboard/notifications" color="text-orange-600" />
              </div>

              {personal.actionsByPriority.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">By Priority</h2>
                  <div className="flex gap-3">
                    {personal.actionsByPriority.map((a) => (
                      <div key={a.priority} className="flex items-center gap-2">
                        <PriorityBadge priority={a.priority} />
                        <span className="text-sm font-medium text-gray-700">{a.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {personal.pendingApprovalsList.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Approvals</h2>
                  <ul className="space-y-2">
                    {personal.pendingApprovalsList.map((pa) => (
                      <li key={pa.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{pa.workflowName}</span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={pa.status} />
                          <span className="text-xs text-gray-400">{new Date(pa.createdAt).toLocaleDateString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {personal.recentActions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Actions</h2>
                  <ul className="space-y-2">
                    {personal.recentActions.map((a: any) => (
                      <li key={a.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 truncate max-w-md">{a.title}</span>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={a.priority} />
                          <StatusBadge status={a.status} />
                          {a.dueDate && (
                            <span className="text-xs text-gray-400">{new Date(a.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ======== QHSSE TAB ======== */}
          {tab === 'qhsse' && qhsse?.summary && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Total Actions" value={qhsse.summary.totalActions} color="text-blue-600" />
                <StatCard label="Open Actions" value={qhsse.summary.openActions} color="text-yellow-600" />
                <StatCard label="Overdue" value={qhsse.summary.overdueActions} color="text-red-600" />
                <StatCard label="Completion Rate" value={`${qhsse.summary.completionRate}%`} color="text-green-600" />
                <StatCard label="Notifications (7d)" value={qhsse.summary.notificationsLastWeek} color="text-purple-600" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {qhsse.actionsByPriority.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Actions by Priority</h2>
                    <div className="space-y-2">
                      {qhsse.actionsByPriority.map((a) => (
                        <div key={a.priority} className="flex items-center justify-between">
                          <PriorityBadge priority={a.priority} />
                          <div className="flex-1 mx-3">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{
                                  width: `${qhsse.summary.totalActions > 0 ? Math.round((a.count / qhsse.summary.totalActions) * 100) : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{a.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {qhsse.actionsByStatus.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Actions by Status</h2>
                    <div className="space-y-2">
                      {qhsse.actionsByStatus.map((a) => (
                        <div key={a.status} className="flex items-center justify-between">
                          <StatusBadge status={a.status} />
                          <span className="text-sm font-medium text-gray-700">{a.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {qhsse.recentActions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Actions</h2>
                  <ul className="space-y-2">
                    {qhsse.recentActions.map((a: any) => (
                      <li key={a.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 truncate max-w-md">{a.title}</span>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={a.priority} />
                          <StatusBadge status={a.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ======== ADMIN TAB ======== */}
          {tab === 'admin' && admin?.summary && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Users" value={admin.summary.totalUsers} href="/dashboard/users" color="text-blue-600" />
                <StatCard label="Active Users" value={admin.summary.activeUsers} color="text-green-600" />
                <StatCard label="Sites" value={admin.summary.totalSites} href="/dashboard/organization/sites" color="text-indigo-600" />
                <StatCard label="Departments" value={admin.summary.totalDepartments} href="/dashboard/organization/departments" color="text-purple-600" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Actions" value={admin.summary.totalActions} color="text-orange-600" />
                <StatCard label="Attachments" value={admin.summary.totalAttachments} href="/dashboard/attachments" color="text-teal-600" />
                <StatCard label="Modules Enabled" value={admin.summary.modulesEnabled} color="text-gray-600" />
                <StatCard label="Companies" value={admin.summary.totalCompanies} href="/dashboard/companies" color="text-blue-600" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {admin.usersByRole && admin.usersByRole.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Users by Role</h2>
                    <ul className="space-y-2">
                      {admin.usersByRole.map((r: any) => (
                        <li key={r.roleName} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{r.roleName}</span>
                          <span className="font-medium text-gray-900">{r.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {admin.actionsByStatus && admin.actionsByStatus.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Actions by Status</h2>
                    <ul className="space-y-2">
                      {admin.actionsByStatus.map((a: any) => (
                        <li key={a.status} className="flex items-center justify-between text-sm">
                          <StatusBadge status={a.status} />
                          <span className="font-medium text-gray-900">{a.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {admin.recentAuditLogs && admin.recentAuditLogs.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
                  <ul className="space-y-2">
                    {admin.recentAuditLogs.map((log: any) => (
                      <li key={log.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-gray-700 font-medium">{log.module}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-500">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{log.actorEmail}</span>
                          <span className="text-xs text-gray-300">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
