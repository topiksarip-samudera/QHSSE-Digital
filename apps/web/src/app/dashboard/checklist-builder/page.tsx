'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checklistApi, ChecklistData } from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800', active: 'bg-green-100 text-green-800', archived: 'bg-yellow-100 text-yellow-800',
};

export default function ChecklistListPage() {
  const router = useRouter();
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1); const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(''); const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await checklistApi.getChecklists({ page, limit: 20, search: search || undefined, status: statusFilter || undefined });
      setChecklists(res.data.data || []); setTotalPages(res.data.meta?.totalPages || 1); setTotal(res.data.meta?.total || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Checklist Builder</h1><p className="text-gray-600 mt-1">Design and manage inspection checklists</p></div>
        <Link href="/dashboard/checklist-builder/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Checklist</Link>
      </div>
      <div className="flex gap-3 items-center">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search checklists..." className="px-3 py-2 border rounded-lg text-sm w-48" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Status</option><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option>
        </select>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : checklists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No checklists found</p><p className="text-gray-400 text-sm mt-1">Create your first checklist to get started</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Score</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responses</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {checklists.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/checklist-builder/${c.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{c.name}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status] || ''}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">v{c.version}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.passScore ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c._count?.sections || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c._count?.responses || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}><button onClick={() => { if (confirm('Delete?')) checklistApi.deleteChecklist(c.id).then(fetchData); }} className="text-sm text-red-600 hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><p className="text-xs text-gray-500">{total} total</p><div className="flex gap-2"><button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
