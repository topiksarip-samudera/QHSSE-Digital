'use client'; import { useState, useEffect, useCallback } from 'react'; import { useRouter } from 'next/navigation'; import Link from 'next/link'; import { riskReportApi } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { draft: 'bg-gray-100', submitted: 'bg-blue-100 text-blue-800', under_review: 'bg-yellow-100', approved: 'bg-green-100 text-green-800', active: 'bg-emerald-100', closed: 'bg-green-200', cancelled: 'bg-red-100' };
const LEVEL_COLORS: Record<string, string> = { L: 'bg-green-100 text-green-800', M: 'bg-yellow-100 text-yellow-800', H: 'bg-orange-100 text-orange-800', E: 'bg-red-100 text-red-800' };

export default function RiskListPage() {
  const router = useRouter();
  const [risks, setRisks] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState(''); const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await riskReportApi.getRisks({ page, limit: 20, status: status||undefined, search: search||undefined }); setRisks(r.data.data||[]); setTotalPages(r.data.meta?.totalPages||1); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page, status, search]);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Risk Register</h1><p className="text-gray-600 mt-1">Manage risk assessments</p></div><Link href="/dashboard/risk/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Risk</Link></div>
      <div className="flex gap-3"><input type="text" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="px-3 py-2 border rounded-lg text-sm w-48" /><select value={status} onChange={(e)=>{setStatus(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Status</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="active">Active</option></select></div>
      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:risks.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No risks</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th></tr></thead><tbody className="divide-y divide-gray-200">{risks.map((r:any)=>(<tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>router.push(`/dashboard/risk/${r.id}`)}><td className="px-4 py-3 text-sm font-mono">{r.riskNumber||`DR-${r.id.slice(0,8)}`}</td><td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{r.title}</td><td className="px-4 py-3">{r.initialRiskLevel?<span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLORS[r.initialRiskLevel]||''}`}>{r.initialRiskLevel}</span>:'-'}</td><td className="px-4 py-3 text-sm">{r.initialRiskScore||'-'}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[r.status]||'bg-gray-100'}`}>{r.status}</span></td><td className="px-4 py-3 text-sm text-gray-500">{r.riskOwnerId}</td></tr>))}</tbody></table>
        {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
