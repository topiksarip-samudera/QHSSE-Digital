'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetRegisterPage() {
  const [assets, setAssets] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string|null>(null);
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  const [form, setForm] = useState<any>({ name:'', assetNumber:'', categoryId:'', description:'', serialNumber:'', manufacturer:'', model:'', locationId:'', ownershipType:'owned', status:'active', criticalityLevel:'', riskClassification:'', statutoryFlag:false });
  const [categories, setCategories] = useState<any[]>([]); const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => { try { const r = await assetApi.getAssets({ search, page, limit:20 }); setAssets(r.data.data.data); setMeta(r.data.data.meta); } catch(e){ console.error(e); } finally { setLoading(false); } }, [search, page]);
  const fetchCategories = useCallback(async () => { try { const r = await assetApi.getCategories(); setCategories(r.data.data||[]); } catch(e){} }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setEditId(null); setForm({ name:'', assetNumber:'', categoryId:'', description:'', serialNumber:'', manufacturer:'', model:'', locationId:'', ownershipType:'owned', status:'active', criticalityLevel:'', riskClassification:'', statutoryFlag:false }); setShowForm(true); };
  const openEdit = (a:any) => { setEditId(a.id); setForm({ name:a.name, assetNumber:a.assetNumber, categoryId:a.categoryId, description:a.description||'', serialNumber:a.serialNumber||'', manufacturer:a.manufacturer||'', model:a.model||'', locationId:a.locationId||'', ownershipType:a.ownershipType, status:a.status, criticalityLevel:a.criticalityLevel||'', riskClassification:a.riskClassification||'', statutoryFlag:a.statutoryFlag }); setShowForm(true); };

  const save = async () => { setSaving(true); try { if (editId) { await assetApi.updateAsset(editId, { name:form.name, categoryId:form.categoryId, description:form.description||undefined, serialNumber:form.serialNumber||undefined, manufacturer:form.manufacturer||undefined, model:form.model||undefined, locationId:form.locationId||undefined, ownershipType:form.ownershipType, status:form.status, criticalityLevel:form.criticalityLevel||undefined, riskClassification:form.riskClassification||undefined, statutoryFlag:form.statutoryFlag }); } else { await assetApi.createAsset(form); } setShowForm(false); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } finally { setSaving(false); } };

  const remove = async (id:string) => { if(!confirm('Delete this asset?')) return; try { await assetApi.deleteAsset(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Asset Register</h1><p className="text-gray-600 mt-1">Manage all assets and equipment</p></div><button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Asset</button></div>
      <div className="flex gap-2"><input type="text" placeholder="Search assets..." value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg flex-1" /></div>
      {assets.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No assets found.</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium">Asset #</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Criticality</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody>{assets.map((a:any)=>(<tr key={a.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-mono">{a.assetNumber}</td><td className="px-4 py-3 font-medium">{a.name}</td><td className="px-4 py-3">{a.category?.name||'-'}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status==='active'?'bg-green-100 text-green-800':a.status==='inactive'?'bg-gray-100 text-gray-800':'bg-yellow-100 text-yellow-800'}`}>{a.status}</span></td><td className="px-4 py-3">{a.criticalityLevel||'-'}</td><td className="px-4 py-3"><button onClick={()=>openEdit(a)} className="text-blue-600 hover:text-blue-800 mr-2 text-xs">Edit</button><button onClick={()=>remove(a.id)} className="text-red-600 hover:text-red-800 text-xs">Delete</button></td></tr>))}</tbody></table>
          {meta.totalPages>1&&<div className="flex justify-between items-center px-4 py-3 border-t"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm text-gray-500">Page {page} of {meta.totalPages}</span><button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div>}
        </div>
      )}
      {showForm&&<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-lg font-semibold mb-4">{editId?'Edit Asset':'New Asset'}</h2><div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Asset Number *</label><input value={form.assetNumber} onChange={(e)=>setForm({...form,assetNumber:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Name *</label><input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
        <div><label className="block text-sm font-medium mb-1">Category *</label><select value={form.categoryId} onChange={(e)=>setForm({...form,categoryId:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">Select...</option>{categories.map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
        <div><label className="block text-sm font-medium mb-1">Serial Number</label><input value={form.serialNumber} onChange={(e)=>setForm({...form,serialNumber:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Manufacturer</label><input value={form.manufacturer} onChange={(e)=>setForm({...form,manufacturer:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Model</label><input value={form.model} onChange={(e)=>setForm({...form,model:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Ownership</label><select value={form.ownershipType} onChange={(e)=>setForm({...form,ownershipType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="owned">Owned</option><option value="leased">Leased</option><option value="rented">Rented</option><option value="borrowed">Borrowed</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option><option value="maintenance">Under Maintenance</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Criticality</label><select value={form.criticalityLevel} onChange={(e)=>setForm({...form,criticalityLevel:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">None</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Risk Class</label><select value={form.riskClassification} onChange={(e)=>setForm({...form,riskClassification:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">None</option><option value="LOW">Low</option><option value="MODERATE">Moderate</option><option value="HIGH">High</option><option value="EXTREME">Extreme</option></select></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={form.statutoryFlag} onChange={(e)=>setForm({...form,statutoryFlag:e.target.checked})} id="sf" /><label htmlFor="sf" className="text-sm">Statutory Equipment</label></div>
      </div><div className="flex gap-3 mt-6"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving?'Saving...':(editId?'Update':'Create')}</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div></div></div>}
    </div>
  );
}
