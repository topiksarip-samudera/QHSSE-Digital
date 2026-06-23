'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { workflowApi, WorkflowInstanceData } from '@/lib/api';

export default function ApprovalQueuePage() {
  const [instances, setInstances] = useState<WorkflowInstanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slaBreaches, setSlaBreaches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'sla'>('pending');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [instancesRes, slaRes] = await Promise.all([
        workflowApi.listInstances({ status: 'submitted', limit: 50 }),
        workflowApi.getSlaBreaches(),
      ]);
      const inReviewRes = await workflowApi.listInstances({ status: 'in_review', limit: 50 });
      setInstances([
        ...instancesRes.data.data.items,
        ...inReviewRes.data.data.items,
      ]);
      setSlaBreaches(slaRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load approval queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickApprove = async (instanceId: string) => {
    if (!confirm('Approve this instance?')) return;
    try {
      await workflowApi.approveStep(instanceId, 'Quick approved from queue');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📥 Approval Queue</h1>
          <p className="text-muted-foreground">Items pending your review and approval</p>
        </div>
        <Link
          href="/dashboard/workflow"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          ← Back to Workflows
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'pending' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📋 Pending Review ({instances.length})
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'sla' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ⚠️ SLA Breaches ({slaBreaches.length})
        </button>
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
      ) : activeTab === 'pending' ? (
        instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-lg font-medium text-muted-foreground">🎉 No pending items</p>
            <p className="text-sm text-muted-foreground">All caught up! No instances waiting for your review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {instances.map((inst) => (
              <div key={inst.id} className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{inst.workflow?.name || 'Unknown Workflow'}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        inst.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inst.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      📄 {inst.recordType}/{inst.recordId} • Step {inst.currentStep} of {inst.steps?.length ?? '?'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(inst.createdAt).toLocaleDateString()} • Module: {inst.workflow?.moduleCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickApprove(inst.id)}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      ✅ Quick Approve
                    </button>
                    <Link
                      href={`/dashboard/workflow/instances/${inst.id}`}
                      className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* SLA Breaches Tab */
        slaBreaches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-lg font-medium text-muted-foreground">✅ No SLA breaches</p>
            <p className="text-sm text-muted-foreground">All workflow steps are within their SLA timeframes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {slaBreaches.map((breach) => (
              <div key={breach.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-red-800">
                      ⚠️ SLA Breached — {breach.instance?.workflow?.name || 'Unknown Workflow'}
                    </h3>
                    <p className="text-sm text-red-700">
                      Step {breach.stepOrder} • Record: {breach.instance?.recordType}/{breach.instance?.recordId}
                    </p>
                    <p className="text-xs text-red-600">
                      Due: {breach.dueAt ? new Date(breach.dueAt).toLocaleString() : 'N/A'} • Status: {breach.status}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/workflow/instances/${breach.instanceId}`}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    View Instance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
