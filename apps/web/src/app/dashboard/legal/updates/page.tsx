'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const IMPACT_COLORS: Record<string, string> = { low: 'bg-gray-100', medium: 'bg-yellow-100', high: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };

export default function UpdatesPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [schedule, setSchedule] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ regulationId: '', updateType: 'new_regulation', summary: '', impact: 'medium' });

  const fetchData = useCallback(async () => { setLoading(true); try { const [ur, sr] = await Promise.all([legalApi.getUpdateLogs({ page, limit: 20 }), legalApi.getReviewSchedule()]); setItems(ur.data.data||[]); setTotalPages(ur.data.meta?.totalPages||1); setSchedule(sr.data.data); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => { try { await legalApi.createUpdateLog(form); setShowForm(false); setForm({ regulationId: '', updateType: 'new_regulation', summary: '', impact: 'medium' }); fetchData(); } catch (e: any) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Regulatory Updates</h1><p className="text-gray-600 mt-1">Track regulatory changes and review schedule</p></div><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Update</button></div>

      {schedule&&(<div className="grid grid-cols-3 gap-4">{[{ label: 'Overdue', value: schedule.overdue?.length||0, color: 'bg-red-100 text-red-800' },{ label: 'Upcoming (30d)', value: schedule.upcoming?.length||0, color: 'bg-yellow-100 text-yellow-800' },{ label: 'Unreviewed Updates', value: schedule.unreviewedUpdates?.length||0, color: 'bg-blue-100 text-blue-800' }].map((s,i)=>(<div key={i} className={`${s.color} rounded-lg p-4 text-center`}><div className="text-2xl font-bold">{s.value}</div><div className="text-xs mt-1">{s.label}</div></div>))}</div>)}

      {showForm&&(<div className="bg-white rounded-lg shadow p-6 space-y-4"><h3 className="font-semibold">New Regulatory Update</h3><div className="grid gap-3 md:grid-cols-2"><input className="px-3 py-2 border rounded-lg text-sm" placeholder="Regulation ID" value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})} /><select className="px-3 py-2 border rounded-lg text-sm" value={form.updateType} onChange={e=>setForm({...form,updateType:e.target.value})}><option value="new_regulation">New Regulation</option><option value="amendment">Amendment</option><option value="repeal">Repeal</option><option value="guidance">Guidance</option><option value="enforcement">Enforcement</option></select><select className="px-3 py-2 border rounded-lg text-sm" value={form.impact} onChange={e=>setForm({...form,impact:e.target.value})}><option value="low">Low Impact</option><option value="medium">Medium Impact</option><option value="high">High Impact</option><option value="critical">Critical Impact</option></select></div><textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Summary of update" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} rows={3} /><div className="flex gap-2"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div></div>)}

      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:items.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No updates</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action Req</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead><tbody className="divide-y divide-gray-200">{items.map((u:any)=>(<tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm capitalize">{u.updateType.replace(/_/g,' ')}</td><td className="px-4 py-3 text-sm max-w-xs truncate">{u.summary}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${IMPACT_COLORS[u.impact]||'bg-gray-100'}`}>{u.impact}</span></td><td className="px-4 py-3 text-sm">{u.actionRequired?'Yes':'No'}</td><td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td></tr>))}</tbody></table>
          {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
