'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { numberingApi, NumberingRule } from '@/lib/api';
import Link from 'next/link';

export default function NumberingListPage() {
  const router = useRouter();
  const [rules, setRules] = useState<NumberingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1); const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(''); const [moduleFilter, setModuleFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await numberingApi.getRules({ page, limit: 20, search: search || undefined, moduleCode: moduleFilter || undefined });
      setRules(res.data.data || []); setTotalPages(res.data.meta?.totalPages || 1); setTotal(res.data.meta?.total || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [page, search, moduleFilter]);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Numbering Rules</h1><p className="text-gray-600 mt-1">Configure auto-numbering formats</p></div>
        <Link href="/dashboard/numbering/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Rule</Link>
      </div>
      <div className="flex gap-3 items-center">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="px-3 py-2 border rounded-lg text-sm w-48" />
        <input type="text" value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }} placeholder="Module code" className="px-3 py-2 border rounded-lg text-sm w-40" />
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : rules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No rules found</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reset</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counter</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/numbering/${r.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{r.moduleCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{r.sample}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{r.resetBy || '-'}</td>
                  <td className="px-4 py-3">{r.isActive ? <span className="text-green-600 text-xs">✓</span> : <span className="text-red-400 text-xs">✗</span>}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.counters?.[0]?.counter ?? 0}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}><button onClick={() => { if (confirm('Delete?')) numberingApi.deleteRule(r.id).then(fetchData); }} className="text-sm text-red-600 hover:underline">Delete</button></td>
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
