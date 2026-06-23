'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { workflowApi } from '@/lib/api';

export default function NewWorkflowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    moduleCode: 'incident',
    description: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Workflow name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await workflowApi.create(form);
      router.push(`/dashboard/workflow/${res.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create workflow');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/workflow" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Workflows
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Create Workflow Template</h1>
        <p className="text-muted-foreground">Define a new approval workflow for a module</p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Workflow Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Incident Approval Workflow"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Module *</label>
          <select
            value={form.moduleCode}
            onChange={(e) => setForm({ ...form, moduleCode: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="incident">Incident Management</option>
            <option value="risk">Risk Management</option>
            <option value="audit">Audit & Inspection</option>
            <option value="action">Action Tracking</option>
            <option value="hazop">HAZOP Study</option>
            <option value="legal-register">Legal Register</option>
            <option value="msds">MSDS</option>
            <option value="waste-management">Waste Management</option>
            <option value="emergency">Emergency Management</option>
            <option value="bbs">BBS (Behavior Based Safety)</option>
            <option value="permit-to-work">Permit to Work</option>
            <option value="management-review">Management Review</option>
            <option value="document-control">Document Control</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the purpose and scope of this workflow..."
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active (available for use)
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Link
            href="/dashboard/workflow"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </form>
    </div>
  );
}
