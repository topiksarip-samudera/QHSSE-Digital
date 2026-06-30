'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const RESULT_COLORS: Record<string, string> = { compliant: 'bg-green-100 text-green-800', non_compliant: 'bg-red-100 text-red-800', partially_compliant: 'bg-yellow-100 text-yellow-800', not_applicable: 'bg-gray-100 text-gray-800' };

export default function AssessmentsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [score, setScore] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ obligationId: '', regulationId: '', result: 'compliant', notes: '' });

  const fetchData = useCallback(async () => { setLoading(true); try { const [ar, sr] = await Promise.all([legalApi.getAssessments({ page, limit: 20 }), legalApi.getScore()]); setItems(ar.data.data||[]); setTotalPages(ar.data.meta?.totalPages||1); setScore(sr.data.data); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => { try { await legalApi.createAssessment(form); setShowForm(false); setForm({ obligationId: '', regulationId: '', result: 'compliant', notes: '' }); fetchData(); } catch (e: any) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Compliance Assessments</h1><p className="text-gray-600 mt-1">Periodic compliance evaluation</p></div><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Assessment</button></div>

      {score&&(<div className="grid grid-cols-4 gap-4">{[
        { label: 'Compliance %', value: `${score.percentage}%`, color: 'bg-blue-100' },
        { label: 'Compliant', value: score.compliant, color: 'bg-green-100' },
        { label: 'Non-Compliant', value: score.nonCompliant, color: 'bg-red-100' },
        { label: 'Partially', value: score.partially, color: 'bg-yellow-100' },
      ].map((s,i)=>(<div key={i} className={`${s.color} rounded-lg p-4 text-center`}><div className="text-2xl font-bold">{s.value}</div><div className="text-xs mt-1">{s.label}</div></div>))}</div>)}

      {showForm&&(<div className="bg-white rounded-lg shadow p-6 space-y-4"><h3 className="font-semibold">New Assessment</h3><div className="grid gap-3 md:grid-cols-2"><input className="px-3 py-2 border rounded-lg text-sm" placeholder="Obligation ID" value={form.obligationId} onChange={e=>setForm({...form,obligationId:e.target.value})} /><input className="px-3 py-2 border rounded-lg text-sm" placeholder="Regulation ID" value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})} /><select className="px-3 py-2 border rounded-lg text-sm" value={form.result} onChange={e=>setForm({...form,result:e.target.value})}><option value="compliant">Compliant</option><option value="non_compliant">Non-Compliant</option><option value="partially_compliant">Partially Compliant</option><option value="not_applicable">Not Applicable</option></select></div><textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} /><div className="flex gap-2"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div></div>)}

      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:items.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No assessments</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessed By</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th></tr></thead><tbody className="divide-y divide-gray-200">{items.map((a:any)=>(<tr key={a.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm">{new Date(a.assessedDate).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${RESULT_COLORS[a.result]||'bg-gray-100'}`}>{a.result.replace(/_/g,' ')}</span></td><td className="px-4 py-3 text-sm text-gray-500">{a.assessedBy}</td><td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{a.notes||'-'}</td><td className="px-4 py-3 text-sm">{a.actionRequired?'Yes':'No'}</td></tr>))}</tbody></table>
          {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
