'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { actionApi, ActionData, ActionQuery } from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-green-200 text-green-900',
  cancelled: 'bg-gray-100 text-gray-500',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

function formatDueDate(dueDate: string | null | undefined) {
  if (!dueDate) return '-';
  const d = new Date(dueDate);
  const now = new Date();
  const isOverdue = d < now;
  return (
    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
      {d.toLocaleDateString()}
    </span>
  );
}

export default function ActionTrackingListPage() {
  const router = useRouter();
  const [actions, setActions] = useState<ActionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query: ActionQuery = {
        page,
        limit: 20,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        overdue: overdueOnly || undefined,
        search: search || undefined,
      };
      const res = await actionApi.getActions(query);
      setActions(res.data.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to load actions', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, priorityFilter, overdueOnly, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action Tracking</h1>
          <p className="text-gray-600 mt-1">Manage corrective and preventive actions</p>
        </div>
        <Link
          href="/dashboard/action-tracking/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          + New Action
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search actions..."
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="in_review">In Review</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={overdueOnly}
            onChange={(e) => { setOverdueOnly(e.target.checked); setPage(1); }}
            className="rounded text-blue-600"
          />
          Overdue only
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading actions...</div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No actions found</p>
          <p className="text-gray-400 text-sm mt-1">Create a new action to get started</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {actions.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/action-tracking/${a.id}`)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">
                      {a.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[a.status] || 'bg-gray-100'}`}>
                        {a.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[a.priority] || 'bg-gray-100'}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {a.assignee?.email || a.assignedTo}
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDueDate(a.dueDate)}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {a.sourceType && `${a.sourceType}/${a.sourceId}` || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                <p className="text-xs text-gray-500">{total} total</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
