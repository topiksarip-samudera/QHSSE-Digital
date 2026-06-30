'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetTransfersPage() {
  const [records, setRecords] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<any>({ assetId:'', fromLocation:'', toLocation:'', fromCustodian:'', toCustodian:'', transferDate:'', reason:'' });
  const [assets, setAssets] = useState<any[]>([]); const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => { try { const r = await assetApi.getTransfers({ page, limit:20, status:filterStatus||undefined }); setRecords(r.data.data.data); setMeta(r.data.data.meta); } catch(e){ console.error(e); } finally { setLoading(false); } }, [page, filterStatus]);
  const fetchAssets = useCallback(async () => { try { const r = await assetApi.getAssets({ limit:100 }); setAssets(r.data.data.data||[]); } catch(e){} }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const openCreate = () => { setForm({ assetId:'', fromLocation:'', toLocation:'', fromCustodian:'', toCustodian:'', transferDate:'', reason:'' }); setShowForm(true); };

  const create = async () => { setSaving(true); try { await assetApi.createTransfer(form); setShowForm(false); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } finally { setSaving(false); } };
  const approve = async (id:string) => { try { await assetApi.approveTransfer(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };
  const reject = async (id:string) => { try { await assetApi.rejectTransfer(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };
  const complete = async (id:string) => { try { await assetApi.completeTransfer(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Transfers</h1><p className="text-gray-600 mt-1">Manage asset transfer requests</p></div><button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Transfer</button></div>
      <div className="flex gap-2"><select value={filterStatus} onChange={(e)=>{setFilterStatus(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg"><option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="completed">Completed</option></select></div>
      {records.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No transfers found.</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium">Asset</th><th className="px-4 py-3 font-medium">From</th><th className="px-4 py-3 font-medium">To</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody>{records.map((r:any)=>(<tr key={r.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3">{r.asset?.name||'-'}</td><td className="px-4 py-3">{r.fromLocation||'-'}</td><td className="px-4 py-3">{r.toLocation}</td><td className="px-4 py-3">{r.transferDate?new Date(r.transferDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${r.status==='completed'?'bg-green-100 text-green-800':r.status==='approved'?'bg-blue-100 text-blue-800':r.status==='rejected'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td><td className="px-4 py-3">{r.status==='pending'&&<><button onClick={()=>approve(r.id)} className="text-green-600 hover:text-green-800 mr-2 text-xs">Approve</button><button onClick={()=>reject(r.id)} className="text-red-600 hover:text-red-800 mr-2 text-xs">Reject</button></>}{r.status==='approved'&&<button onClick={()=>complete(r.id)} className="text-blue-600 hover:text-blue-800 text-xs">Complete</button>}</td></tr>))}</tbody></table>
          {meta.totalPages>1&&<div className="flex justify-between items-center px-4 py-3 border-t"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm text-gray-500">Page {page} of {meta.totalPages}</span><button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div>}
        </div>
      )}
      {showForm&&<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl"><h2 className="text-lg font-semibold mb-4">New Transfer</h2><div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Asset *</label><select value={form.assetId} onChange={(e)=>setForm({...form,assetId:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">Select asset...</option>{assets.map((a:any)=>(<option key={a.id} value={a.id}>{a.assetNumber} - {a.name}</option>))}</select></div>
        <div><label className="block text-sm font-medium mb-1">From Location</label><input value={form.fromLocation} onChange={(e)=>setForm({...form,fromLocation:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">To Location *</label><input value={form.toLocation} onChange={(e)=>setForm({...form,toLocation:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">From Custodian</label><input value={form.fromCustodian} onChange={(e)=>setForm({...form,fromCustodian:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">To Custodian</label><input value={form.toCustodian} onChange={(e)=>setForm({...form,toCustodian:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Transfer Date *</label><input type="date" value={form.transferDate} onChange={(e)=>setForm({...form,transferDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Reason</label><input value={form.reason} onChange={(e)=>setForm({...form,reason:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
      </div><div className="flex gap-3 mt-6"><button onClick={create} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving?'Creating...':'Create Transfer'}</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div></div></div>}
    </div>
  );
}
