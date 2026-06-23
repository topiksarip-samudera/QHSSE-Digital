'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { masterDataApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export default function MasterDataGroupsPage() {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, pageSize: 20 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await masterDataApi.listGroups(params);
      setData(res.data.data || []);
      setMeta(res.data.meta || { page: 1, pageSize: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load master data groups');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete group "${name}"? This will also remove all its items.`)) return;
    try {
      await masterDataApi.deleteGroup(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const handleExport = async () => {
    try {
      const res = await masterDataApi.exportItems();
      const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `master-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Export failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Master Data</h1>
          <p className="text-sm text-muted-foreground">Manage master data groups and their items</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            📥 Export
          </button>
          <Link
            href="/dashboard/master-data/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + New Group
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            Search
          </button>
        </form>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="mb-2">No master data groups found</p>
            <Link href="/dashboard/master-data/new" className="text-primary hover:underline text-sm">
              Create your first group →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/dashboard/master-data/${row.id}`} className="text-primary hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.code}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                      {row.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.isSystem ? (
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">System</span>
                      ) : (
                        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">Custom</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[row.status] || ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row._count?.items ?? 0}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link href={`/dashboard/master-data/${row.id}`} className="text-primary hover:underline text-xs">View</Link>
                      <Link href={`/dashboard/master-data/${row.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                      {!row.isSystem && (
                        <button
                          onClick={() => handleDelete(row.id, row.name)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Showing {((meta.page - 1) * meta.pageSize) + 1} to {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded px-3 py-1 text-sm ${p === page ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
