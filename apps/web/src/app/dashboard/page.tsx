'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, PersonalDashboard, AdminDashboard, QHSSEDashboard } from '@/lib/dashboard-api';
import Link from 'next/link';
import { Users, AlertTriangle, CheckCircle, Clock, FileCheck, Bell as BellIcon, ListChecks, BarChart3 } from 'lucide-react';
import { MetricCard, SectionCard, PriorityBadge, StatusBadge, MetricSkeleton } from '@/components/dashboard/dashboard-cards';

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [tab, setTab] = useState<'personal' | 'qhsse' | 'admin'>('personal');
  const [personal, setPersonal] = useState<PersonalDashboard | null>(null);
  const [qhsse, setQhsse] = useState<QHSSEDashboard | null>(null);
  const [admin, setAdmin] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        dashboardApi.getPersonal().then((r) => setPersonal(r.data)).catch(() => {}),
        dashboardApi.getQHSSE().then((r) => setQhsse(r.data)).catch(() => {}),
        dashboardApi.getAdmin().then((r) => setAdmin(r.data)).catch(() => {}),
      ]);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { key: 'personal' as const, label: 'My Tasks' },
    { key: 'qhsse' as const, label: 'QHSSE Overview' },
    { key: 'admin' as const, label: 'Admin' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)}
        </div>
      )}

      {/* ═══ PERSONAL TAB ═══ */}
      {!loading && tab === 'personal' && personal?.summary && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="My Actions" value={personal.summary.myActions} Icon={ListChecks} trend={{ value: `${personal.summary.myActions}`, positive: true }} href="/dashboard/action-tracking" />
            <MetricCard label="Overdue" value={personal.summary.overdue} Icon={AlertTriangle} trend={{ value: personal.summary.overdue > 0 ? '!' : '0', positive: personal.summary.overdue === 0 }} />
            <MetricCard label="Pending Approvals" value={personal.summary.pendingApprovals} Icon={Clock} trend={{ value: 'Pending', positive: false }} />
            <MetricCard label="Unread Notifications" value={personal.summary.unreadNotifications} Icon={BellIcon} trend={{ value: 'New', positive: true }} href="/dashboard/notifications" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {personal.actionsByPriority.length > 0 && (
              <SectionCard title="Actions by Priority" description="Breakdown by urgency level">
                <div className="flex flex-wrap gap-3">
                  {personal.actionsByPriority.map((a) => (
                    <div key={a.priority} className="flex items-center gap-2">
                      <PriorityBadge priority={a.priority} />
                      <span className="text-sm font-medium tabular-nums text-foreground">{a.count}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {personal.pendingApprovalsList.length > 0 && (
              <SectionCard title="Pending Approvals" description="Items awaiting your review">
                <ul className="space-y-2.5">
                  {personal.pendingApprovalsList.slice(0, 5).map((pa) => (
                    <li key={pa.id} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate max-w-[180px]">{pa.workflowName}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={pa.status} />
                        <span className="text-[11px] text-muted-foreground tabular-nums">{new Date(pa.createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>

          {personal.recentActions.length > 0 && (
            <SectionCard title="Recent Actions" description="Latest tracked items" action={<button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>}>
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                      <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Priority</th>
                      <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {personal.recentActions.slice(0, 8).map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 text-foreground truncate max-w-[260px]">{a.title}</td>
                        <td className="py-2.5"><PriorityBadge priority={a.priority} /></td>
                        <td className="py-2.5"><StatusBadge status={a.status} /></td>
                        <td className="py-2.5 text-right text-xs text-muted-foreground tabular-nums">
                          {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </>
      )}

      {/* ═══ QHSSE TAB ═══ */}
      {!loading && tab === 'qhsse' && qhsse?.summary && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Actions" value={qhsse.summary.totalActions} Icon={BarChart3} />
            <MetricCard label="Open Actions" value={qhsse.summary.openActions} Icon={AlertTriangle} trend={{ value: `${Math.round((qhsse.summary.openActions / Math.max(qhsse.summary.totalActions, 1)) * 100)}%`, positive: false }} />
            <MetricCard label="Overdue" value={qhsse.summary.overdueActions} Icon={AlertTriangle} />
            <MetricCard label="Completion Rate" value={`${qhsse.summary.completionRate}%`} Icon={CheckCircle} trend={{ value: `+${qhsse.summary.completionRate}%`, positive: qhsse.summary.completionRate > 50 }} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {qhsse.actionsByPriority.length > 0 && (
              <SectionCard title="Actions by Priority">
                <div className="space-y-3">
                  {qhsse.actionsByPriority.map((a) => (
                    <div key={a.priority} className="flex items-center gap-3">
                      <PriorityBadge priority={a.priority} />
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-foreground transition-all"
                            style={{ width: `${qhsse.summary.totalActions > 0 ? (a.count / qhsse.summary.totalActions) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-medium tabular-nums text-foreground w-8 text-right">{a.count}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {qhsse.actionsByStatus.length > 0 && (
              <SectionCard title="Actions by Status">
                <div className="space-y-2.5">
                  {qhsse.actionsByStatus.map((a) => (
                    <div key={a.status} className="flex items-center justify-between">
                      <StatusBadge status={a.status} />
                      <span className="text-sm font-medium tabular-nums text-foreground">{a.count}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </>
      )}

      {/* ═══ ADMIN TAB ═══ */}
      {!loading && tab === 'admin' && admin?.summary && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Users" value={admin.summary.totalUsers} Icon={Users} href="/dashboard/users" />
            <MetricCard label="Active Users" value={admin.summary.activeUsers} Icon={Users} />
            <MetricCard label="Sites" value={admin.summary.totalSites} Icon={FileCheck} href="/dashboard/organization/sites" />
            <MetricCard label="Companies" value={admin.summary.totalCompanies} Icon={BarChart3} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {admin.usersByRole && admin.usersByRole.length > 0 && (
              <SectionCard title="Users by Role" description="Account distribution">
                <ul className="space-y-2">
                  {admin.usersByRole.map((r) => (
                    <li key={r.roleName} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{r.roleName}</span>
                      <span className="text-sm font-medium tabular-nums text-foreground">{r.count}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {admin.recentAuditLogs && admin.recentAuditLogs.length > 0 && (
              <SectionCard title="Recent Activity" description="Audit log">
                <ul className="space-y-2.5">
                  {admin.recentAuditLogs.slice(0, 8).map((log) => (
                    <li key={log.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">{log.module}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-muted-foreground">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground">{log.actorEmail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}
