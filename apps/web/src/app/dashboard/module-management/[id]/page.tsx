'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { moduleManagementApi, ModuleData } from '@/lib/api';

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;

  const [module, setModule] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newFeature, setNewFeature] = useState({ name: '', code: '', description: '' });

  const fetchModule = async () => {
    setLoading(true);
    try {
      const res = await moduleManagementApi.getModule(moduleId);
      setModule(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      await moduleManagementApi.deleteModule(moduleId);
      router.push('/dashboard/module-management');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete module');
    }
  };

  const handleToggleFeature = async (featureId: string, currentState: boolean) => {
    try {
      await moduleManagementApi.updateFeature(featureId, { isActive: !currentState });
      fetchModule();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle feature');
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.name || !newFeature.code) {
      alert('Name and code are required');
      return;
    }
    try {
      await moduleManagementApi.createFeature(moduleId, newFeature);
      setNewFeature({ name: '', code: '', description: '' });
      setShowAddFeature(false);
      fetchModule();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create feature');
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Delete this feature?')) return;
    try {
      await moduleManagementApi.deleteFeature(featureId);
      fetchModule();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete feature');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error || 'Module not found'}
        </div>
        <Link href="/dashboard/module-management" className="text-sm text-primary hover:underline">
          ← Back to modules
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/module-management" className="hover:text-foreground">
          Module Management
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{module.icon ? getIcon(module.icon) : '📦'}</span>
          <div>
            <h1 className="text-2xl font-bold">{module.name}</h1>
            <p className="font-mono text-sm text-muted-foreground">{module.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/module-management/${moduleId}/edit`}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {module.description && (
        <p className="text-muted-foreground">{module.description}</p>
      )}

      {/* Info Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className={`mt-1 font-medium ${module.isActive ? 'text-green-600' : 'text-gray-500'}`}>
            {module.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Sort Order</p>
          <p className="mt-1 font-medium">{module.sortOrder}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Tenants</p>
          <p className="mt-1 font-medium">{module.tenantModules?.length ?? 0}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Features ({module.features?.length ?? 0})</h2>
          <button
            onClick={() => setShowAddFeature(!showAddFeature)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Add Feature
          </button>
        </div>

        {/* Add Feature Form */}
        {showAddFeature && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-3 font-medium">New Feature</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Feature Name"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Feature Code (kebab-case)"
                value={newFeature.code}
                onChange={(e) => setNewFeature({ ...newFeature, code: e.target.value })}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAddFeature}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddFeature(false)}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Features Table */}
        {module.features && module.features.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {module.features.map((feature) => (
                  <tr key={feature.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">{feature.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{feature.code}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{feature.description || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeature(feature.id, feature.isActive)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          feature.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            feature.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <p className="text-sm text-muted-foreground">No features configured</p>
          </div>
        )}
      </div>

      {/* Tenant Assignments */}
      {module.tenantModules && module.tenantModules.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tenant Assignments</h2>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tenant</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Enabled At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {module.tenantModules.map((tm) => (
                  <tr key={tm.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">
                      {tm.tenant?.name || tm.tenantId}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          tm.isEnabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {tm.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(tm.enabledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    'shield-alert': '🛡️', 'alert-triangle': '⚠️', 'clipboard-check': '📋',
    'file-check': '✅', 'file-text': '📄', 'graduation-cap': '🎓',
    'scale': '⚖️', 'leaf': '🌿', 'award': '🏆',
    'lock': '🔒', 'users': '👥', 'check-square': '✅', 'bar-chart': '📊',
  };
  return iconMap[icon] || '📦';
}
