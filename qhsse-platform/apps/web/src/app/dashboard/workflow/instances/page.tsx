'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { workflowApi, WorkflowInstanceData } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  closed: 'bg-purple-100 text-purple-700',
};

export default function WorkflowInstancesPage() {
  const [instances, setInstances] = useState<WorkflowInstanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchInstances = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await workflowApi.listInstances({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      const d = res.data.data;
      setInstances(d.items);
      setTotalPages(d.totalPages);
      setTotal(d.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, [page, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflow Instances</h1>
          <p className="text-muted-foreground">Track all running and completed workflow instances</p>
        </div>
        <Link
          href="/dashboard/workflow"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          ← Back to Templates
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by record type or ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-xs rounded-md border bg-background px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
        <span className="text-sm text-muted-foreground">{total} instances</span>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-lg font-medium text-muted-foreground">No instances found</p>
          <p className="text-sm text-muted-foreground">Workflow instances will appear here when created</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Workflow</th>
                  <th className="px-4 py-3 text-left font-medium">Record</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Current Step</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((inst) => (
                  <tr key={inst.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{inst.workflow?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{inst.workflow?.moduleCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                        {inst.recordType}/{inst.recordId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[inst.status] || 'bg-gray-100'}`}>
                        {inst.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      Step {inst.currentStep} of {inst.steps?.length ?? '?'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(inst.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/workflow/instances/${inst.id}`}
                        className="rounded-md px-2 py-1 text-xs font-medium hover:bg-accent"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
