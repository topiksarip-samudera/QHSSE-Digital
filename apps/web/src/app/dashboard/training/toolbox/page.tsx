'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function ToolboxPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ topic: '', date: '', facilitator: '', location: '', attendeesCount: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

  const load = async () => { setLoading(true); try { const r = await trainingApi.getToolboxMeetings(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const viewDetail = async (id: string) => { setViewId(id); const r = await trainingApi.getToolboxMeeting(id); setDetail(r.data); };
  const save = async () => { try { if (editId) await trainingApi.updateToolboxMeeting(editId, form); else await trainingApi.createToolboxMeeting(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteToolboxMeeting(id); load(); } };
  const edit = (r: any) => { setForm({ ...r, date: r.date?.slice(0,10)||'' }); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Toolbox Meetings</h1><button onClick={()=>{setForm({});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ New Meeting</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input placeholder="Topic" value={form.topic||''} onChange={e=>setForm({...form,topic:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.date||''} onChange={e=>setForm({...form,date:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input placeholder="Facilitator" value={form.facilitator||''} onChange={e=>setForm({...form,facilitator:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Location" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input type="number" placeholder="Attendees Count" value={form.attendeesCount||''} onChange={e=>setForm({...form,attendeesCount:Number(e.target.value)})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <textarea placeholder="Notes" value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2}/>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {viewId && detail && (
        <div className="bg-white rounded-lg shadow p-4"><div className="flex justify-between mb-3"><h2 className="text-lg font-semibold">{detail.topic}</h2><button onClick={()=>setViewId(null)} className="text-gray-500">Close</button></div><p className="text-sm text-gray-600">{new Date(detail.date).toLocaleDateString()} | Facilitator: {detail.facilitator||'-'} | Location: {detail.location||'-'}</p><p className="text-sm text-gray-600">Attendees: {detail.attendeesCount||0}</p><p className="text-sm text-gray-600 mt-2">{detail.notes||'-'}</p></div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length===0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No toolbox meetings.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Topic</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Facilitator</th><th className="text-left px-4 py-3">Location</th><th className="text-left px-4 py-3">Attendees</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3"><button onClick={()=>viewDetail(r.id)} className="text-blue-600 hover:underline">{r.topic}</button></td><td className="px-4 py-3">{r.date?new Date(r.date).toLocaleDateString():'-'}</td><td className="px-4 py-3">{r.facilitator||'-'}</td><td className="px-4 py-3">{r.location||'-'}</td><td className="px-4 py-3">{r.attendeesCount||0}</td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
