'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function TrainingPlansPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ title: '', typeId: '', facilitator: '', venue: '', startDate: '', endDate: '', maxParticipants: '', status: 'planned' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

  const load = async () => { setLoading(true); try { const r = await trainingApi.getPlans(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const viewDetail = async (id: string) => { setViewId(id); const r = await trainingApi.getPlan(id); setDetail(r.data); };
  const save = async () => { try { if (editId) await trainingApi.updatePlan(editId, form); else await trainingApi.createPlan(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deletePlan(id); load(); } };
  const edit = (r: any) => { setForm({ ...r, startDate: r.startDate?.slice(0,10)||'', endDate: r.endDate?.slice(0,10)||'' }); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Training Plans</h1><button onClick={()=>{setForm({status:'planned'});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ New Plan</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input placeholder="Title" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Facilitator" value={form.facilitator||''} onChange={e=>setForm({...form,facilitator:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input placeholder="Venue" value={form.venue||''} onChange={e=>setForm({...form,venue:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.startDate||''} onChange={e=>setForm({...form,startDate:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input type="date" value={form.endDate||''} onChange={e=>setForm({...form,endDate:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input type="number" placeholder="Max Participants" value={form.maxParticipants||''} onChange={e=>setForm({...form,maxParticipants:Number(e.target.value)})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <select value={form.status||'planned'} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="planned">Planned</option><option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
          </select>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {viewId && detail && (
        <div className="bg-white rounded-lg shadow p-4"><div className="flex justify-between mb-3"><h2 className="text-lg font-semibold">{detail.title}</h2><button onClick={()=>setViewId(null)} className="text-gray-500">Close</button></div><p className="text-sm text-gray-600">Facilitator: {detail.facilitator||'-'} | Venue: {detail.venue||'-'}</p><p className="text-sm text-gray-600">Start: {detail.startDate?new Date(detail.startDate).toLocaleDateString():'-'} | End: {detail.endDate?new Date(detail.endDate).toLocaleDateString():'-'}</p><p className="text-sm text-gray-600">Status: <span className="px-2 py-0.5 bg-yellow-100 rounded text-xs">{detail.status}</span></p>{detail.sessions?.length > 0 && (<div className="mt-3"><h3 className="text-sm font-medium mb-1">Sessions ({detail.sessions.length})</h3>{detail.sessions.map((s:any)=>(<div key={s.id} className="text-xs text-gray-500 py-1 border-t">{new Date(s.actualDate).toLocaleString()} - {s.status} - {s.facilitator||'-'}</div>))}</div>)}</div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No training plans.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Title</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Start</th><th className="text-left px-4 py-3">Facilitator</th><th className="text-left px-4 py-3">Sessions</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3"><button onClick={()=>viewDetail(r.id)} className="text-blue-600 hover:underline">{r.title}</button></td><td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{r.status}</span></td><td className="px-4 py-3">{r.startDate?new Date(r.startDate).toLocaleDateString():'-'}</td><td className="px-4 py-3">{r.facilitator||'-'}</td><td className="px-4 py-3">{r.sessions?.length||0}</td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
