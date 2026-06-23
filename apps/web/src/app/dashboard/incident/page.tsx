'use client'; import { useState, useEffect, useCallback } from 'react'; import { useRouter } from 'next/navigation'; import Link from 'next/link'; import { incidentReportApi } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { draft: 'bg-gray-100 text-gray-800', submitted: 'bg-blue-100 text-blue-800', under_review: 'bg-yellow-100 text-yellow-800', investigation: 'bg-purple-100 text-purple-800', rca_completed: 'bg-indigo-100 text-indigo-800', capa_in_progress: 'bg-orange-100 text-orange-800', closed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

export default function IncidentListPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState(''); const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await incidentReportApi.getIncidents({ page, limit: 20, status: status || undefined, search: search || undefined }); setIncidents(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page, status, search]);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Incidents</h1><p className="text-gray-600 mt-1">Manage incident reports</p></div><Link href="/dashboard/incident/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Report Incident</Link></div>
      <div className="flex gap-3 items-center"><input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="px-3 py-2 border rounded-lg text-sm w-48" /><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Status</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="under_review">Under Review</option><option value="closed">Closed</option></select></div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : incidents.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No incidents</p><Link href="/dashboard/incident/new" className="text-blue-600 hover:underline text-sm">Report an incident</Link></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{incidents.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/incident/${i.id}`)}><td className="px-4 py-3 text-sm font-mono text-gray-600">{i.number || `Draft-${i.id.slice(0, 8)}`}</td><td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{i.title}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[i.status] || ''}`}>{i.status.replace('_', ' ')}</span></td><td className="px-4 py-3 text-sm text-gray-500">{new Date(i.incidentDate).toLocaleDateString()}</td><td className="px-4 py-3 text-sm text-gray-500">{i.siteId || '-'}</td></tr>))}</tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
