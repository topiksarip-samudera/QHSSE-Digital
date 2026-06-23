'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { workflowApi, WorkflowInstanceData, WorkflowHistoryData } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  closed: 'bg-purple-100 text-purple-700',
};

const ACTION_ICONS: Record<string, string> = {
  submit: '📤',
  approve: '✅',
  reject: '❌',
  request_revision: '🔄',
  close: '🔒',
};

export default function InstanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [instance, setInstance] = useState<WorkflowInstanceData | null>(null);
  const [history, setHistory] = useState<WorkflowHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [instRes, histRes] = await Promise.all([
        workflowApi.getInstance(id),
        workflowApi.getInstanceHistory(id),
      ]);
      setInstance(instRes.data.data);
      setHistory(histRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAction = async (action: 'submit' | 'approve' | 'reject' | 'request-revision' | 'close') => {
    if ((action === 'reject' || action === 'request-revision') && !actionComment.trim()) {
      alert('Comment is required for this action');
      return;
    }
    if (!confirm(`Are you sure you want to ${action.replace('-', ' ')} this instance?`)) return;
    setActionLoading(true);
    try {
      switch (action) {
        case 'submit':
          await workflowApi.submitInstance(id, actionComment);
          break;
        case 'approve':
          await workflowApi.approveStep(id, actionComment);
          break;
        case 'reject':
          await workflowApi.rejectStep(id, actionComment);
          break;
        case 'request-revision':
          await workflowApi.requestRevision(id, actionComment);
          break;
        case 'close':
          await workflowApi.closeInstance(id);
          break;
      }
      setActionComment('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/workflow/instances" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Instances
        </Link>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error || 'Instance not found'}
        </div>
      </div>
    );
  }

  const canSubmit = instance.status === 'draft';
  const canReview = ['submitted', 'in_review'].includes(instance.status);
  const canClose = ['approved', 'rejected'].includes(instance.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/workflow/instances" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Instances
        </Link>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workflow Instance</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="rounded bg-muted px-2.5 py-0.5 text-xs font-mono">
                {instance.recordType}/{instance.recordId}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[instance.status] || 'bg-gray-100'}`}>
                {instance.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold">{instance.workflow?.name}</h2>
        <p className="text-sm text-muted-foreground">Module: {instance.workflow?.moduleCode}</p>
      </div>

      {/* Steps Pipeline */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Steps Progress</h2>
        <div className="space-y-3">
          {instance.steps?.map((step, index) => {
            const isCurrent = step.stepOrder === instance.currentStep;
            const stepStatus = step.status;
            return (
              <div key={step.id} className="relative">
                {index > 0 && <div className="absolute left-6 -top-3 h-3 w-0.5 bg-border" />}
                <div className={`flex items-start gap-4 rounded-md border p-4 ${
                  isCurrent ? 'border-primary bg-primary/5' : 'bg-background'
                }`}>
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    stepStatus === 'approved' ? 'bg-green-500 text-white' :
                    stepStatus === 'rejected' ? 'bg-red-500 text-white' :
                    stepStatus === 'submitted' ? 'bg-blue-500 text-white' :
                    isCurrent ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {stepStatus === 'approved' ? '✓' : stepStatus === 'rejected' ? '✗' : step.stepOrder}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {instance.workflow?.steps?.find((s) => s.id === step.stepId)?.name || `Step ${step.stepOrder}`}
                      </h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[stepStatus] || 'bg-gray-100'}`}>
                        {stepStatus}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span>👤 {step.assigneeType}: {step.assigneeValue}</span>
                      {step.completedBy && <span className="ml-3">✅ By: {step.completedBy}</span>}
                      {step.completedAt && <span className="ml-3">📅 {new Date(step.completedAt).toLocaleString()}</span>}
                    </div>
                    {step.comment && (
                      <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                        💬 {step.comment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions Panel */}
      {(canSubmit || canReview || canClose) && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Actions</h2>
          <div className="space-y-4">
            {(canSubmit || canReview) && (
              <div>
                <label className="mb-1 block text-sm font-medium">Comment</label>
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder="Add a comment for your action..."
                  rows={2}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {canSubmit && (
                <button
                  onClick={() => handleAction('submit')}
                  disabled={actionLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  📤 Submit for Review
                </button>
              )}
              {canReview && (
                <>
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={actionLoading}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleAction('request-revision')}
                    disabled={actionLoading}
                    className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                  >
                    🔄 Request Revision
                  </button>
                </>
              )}
              {canClose && (
                <button
                  onClick={() => handleAction('close')}
                  disabled={actionLoading}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  🔒 Close Instance
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-start gap-3 rounded-md border p-3">
                <span className="text-lg">{ACTION_ICONS[h.action] || '📝'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{h.action.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground">Step {h.stepOrder}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By: {h.performedBy} • {new Date(h.createdAt).toLocaleString()}
                  </p>
                  {h.comment && (
                    <p className="mt-1 text-sm">💬 {h.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
