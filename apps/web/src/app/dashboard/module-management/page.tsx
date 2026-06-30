'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { moduleManagementApi, ModuleData } from '@/lib/api';

export default function ModuleManagementPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await moduleManagementApi.listModules({
        page,
        pageSize: 50,
        search: search || undefined,
        sort: 'sortOrder',
        order: 'asc',
      });
      setModules(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotal(res.data.meta.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [page, search]);

  const handleToggleActive = async (module: ModuleData) => {
    try {
      await moduleManagementApi.updateModule(module.id, {
        isActive: !module.isActive,
      });
      fetchModules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle module');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Module Management</h1>
          <p className="text-muted-foreground">
            Manage system modules, features, and access control
          </p>
        </div>
        <Link
          href="/dashboard/module-management/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Add Module
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search modules..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-md rounded-md border bg-background px-3 py-2 text-sm"
        />
        <span className="text-sm text-muted-foreground">{total} modules</span>
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
      ) : modules.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-lg font-medium text-muted-foreground">No modules found</p>
          <p className="text-sm text-muted-foreground">
            {search ? 'Try a different search term' : 'Get started by adding a module'}
          </p>
        </div>
      ) : (
        /* Module Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`relative rounded-lg border bg-card p-5 transition-all hover:shadow-md ${
                !mod.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Status Badge */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mod.icon ? getIcon(mod.icon) : '📦'}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      mod.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {mod.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleActive(mod)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    mod.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  title={mod.isActive ? 'Deactivate' : 'Activate'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      mod.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Module Info */}
              <Link href={`/dashboard/module-management/${mod.id}`}>
                <h3 className="text-lg font-semibold hover:underline">{mod.name}</h3>
              </Link>
              <p className="mt-1 text-xs font-mono text-muted-foreground">{mod.code}</p>
              {mod.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{mod.description}</p>
              )}

              {/* Features Count */}
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>🔧 {mod.features?.length ?? 0} features</span>
                <span>🏢 {mod._count?.tenantModules ?? 0} tenants</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function getIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    'shield-alert': '🛡️',
    'alert-triangle': '⚠️',
    'clipboard-check': '📋',
    'file-check': '✅',
    'file-text': '📄',
    'graduation-cap': '🎓',
    'scale': '⚖️',
    'leaf': '🌿',
    'award': '🏆',
    'lock': '🔒',
    'users': '👥',
    'check-square': '✅',
    'bar-chart': '📊',
  };
  return iconMap[icon] || '📦';
}
