'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';

const severityColors: Record<string,string> = { minor:'bg-yellow-100 text-yellow-800', major:'bg-orange-100 text-orange-800', critical:'bg-red-100 text-red-800' };
const statusColors: Record<string,string> = { draft:'bg-gray-100 text-gray-700', submitted:'bg-blue-100 text-blue-700', in_review:'bg-purple-100 text-purple-700', verified:'bg-green-100 text-green-700', closed:'bg-gray-200 text-gray-500' };

export default function NcrPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', ncrType:'PRODUCT', severity:'minor', reportedBy:'' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getNcrs(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createNcr(form); setShowForm(false); setForm({ title:'', ncrType:'PRODUCT', severity:'minor', reportedBy:'' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  const handleAction = async (id:string, action:string) => { try { const map:any={submit:()=>qualityApi.submitNcr(id),review:()=>qualityApi.reviewNcr(id),verify:()=>qualityApi.verifyNcr(id),close:()=>qualityApi.closeNcr(id)}; const fn = map[action]; if(fn) await fn(); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Nonconformance Records (NCR)</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New NCR'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">NCR Type</label><select value={form.ncrType} onChange={e=>setForm({...form,ncrType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="PRODUCT">Product</option><option value="PROCESS">Process</option><option value="MATERIAL">Material</option><option value="SYSTEM">System</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Severity</label><select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="minor">Minor</option><option value="major">Major</option><option value="critical">Critical</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Reported By</label><input value={form.reportedBy} onChange={e=>setForm({...form,reportedBy:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create NCR</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm text-gray-500">{d.ncrType}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${severityColors[d.severity]||''}`}>{d.severity}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td><td className="px-4 py-3"><div className="flex gap-1">{d.status==='draft'&&<button onClick={()=>handleAction(d.id,'submit')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Submit</button>}{d.status==='submitted'&&<button onClick={()=>handleAction(d.id,'review')} className="px-2 py-1 bg-purple-500 text-white rounded text-xs">Review</button>}{d.status==='in_review'&&<button onClick={()=>handleAction(d.id,'verify')} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Verify</button>}{(d.status==='verified'||d.status==='in_review')&&<button onClick={()=>handleAction(d.id,'close')} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">Close</button>}</div></td></tr>))}</tbody></table></div>
    </div>
  );
}
