'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { masterDataApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export default function MasterDataGroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [itemsMeta, setItemsMeta] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const fetchGroup = useCallback(async () => {
    try {
      const res = await masterDataApi.getGroup(id);
      setGroup(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load group');
    }
  }, [id]);

  const fetchItems = useCallback(async () => {
    try {
      const params: Record<string, any> = { groupId: id, page, pageSize: 20 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await masterDataApi.listItems(params);
      setItems(res.data.data || []);
      setItemsMeta(res.data.meta || { page: 1, pageSize: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      // Items may be empty
    }
  }, [id, page, search, status]);

  useEffect(() => {
    Promise.all([fetchGroup(), fetchItems()]).then(() => setLoading(false));
  }, [fetchGroup, fetchItems]);

  const handleDeleteItem = async (itemId: string, name: string) => {
    if (!confirm(`Delete item "${name}"?`)) return;
    try {
      await masterDataApi.deleteItem(itemId);
      fetchItems();
      fetchGroup();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const handleRestoreItem = async (itemId: string) => {
    try {
      await masterDataApi.restoreItem(itemId);
      fetchItems();
      fetchGroup();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Restore failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!group) return <div className="p-8 text-center text-muted-foreground">Group not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/master-data" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Master Data
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {group.name}
              <code className="rounded bg-muted px-2 py-0.5 text-sm font-normal">{group.code}</code>
              {group.isSystem && (
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">System</span>
              )}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{group.description || 'No description'}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/master-data/${id}/edit`}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Edit Group
            </Link>
            <Link
              href={`/dashboard/master-data/${id}/items/new`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + Add Item
            </Link>
          </div>
        </div>
      </div>

      {/* Group Info Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Items</p>
          <p className="text-2xl font-bold">{group._count?.items ?? items.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Type</p>
          <p className="text-2xl font-bold">{group.isSystem ? 'System' : 'Custom'}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-2xl font-bold capitalize">{group.status}</p>
        </div>
      </div>

      {/* Items Filter */}
      <div className="mb-4 rounded-lg border bg-card p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search items..."
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

      {/* Items Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="mb-2">No items in this group</p>
            <Link href={`/dashboard/master-data/${id}/items/new`} className="text-primary hover:underline text-sm">
              Add your first item →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Parent</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{item.sortOrder ?? idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      {item.code ? <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.code}</code> : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.value || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.parent?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[item.status] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {item.status === 'inactive' || item.deletedAt ? (
                        <button onClick={() => handleRestoreItem(item.id)} className="text-green-600 hover:underline text-xs">Restore</button>
                      ) : (
                        <>
                          <Link href={`/dashboard/master-data/${id}/items/${item.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                          <button onClick={() => handleDeleteItem(item.id, item.name)} className="text-red-600 hover:underline text-xs">Archive</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {itemsMeta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Page {itemsMeta.page} of {itemsMeta.totalPages} ({itemsMeta.total} total)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= itemsMeta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
