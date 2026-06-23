'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { workflowApi, WorkflowData, WorkflowStepData } from '@/lib/api';

export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step form state
  const [showStepForm, setShowStepForm] = useState(false);
  const [stepForm, setStepForm] = useState({
    name: '',
    stepOrder: 1,
    assigneeType: 'role',
    assigneeValue: '',
    actionType: 'approve',
    isRequired: true,
    slaHours: 24,
    escalateAfterHr: 48,
  });
  const [stepSaving, setStepSaving] = useState(false);

  const fetchWorkflow = async () => {
    setLoading(true);
    try {
      const res = await workflowApi.get(id);
      setWorkflow(res.data.data);
      if (res.data.data.steps?.length) {
        setStepForm((f) => ({ ...f, stepOrder: res.data.data.steps.length + 1 }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepForm.name.trim() || !stepForm.assigneeValue.trim()) {
      alert('Step name and assignee value are required');
      return;
    }
    setStepSaving(true);
    try {
      await workflowApi.addStep(id, stepForm);
      setShowStepForm(false);
      setStepForm({
        name: '',
        stepOrder: (workflow?.steps?.length ?? 0) + 2,
        assigneeType: 'role',
        assigneeValue: '',
        actionType: 'approve',
        isRequired: true,
        slaHours: 24,
        escalateAfterHr: 48,
      });
      fetchWorkflow();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add step');
    } finally {
      setStepSaving(false);
    }
  };

  const handleRemoveStep = async (stepId: string) => {
    if (!confirm('Remove this step? Remaining steps will be reordered.')) return;
    try {
      await workflowApi.removeStep(stepId);
      fetchWorkflow();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove step');
    }
  };

  const handleToggleActive = async () => {
    if (!workflow) return;
    try {
      await workflowApi.update(workflow.id, { isActive: !workflow.isActive });
      fetchWorkflow();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/workflow" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Workflows
        </Link>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error || 'Workflow not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/workflow" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Workflows
        </Link>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {workflow.moduleCode}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {workflow.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {workflow.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <Link
              href={`/dashboard/workflow/${workflow.id}/edit`}
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      {workflow.description && (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">{workflow.description}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{workflow.steps?.length ?? 0}</p>
          <p className="text-sm text-muted-foreground">Steps</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{workflow._count?.instances ?? 0}</p>
          <p className="text-sm text-muted-foreground">Instances</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {workflow.steps?.reduce((acc, s) => acc + (s.slaHours || 0), 0) ?? 0}h
          </p>
          <p className="text-sm text-muted-foreground">Total SLA</p>
        </div>
      </div>

      {/* Workflow Steps (Visual Pipeline) */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Workflow Steps</h2>
          <button
            onClick={() => setShowStepForm(!showStepForm)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {showStepForm ? 'Cancel' : '+ Add Step'}
          </button>
        </div>

        {/* Add Step Form */}
        {showStepForm && (
          <form onSubmit={handleAddStep} className="mb-6 space-y-4 rounded-md border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Step Name *</label>
                <input
                  type="text"
                  value={stepForm.name}
                  onChange={(e) => setStepForm({ ...stepForm, name: e.target.value })}
                  placeholder="e.g., Manager Review"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Step Order</label>
                <input
                  type="number"
                  value={stepForm.stepOrder}
                  onChange={(e) => setStepForm({ ...stepForm, stepOrder: parseInt(e.target.value) || 1 })}
                  min={1}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Assignee Type *</label>
                <select
                  value={stepForm.assigneeType}
                  onChange={(e) => setStepForm({ ...stepForm, assigneeType: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="role">Role</option>
                  <option value="user">Specific User</option>
                  <option value="department_head">Department Head</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Assignee Value *</label>
                <input
                  type="text"
                  value={stepForm.assigneeValue}
                  onChange={(e) => setStepForm({ ...stepForm, assigneeValue: e.target.value })}
                  placeholder="e.g., hse_manager, user-id"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Action Type</label>
                <select
                  value={stepForm.actionType}
                  onChange={(e) => setStepForm({ ...stepForm, actionType: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="approve">Approve</option>
                  <option value="review">Review</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">SLA Hours</label>
                <input
                  type="number"
                  value={stepForm.slaHours}
                  onChange={(e) => setStepForm({ ...stepForm, slaHours: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Escalate After (hours)</label>
                <input
                  type="number"
                  value={stepForm.escalateAfterHr}
                  onChange={(e) => setStepForm({ ...stepForm, escalateAfterHr: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stepRequired"
                  checked={stepForm.isRequired}
                  onChange={(e) => setStepForm({ ...stepForm, isRequired: e.target.checked })}
                  className="h-4 w-4 rounded border"
                />
                <label htmlFor="stepRequired" className="text-sm font-medium">Required step</label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowStepForm(false)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={stepSaving}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {stepSaving ? 'Adding...' : 'Add Step'}
              </button>
            </div>
          </form>
        )}

        {/* Steps Pipeline */}
        {!workflow.steps || workflow.steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <p className="text-muted-foreground">No steps defined yet</p>
            <p className="text-sm text-muted-foreground">Add steps to build your workflow pipeline</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className="absolute left-6 -top-3 h-3 w-0.5 bg-border" />
                )}
                <div className="flex items-start gap-4 rounded-md border bg-background p-4">
                  {/* Step number */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.stepOrder}
                  </div>
                  {/* Step details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{step.name}</h3>
                      {step.isRequired && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">Required</span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>👤 {step.assigneeType}: {step.assigneeValue}</span>
                      <span>⚡ {step.actionType}</span>
                      {step.slaHours && <span>⏱ SLA: {step.slaHours}h</span>}
                      {step.escalateAfterHr && <span>🔔 Escalate: {step.escalateAfterHr}h</span>}
                    </div>
                    {step.approvers && step.approvers.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        👥 {step.approvers.length} approver(s) assigned
                      </div>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveStep(step.id)}
                    className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
