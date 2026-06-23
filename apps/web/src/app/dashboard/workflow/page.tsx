'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { workflowApi, WorkflowData } from '@/lib/api';

export default function WorkflowListPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await workflowApi.list({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
        moduleCode: moduleFilter || undefined,
      });
      const d = res.data.data;
      setWorkflows(d.items);
      setTotalPages(d.totalPages);
      setTotal(d.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [page, search, statusFilter, moduleFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete workflow "${name}"? This will soft-delete it.`)) return;
    try {
      await workflowApi.delete(id);
      fetchWorkflows();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete workflow');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflow Templates</h1>
          <p className="text-muted-foreground">
            Design and manage approval workflows for your modules
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/workflow/instances"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            📋 View Instances
          </Link>
          <Link
            href="/dashboard/workflow/queue"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            📥 Approval Queue
          </Link>
          <Link
            href="/dashboard/workflow/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + New Workflow
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search workflows..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">All Modules</option>
          <option value="incident">Incident</option>
          <option value="risk">Risk</option>
          <option value="audit">Audit</option>
          <option value="action">Action</option>
          <option value="hazop">HAZOP</option>
        </select>
        <span className="text-sm text-muted-foreground">{total} workflows</span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-lg font-medium text-muted-foreground">No workflows found</p>
          <p className="text-sm text-muted-foreground">
            {search ? 'Try a different search term' : 'Get started by creating a workflow'}
          </p>
        </div>
      ) : (
        <>
          {/* Workflow Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{wf.name}</h3>
                    <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {wf.moduleCode}
                    </span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    wf.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {wf.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {wf.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {wf.description}
                  </p>
                )}

                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📝 {wf.steps?.length ?? 0} steps</span>
                  <span>📊 {wf._count?.instances ?? 0} instances</span>
                </div>

                {/* Steps preview */}
                {wf.steps && wf.steps.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {wf.steps.slice(0, 3).map((step, i) => (
                      <div key={step.id} className="flex items-center gap-2 text-xs">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {step.stepOrder}
                        </span>
                        <span className="truncate">{step.name}</span>
                        <span className="ml-auto text-muted-foreground">{step.assigneeType}</span>
                      </div>
                    ))}
                    {wf.steps.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{wf.steps.length - 3} more steps</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 border-t pt-3">
                  <Link
                    href={`/dashboard/workflow/${wf.id}`}
                    className="rounded-md px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/workflow/${wf.id}/edit`}
                    className="rounded-md px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(wf.id, wf.name)}
                    className="ml-auto rounded-md px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
