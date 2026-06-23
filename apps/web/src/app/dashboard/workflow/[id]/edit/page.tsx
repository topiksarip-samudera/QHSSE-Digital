'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { workflowApi, WorkflowData } from '@/lib/api';

export default function EditWorkflowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await workflowApi.get(id);
        const wf: WorkflowData = res.data.data;
        setForm({
          name: wf.name,
          description: wf.description || '',
          isActive: wf.isActive,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load workflow');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await workflowApi.update(id, form);
      router.push(`/dashboard/workflow/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update workflow');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/dashboard/workflow/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Workflow
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit Workflow</h1>
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
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <label htmlFor="isActive" className="text-sm font-medium">Active</label>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Link
            href={`/dashboard/workflow/${id}`}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
