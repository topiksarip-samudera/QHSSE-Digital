'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface ListPageProps {
  title: string;
  description: string;
  createHref: string;
  createLabel: string;
  api: {
    list: (query?: Record<string, any>) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  columns: Column[];
  basePath: string;
  extraFilters?: React.ReactNode;
}

export default function OrgListPage({
  title, description, createHref, createLabel, api, columns, basePath, extraFilters,
}: ListPageProps) {
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
      const res = await api.list(params);
      setData(res.data.data || []);
      setMeta(res.data.meta || { page: 1, pageSize: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || `Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [api, page, search, status, title]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Link href={createHref} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + {createLabel}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex flex-wrap gap-3">
          <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-2 text-sm" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {extraFilters}
          <button type="submit" className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Search</button>
        </form>
      </div>

      {/* Error */}
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No data found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-medium text-muted-foreground">{col.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link href={`${basePath}/${row.id}`} className="text-primary hover:underline text-xs">View</Link>
                      <Link href={`${basePath}/${row.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                      <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Showing {((meta.page - 1) * meta.pageSize) + 1} to {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded px-3 py-1 text-sm ${p === page ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
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
