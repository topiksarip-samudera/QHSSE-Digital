'use client';

import { useState, useEffect, useCallback } from 'react';
import { auditLogApi, AuditLogEntry, AuditLogStats } from '@/lib/api';
import Link from 'next/link';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-success/20 text-success-foreground',
  update: 'bg-blue-100 text-primary-foreground',
  delete: 'bg-red-100 text-destructive-foreground',
  view: 'bg-muted text-foreground/90',
  export: 'bg-purple-100 text-purple-800',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tab, setTab] = useState<'audit' | 'login'>('audit');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [logRes, statsRes] = await Promise.all([
        auditLogApi.getAuditLogs({
          page,
          limit: 20,
          module: moduleFilter || undefined,
          action: actionFilter || undefined,
          search: search || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        }),
        auditLogApi.getStats(),
      ]);
      setLogs(logRes.data.data || []);
      setTotalPages(logRes.data.data?.meta?.totalPages || 1);
      setTotal(logRes.data.data?.meta?.total || 0);
      setStats(statsRes.data.data || statsRes.data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  }, [page, moduleFilter, actionFilter, search, fromDate, toDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    try {
      const blob = await auditLogApi.exportAuditLogs({
        module: moduleFilter || undefined,
        action: actionFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const modules = stats?.byModule?.map((m) => m.module) || [];
  const actions = stats?.byAction?.map((a) => a.action) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground mt-1">Track all system activity and changes</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/audit-log/settings"
            className="px-4 py-2 border border-border rounded-lg text-sm text-foreground/80 hover:bg-muted/50"
          >
            Settings
          </Link>
          <button onClick={handleExport} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg shadow p-4">
            <p className="text-sm text-muted-foreground/80">Total Audit Entries</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <p className="text-sm text-muted-foreground/80">Modules Tracked</p>
            <p className="text-2xl font-bold text-foreground">{stats.byModule?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <p className="text-sm text-muted-foreground/80">Actions</p>
            <p className="text-2xl font-bold text-foreground">{stats.byAction?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <p className="text-sm text-muted-foreground/80">Recent (24h)</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.recentActivity?.filter(
                (a) => new Date(a.createdAt).getTime() > Date.now() - 86400000,
              ).length || 0}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { key: 'audit' as const, label: 'Audit Logs' },
          { key: 'login' as const, label: 'Login History' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key
                ? 'border-blue-600 text-primary'
                : 'border-transparent text-muted-foreground/80 hover:text-foreground/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search logs..."
          className="px-3 py-2 border border-border rounded-lg text-sm w-48"
        />
        <select
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-border rounded-lg text-sm"
        >
          <option value="">All Modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-border rounded-lg text-sm"
        >
          <option value="">All Actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-border rounded-lg text-sm"
        />
        <span className="text-muted-foreground/60 text-sm">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => { setToDate(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-border rounded-lg text-sm"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground/80">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <p className="text-muted-foreground/80 text-lg">No audit logs found</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Activity will appear here as users interact with the system</p>
        </div>
      ) : (
        <>
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">Module</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">Record</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">Actor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground/80 uppercase">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/audit-log/${log.id}`} className="text-xs text-foreground hover:text-primary font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground/90">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-muted text-foreground/90'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground/80">
                      {log.recordType && (
                        <span>
                          {log.recordType}
                          {log.recordId && <span className="font-mono">/{log.recordId}</span>}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {log.actor?.email || log.actorId}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground/60 font-mono">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-t">
                <p className="text-xs text-muted-foreground/80">{total} total entries</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
