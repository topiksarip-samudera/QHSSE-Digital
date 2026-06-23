'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { moduleManagementApi, ModuleData } from '@/lib/api';

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '',
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await moduleManagementApi.getModule(moduleId);
        const mod = res.data.data;
        setForm({
          name: mod.name,
          description: mod.description || '',
          icon: mod.icon || '',
          sortOrder: mod.sortOrder,
          isActive: mod.isActive,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load module');
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await moduleManagementApi.updateModule(moduleId, {
        name: form.name,
        description: form.description || undefined,
        icon: form.icon || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });
      router.push(`/dashboard/module-management/${moduleId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update module');
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/module-management" className="hover:text-foreground">
          Module Management
        </Link>
        <span>/</span>
        <Link href={`/dashboard/module-management/${moduleId}`} className="hover:text-foreground">
          Detail
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </div>

      <h1 className="text-2xl font-bold">Edit Module</h1>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6">
        <div>
          <label className="block text-sm font-medium">Module Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Icon</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. shield-alert"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href={`/dashboard/module-management/${moduleId}`}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
