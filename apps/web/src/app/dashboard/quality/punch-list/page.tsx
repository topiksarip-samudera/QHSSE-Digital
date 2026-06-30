'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const statusColors: Record<string,string> = { open:'bg-yellow-100 text-yellow-800', resolved:'bg-blue-100 text-blue-700', verified:'bg-green-100 text-green-700', closed:'bg-gray-200 text-gray-500' };
const priorityColors: Record<string,string> = { low:'bg-green-100 text-green-700', medium:'bg-yellow-100 text-yellow-700', high:'bg-orange-100 text-orange-700', critical:'bg-red-100 text-red-700' };

export default function PunchListPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', location:'', priority:'medium', targetDate:'' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getPunchLists(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createPunchList(form); setShowForm(false); setForm({ title:'', location:'', priority:'medium', targetDate:'' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Punch Lists</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Punch List'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Target Date</label><input type="date" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Priority</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm text-gray-500">{d.location||'-'}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${priorityColors[d.priority||'']}`}>{d.priority}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
