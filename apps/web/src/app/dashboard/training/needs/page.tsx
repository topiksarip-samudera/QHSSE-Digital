'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function TrainingNeedsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ userId: '', sourceType: '', trainingTypeId: '', competencyGap: '', reason: '', priority: 'medium', status: 'open' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const r = await trainingApi.getNeeds(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const save = async () => { try { if (editId) await trainingApi.updateNeed(editId, form); else await trainingApi.createNeed(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteNeed(id); load(); } };
  const waive = async (id: string) => { if (confirm('Waive this training need?')) { await trainingApi.waiveNeed(id); load(); } };
  const edit = (r: any) => { setForm(r); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Training Needs</h1><button onClick={()=>{setForm({priority:'medium',status:'open'});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ Add Need</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input placeholder="User ID" value={form.userId||''} onChange={e=>setForm({...form,userId:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <select value={form.sourceType||''} onChange={e=>setForm({...form,sourceType:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="">Source Type</option><option value="performance_appraisal">Performance Appraisal</option><option value="job_change">Job Change</option><option value="incident">Incident</option><option value="audit_finding">Audit Finding</option><option value="regulatory">Regulatory</option><option value="management_review">Management Review</option><option value="self_assessment">Self-Assessment</option>
          </select>
          <input placeholder="Competency Gap" value={form.competencyGap||''} onChange={e=>setForm({...form,competencyGap:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input placeholder="Reason" value={form.reason||''} onChange={e=>setForm({...form,reason:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority||'medium'} onChange={e=>setForm({...form,priority:e.target.value})} className="px-3 py-2 border rounded-lg text-sm">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
            <select value={form.status||'open'} onChange={e=>setForm({...form,status:e.target.value})} className="px-3 py-2 border rounded-lg text-sm">
              <option value="open">Open</option><option value="planned">Planned</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No training needs.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Source</th><th className="text-left px-4 py-3">Gap</th><th className="text-left px-4 py-3">Priority</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3">{r.userId}</td><td className="px-4 py-3 capitalize">{String(r.sourceType).replace(/_/g,' ')}</td><td className="px-4 py-3">{r.competencyGap||'-'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.priority==='critical'?'bg-red-100 text-red-800':r.priority==='high'?'bg-orange-100 text-orange-800':'bg-gray-100 text-gray-800'}`}>{r.priority}</span></td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.status==='open'?'bg-blue-100 text-blue-800':r.status==='waived'?'bg-gray-100 text-gray-500':'bg-green-100 text-green-800'}`}>{r.status}</span></td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button>{r.status==='open'&&<button onClick={()=>waive(r.id)} className="text-yellow-600 hover:underline mr-2">Waive</button>}<button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
