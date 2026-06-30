'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const sevColors: Record<string,string> = { minor:'bg-yellow-100 text-yellow-800', major:'bg-orange-100 text-orange-800', critical:'bg-red-100 text-red-800' };
const statusColors: Record<string,string> = { open:'bg-yellow-100 text-yellow-800', in_progress:'bg-blue-100 text-blue-700', resolved:'bg-green-100 text-green-700', closed:'bg-gray-200 text-gray-500' };

export default function DefectsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', defectType:'DIMENSIONAL', severity:'minor', foundDate:'', foundBy:'' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getDefects(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createDefect({...form, foundDate: form.foundDate||new Date().toISOString().split('T')[0]}); setShowForm(false); setForm({ title:'', defectType:'DIMENSIONAL', severity:'minor', foundDate:'', foundBy:'' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Defect Records</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Defect'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Defect Type</label><select value={form.defectType} onChange={e=>setForm({...form,defectType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="DIMENSIONAL">Dimensional</option><option value="COSMETIC">Cosmetic/Surface</option><option value="FUNCTIONAL">Functional</option><option value="ELECTRICAL">Electrical</option><option value="STRUCTURAL">Structural</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Severity</label><select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="minor">Minor</option><option value="major">Major</option><option value="critical">Critical</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Found By</label><input value={form.foundBy} onChange={e=>setForm({...form,foundBy:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create Defect</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Found By</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm text-gray-500">{d.defectType}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${sevColors[d.severity]||''}`}>{d.severity}</span></td><td className="px-4 py-3 text-sm">{d.foundBy}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
