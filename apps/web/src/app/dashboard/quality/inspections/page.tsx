'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const statusColors: Record<string,string> = { draft:'bg-gray-100 text-gray-700', approved:'bg-blue-100 text-blue-700', active:'bg-green-100 text-green-700' };

export default function InspectionsPage() {
  const [data, setData] = useState<any[]>([]); const [results, setResults] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [showResultForm, setShowResultForm] = useState(false); const [selectedItp, setSelectedItp] = useState<string>('');
  const [form, setForm] = useState<any>({ title:'', itpNumber:'', description:'' });
  const [resultForm, setResultForm] = useState<any>({ inspectionPoint:'', criteria:'', inspectorId:'', inspectedAt:'', passFail:'pass' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getItps(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreateItp = async () => { try { await qualityApi.createItp(form); setShowForm(false); setForm({ title:'', itpNumber:'', description:'' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  const handleCreateResult = async () => { try { await qualityApi.createInspectionResult({...resultForm, itpId: selectedItp, inspectedAt: resultForm.inspectedAt||new Date().toISOString()}); setShowResultForm(false); setResultForm({ inspectionPoint:'', criteria:'', inspectorId:'', inspectedAt:'', passFail:'pass' }); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  const loadResults = async (itpId:string) => { try { const r = await qualityApi.getResultsByItp(itpId); setResults(r.data||[]); setSelectedItp(itpId); } catch(e){console.error(e)} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Inspection & ITP</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New ITP'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">ITP Number</label><input value={form.itpNumber} onChange={e=>setForm({...form,itpNumber:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleCreateItp} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create ITP</button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4"><h2 className="font-semibold mb-3">ITP List</h2><div className="space-y-2">{data.map((d:any)=>(<div key={d.id} onClick={()=>loadResults(d.id)} className={`p-3 rounded-lg cursor-pointer border ${selectedItp===d.id?'border-blue-500 bg-blue-50':'border-gray-200 hover:bg-gray-50'}`}><div className="text-sm font-medium">{d.title}</div><div className="text-xs text-gray-500">ITP: {d.itpNumber} | <span className={`${statusColors[d.status]||''} px-1 rounded`}>{d.status}</span></div></div>))}</div></div>
        <div className="bg-white rounded-lg shadow p-4"><div className="flex justify-between mb-3"><h2 className="font-semibold">Inspection Results</h2>{selectedItp&&<button onClick={()=>setShowResultForm(!showResultForm)} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Add Result</button>}</div>
          {showResultForm&&selectedItp&&(<div className="mb-4 p-4 bg-gray-50 rounded space-y-2"><input placeholder="Inspection Point" value={resultForm.inspectionPoint} onChange={e=>setResultForm({...resultForm,inspectionPoint:e.target.value})} className="w-full px-2 py-1 border rounded text-sm" /><input placeholder="Criteria" value={resultForm.criteria} onChange={e=>setResultForm({...resultForm,criteria:e.target.value})} className="w-full px-2 py-1 border rounded text-sm" /><input placeholder="Inspector ID" value={resultForm.inspectorId} onChange={e=>setResultForm({...resultForm,inspectorId:e.target.value})} className="w-full px-2 py-1 border rounded text-sm" /><select value={resultForm.passFail} onChange={e=>setResultForm({...resultForm,passFail:e.target.value})} className="w-full px-2 py-1 border rounded text-sm"><option value="pass">Pass</option><option value="fail">Fail</option></select><button onClick={handleCreateResult} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Save</button></div>)}
          {results.length===0?<p className="text-sm text-gray-500">Select an ITP to view results</p>:results.map((r:any)=>(<div key={r.id} className="p-2 border-b text-sm"><span className="font-medium">{r.inspectionPoint}</span> <span className="text-gray-500">— {r.criteria}</span> <span className={`ml-2 text-xs px-2 py-0.5 rounded ${r.passFail==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{r.passFail}</span></div>))}
        </div>
      </div>
    </div>
  );
}
