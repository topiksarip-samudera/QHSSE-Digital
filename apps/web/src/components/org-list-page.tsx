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
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Link href={createHref} className="inline-flex items-center justify-center shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + {createLabel}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-lg border border-border bg-card p-3 sm:p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex flex-col sm:flex-row gap-2.5">
          <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {extraFilters}
          <button type="submit" className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">Search</button>
        </form>
      </div>

      {/* Error */}
      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {/* Table / Cards */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No data found</div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-border">
              {data.map((row) => (
                <div key={row.id} className="p-3 space-y-1.5">
                  {columns.map((col) => (
                    <div key={col.key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{col.label}</span>
                      <span className="text-foreground font-medium text-right">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                      </span>
                    </div>
                  ))}
                  <div className="flex gap-3 pt-1.5">
                    <Link href={`${basePath}/${row.id}`} className="text-primary text-xs font-medium">View</Link>
                    <Link href={`${basePath}/${row.id}/edit`} className="text-blue-600 text-xs font-medium">Edit</Link>
                    <button onClick={() => handleDelete(row.id)} className="text-destructive text-xs font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{col.label}</th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-foreground">
                          {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link href={`${basePath}/${row.id}`} className="text-primary hover:underline text-xs font-medium">View</Link>
                        <Link href={`${basePath}/${row.id}/edit`} className="text-blue-600 hover:underline text-xs font-medium">Edit</Link>
                        <button onClick={() => handleDelete(row.id)} className="text-destructive hover:underline text-xs font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border px-4 py-3 gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {((meta.page - 1) * meta.pageSize) + 1} to {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${p === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
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
