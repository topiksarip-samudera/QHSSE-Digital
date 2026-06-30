'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetInspectionsPage() {
  const [records, setRecords] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string|null>(null);
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  const [filterResult, setFilterResult] = useState('');
  const [form, setForm] = useState<any>({ title:'', assetId:'', inspectionType:'VISUAL', result:'pass', scheduledDate:'', completedDate:'', inspectorId:'', finding:'', notes:'' });
  const [assets, setAssets] = useState<any[]>([]); const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => { try { const r = await assetApi.getInspections({ search, page, limit:20, result:filterResult||undefined }); setRecords(r.data.data.data); setMeta(r.data.data.meta); } catch(e){ console.error(e); } finally { setLoading(false); } }, [search, page, filterResult]);
  const fetchAssets = useCallback(async () => { try { const r = await assetApi.getAssets({ limit:100 }); setAssets(r.data.data.data||[]); } catch(e){} }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const openCreate = () => { setEditId(null); setForm({ title:'', assetId:'', inspectionType:'VISUAL', result:'pass', scheduledDate:'', completedDate:'', inspectorId:'', finding:'', notes:'' }); setShowForm(true); };
  const openEdit = (r:any) => { setEditId(r.id); setForm({ title:r.title, assetId:r.assetId, inspectionType:r.inspectionType, result:r.result, scheduledDate:r.scheduledDate?.split('T')[0]||'', completedDate:r.completedDate?.split('T')[0]||'', inspectorId:r.inspectorId, finding:r.finding||'', notes:r.notes||'' }); setShowForm(true); };

  const save = async () => { setSaving(true); try { const payload = { ...form, completedDate:form.completedDate||undefined, finding:form.finding||undefined, notes:form.notes||undefined }; if (editId) { await assetApi.updateInspection(editId, payload); } else { await assetApi.createInspection(payload); } setShowForm(false); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } finally { setSaving(false); } };

  const remove = async (id:string) => { if(!confirm('Delete?')) return; try { await assetApi.deleteInspection(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Inspections</h1><p className="text-gray-600 mt-1">Manage asset inspection records</p></div><button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Inspection</button></div>
      <div className="flex gap-2"><input type="text" placeholder="Search..." value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg flex-1" /><select value={filterResult} onChange={(e)=>{setFilterResult(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg"><option value="">All Results</option><option value="pass">Pass</option><option value="fail">Fail</option><option value="conditional">Conditional</option></select></div>
      {records.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No inspections found.</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Asset</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Inspector</th><th className="px-4 py-3 font-medium">Scheduled</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody>{records.map((r:any)=>(<tr key={r.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-medium">{r.title}</td><td className="px-4 py-3">{r.asset?.name||'-'}</td><td className="px-4 py-3">{r.inspectionType}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${r.result==='pass'?'bg-green-100 text-green-800':r.result==='fail'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}>{r.result}</span></td><td className="px-4 py-3">{r.inspectorId}</td><td className="px-4 py-3">{r.scheduledDate?new Date(r.scheduledDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><button onClick={()=>openEdit(r)} className="text-blue-600 hover:text-blue-800 mr-2 text-xs">Edit</button><button onClick={()=>remove(r.id)} className="text-red-600 hover:text-red-800 text-xs">Del</button></td></tr>))}</tbody></table>
          {meta.totalPages>1&&<div className="flex justify-between items-center px-4 py-3 border-t"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm text-gray-500">Page {page} of {meta.totalPages}</span><button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div>}
        </div>
      )}
      {showForm&&<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-lg font-semibold mb-4">{editId?'Edit Inspection':'New Inspection'}</h2><div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Title *</label><input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Asset *</label><select value={form.assetId} onChange={(e)=>setForm({...form,assetId:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">Select asset...</option>{assets.map((a:any)=>(<option key={a.id} value={a.id}>{a.assetNumber} - {a.name}</option>))}</select></div>
        <div><label className="block text-sm font-medium mb-1">Type *</label><select value={form.inspectionType} onChange={(e)=>setForm({...form,inspectionType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="VISUAL">Visual</option><option value="FUNCTIONAL">Functional</option><option value="THOROUGH">Thorough</option><option value="REGULATORY">Regulatory</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Result</label><select value={form.result} onChange={(e)=>setForm({...form,result:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="pass">Pass</option><option value="fail">Fail</option><option value="conditional">Conditional Pass</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Scheduled Date *</label><input type="date" value={form.scheduledDate} onChange={(e)=>setForm({...form,scheduledDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Completed Date</label><input type="date" value={form.completedDate} onChange={(e)=>setForm({...form,completedDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Inspector *</label><input value={form.inspectorId} onChange={(e)=>setForm({...form,inspectorId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Finding</label><textarea value={form.finding} onChange={(e)=>setForm({...form,finding:e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
      </div><div className="flex gap-3 mt-6"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving?'Saving...':(editId?'Update':'Create')}</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div></div></div>}
    </div>
  );
}
