'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { open: 'bg-red-100 text-red-800', in_progress: 'bg-yellow-100 text-yellow-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' };
const IMPACT_COLORS: Record<string, string> = { low: 'bg-gray-100', medium: 'bg-yellow-100', high: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };

export default function GapsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [impact, setImpact] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ regulationId: '', gapDescription: '', impact: 'medium', remediationPlan: '', targetDate: '' });

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await legalApi.getGaps({ page, limit: 20, impact: impact||undefined }); setItems(r.data.data||[]); setTotalPages(r.data.meta?.totalPages||1); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page, impact]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => { try { await legalApi.createGap(form); setShowForm(false); setForm({ regulationId: '', gapDescription: '', impact: 'medium', remediationPlan: '', targetDate: '' }); fetchData(); } catch (e: any) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Gap Analysis</h1><p className="text-gray-600 mt-1">Identify and address compliance gaps</p></div><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Gap</button></div>

      <div className="flex gap-3"><select value={impact} onChange={(e)=>{setImpact(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Impact</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>

      {showForm&&(<div className="bg-white rounded-lg shadow p-6 space-y-4"><h3 className="font-semibold">New Gap Analysis</h3><div className="grid gap-3 md:grid-cols-2"><input className="px-3 py-2 border rounded-lg text-sm" placeholder="Regulation ID" value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})} /><select className="px-3 py-2 border rounded-lg text-sm" value={form.impact} onChange={e=>setForm({...form,impact:e.target.value})}><option value="low">Low Impact</option><option value="medium">Medium Impact</option><option value="high">High Impact</option><option value="critical">Critical Impact</option></select><input className="px-3 py-2 border rounded-lg text-sm" type="date" placeholder="Target Date" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})} /></div><textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Gap Description" value={form.gapDescription} onChange={e=>setForm({...form,gapDescription:e.target.value})} rows={2} /><textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Remediation Plan" value={form.remediationPlan} onChange={e=>setForm({...form,remediationPlan:e.target.value})} rows={2} /><div className="flex gap-2"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div></div>)}

      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:items.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No gaps</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead><tbody className="divide-y divide-gray-200">{items.map((g:any)=>(<tr key={g.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm max-w-xs truncate">{g.gapDescription}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${IMPACT_COLORS[g.impact]||'bg-gray-100'}`}>{g.impact}</span></td><td className="px-4 py-3 text-sm">{g.targetDate?new Date(g.targetDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[g.status]||'bg-gray-100'}`}>{g.status}</span></td></tr>))}</tbody></table>
          {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
