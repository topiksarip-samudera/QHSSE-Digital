'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const statusColors: Record<string,string> = { open:'bg-yellow-100 text-yellow-800', in_progress:'bg-blue-100 text-blue-700', completed:'bg-green-100 text-green-700', verified:'bg-purple-100 text-purple-700', closed:'bg-gray-200 text-gray-500' };

export default function CapaPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', capaType:'CORRECTIVE', description:'' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getCapas(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createCapa(form); setShowForm(false); setForm({ title:'', capaType:'CORRECTIVE', description:'' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  const handleVerify = async (id:string) => { try { await qualityApi.verifyCapa(id); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">CAPA Records</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New CAPA'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">CAPA Type</label><select value={form.capaType} onChange={e=>setForm({...form,capaType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="CORRECTIVE">Corrective</option><option value="PREVENTIVE">Preventive</option><option value="CORRECTION">Immediate Correction</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create CAPA</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Due Date</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm text-gray-500">{d.capaType}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td><td className="px-4 py-3 text-sm text-gray-500">{d.dueDate?new Date(d.dueDate).toLocaleDateString():'-'}</td><td className="px-4 py-3">{d.status==='completed'&&<button onClick={()=>handleVerify(d.id)} className="px-2 py-1 bg-purple-500 text-white rounded text-xs">Verify</button>}</td></tr>))}</tbody></table></div>
    </div>
  );
}
