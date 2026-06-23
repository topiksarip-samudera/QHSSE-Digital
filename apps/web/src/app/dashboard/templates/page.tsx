'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { templateApi, TemplateData } from '@/lib/api';
import Link from 'next/link';

export default function TemplateListPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1); const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(''); const [typeFilter, setTypeFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await templateApi.getTemplates({ page, limit: 20, search: search || undefined, type: typeFilter || undefined });
      setTemplates(res.data.data || []); setTotalPages(res.data.meta?.totalPages || 1); setTotal(res.data.meta?.total || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [page, search, typeFilter]);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Template Management</h1><p className="text-gray-600 mt-1">Manage document, email, and report templates</p></div>
        <Link href="/dashboard/templates/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Template</Link>
      </div>
      <div className="flex gap-3 items-center">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="px-3 py-2 border rounded-lg text-sm w-48" />
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Types</option><option value="document">Document</option><option value="email">Email</option><option value="report">Report</option><option value="checklist">Checklist</option><option value="form">Form</option>
        </select>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No templates found</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/templates/${t.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{t.category?.name || '-'}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{t.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">v{t.version}</td>
                  <td className="px-4 py-3 text-xs">{t.isGlobal ? <span className="text-blue-600">Global</span> : <span className="text-gray-400">Company</span>}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}><button onClick={() => { if (confirm('Delete?')) templateApi.deleteTemplate(t.id).then(fetchData); }} className="text-sm text-red-600 hover:underline">Delete</button></td>
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
