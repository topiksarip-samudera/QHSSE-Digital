'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const resultColors: Record<string,string> = { accept:'bg-green-100 text-green-800', reject:'bg-red-100 text-red-800', conditional:'bg-yellow-100 text-yellow-800' };

export default function SupplierPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', supplierName:'', receivingDate:'', materialType:'', result:'accept' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getSupplierQuality(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createSupplierQuality({...form, receivingDate: form.receivingDate||new Date().toISOString().split('T')[0]}); setShowForm(false); setForm({ title:'', supplierName:'', receivingDate:'', materialType:'', result:'accept' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Supplier Quality</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Record'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Supplier Name</label><input value={form.supplierName} onChange={e=>setForm({...form,supplierName:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Receiving Date</label><input type="date" value={form.receivingDate} onChange={e=>setForm({...form,receivingDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Material Type</label><input value={form.materialType} onChange={e=>setForm({...form,materialType:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Result</label><select value={form.result} onChange={e=>setForm({...form,result:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="accept">Accept</option><option value="reject">Reject</option><option value="conditional">Conditional</option></select></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create Record</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Supplier</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Material</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Inspected</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Defects</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Result</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm">{d.supplierName}</td><td className="px-4 py-3 text-sm text-gray-500">{d.materialType}</td><td className="px-4 py-3 text-sm">{d.inspectedQty}</td><td className="px-4 py-3 text-sm">{d.defectQty}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${resultColors[d.result]||''}`}>{d.result}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
