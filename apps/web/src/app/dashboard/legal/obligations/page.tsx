'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', in_progress: 'bg-yellow-100 text-yellow-800', compliant: 'bg-green-100 text-green-800', overdue: 'bg-red-100 text-red-800', closed: 'bg-gray-100 text-gray-800' };

export default function ObligationsListPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [regulations, setRegulations] = useState<any[]>([]);
  const [form, setForm] = useState({ regulationId: '', article: '', requirement: '', obligationType: 'mandatory', frequency: '', status: 'open' });

  const fetchData = useCallback(async () => { setLoading(true); try { const [or, rr] = await Promise.all([legalApi.getObligations({ page, limit: 20, status: status||undefined }), legalApi.getRegulations({ limit: 200 })]); setItems(or.data.data||[]); setTotalPages(or.data.meta?.totalPages||1); setRegulations(rr.data.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page, status]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => { try { await legalApi.createObligation(form); setShowForm(false); setForm({ regulationId: '', article: '', requirement: '', obligationType: 'mandatory', frequency: '', status: 'open' }); fetchData(); } catch (e: any) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Legal Obligations</h1><p className="text-gray-600 mt-1">Track compliance obligations</p></div><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Obligation</button></div>

      <div className="flex gap-3"><select value={status} onChange={(e)=>{setStatus(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="compliant">Compliant</option><option value="overdue">Overdue</option></select></div>

      {showForm&&(<div className="bg-white rounded-lg shadow p-6 space-y-4"><h3 className="font-semibold">New Obligation</h3><select className="w-full px-3 py-2 border rounded-lg text-sm" value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})}><option value="">Select Regulation</option>{regulations.map((r:any)=><option key={r.id} value={r.id}>{r.title}</option>)}</select><div className="grid gap-3 md:grid-cols-2"><input className="px-3 py-2 border rounded-lg text-sm" placeholder="Article/Clause" value={form.article} onChange={e=>setForm({...form,article:e.target.value})} /><select className="px-3 py-2 border rounded-lg text-sm" value={form.obligationType} onChange={e=>setForm({...form,obligationType:e.target.value})}><option value="mandatory">Mandatory</option><option value="voluntary">Voluntary</option><option value="recommended">Recommended</option></select><select className="px-3 py-2 border rounded-lg text-sm" value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}><option value="">Select Frequency</option><option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annually">Annually</option><option value="event-based">Event-Based</option></select></div><textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Requirement - What must be done?" value={form.requirement} onChange={e=>setForm({...form,requirement:e.target.value})} rows={2} /><div className="flex gap-2"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div></div>)}

      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:items.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No obligations</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regulation</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Article</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirement</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead><tbody className="divide-y divide-gray-200">{items.map((o:any)=>(<tr key={o.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm text-blue-600">{o.regulation?.title||'-'}</td><td className="px-4 py-3 text-sm font-mono">{o.article||'-'}</td><td className="px-4 py-3 text-sm max-w-xs truncate">{o.requirement}</td><td className="px-4 py-3 text-sm capitalize">{o.obligationType}</td><td className="px-4 py-3 text-sm">{o.frequency||'-'}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[o.status]||'bg-gray-100'}`}>{o.status}</span></td></tr>))}</tbody></table>
          {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
