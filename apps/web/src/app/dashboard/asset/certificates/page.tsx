'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetCertificatesPage() {
  const [records, setRecords] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string|null>(null);
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<any>({ assetId:'', certificateType:'CALIBRATION', certificateNo:'', issuedBy:'', issueDate:'', expiryDate:'', attachmentUrl:'' });
  const [assets, setAssets] = useState<any[]>([]); const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => { try { const r = await assetApi.getCertificates({ search, page, limit:20, status:filterStatus||undefined }); setRecords(r.data.data.data); setMeta(r.data.data.meta); } catch(e){ console.error(e); } finally { setLoading(false); } }, [search, page, filterStatus]);
  const fetchAssets = useCallback(async () => { try { const r = await assetApi.getAssets({ limit:100 }); setAssets(r.data.data.data||[]); } catch(e){} }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const openCreate = () => { setEditId(null); setForm({ assetId:'', certificateType:'CALIBRATION', certificateNo:'', issuedBy:'', issueDate:'', expiryDate:'', attachmentUrl:'' }); setShowForm(true); };
  const openEdit = (r:any) => { setEditId(r.id); setForm({ assetId:r.assetId, certificateType:r.certificateType, certificateNo:r.certificateNo, issuedBy:r.issuedBy, issueDate:r.issueDate?.split('T')[0]||'', expiryDate:r.expiryDate?.split('T')[0]||'', attachmentUrl:r.attachmentUrl||'' }); setShowForm(true); };

  const save = async () => { setSaving(true); try { if (editId) { await assetApi.updateCertificate(editId, { certificateType:form.certificateType, issuedBy:form.issuedBy, issueDate:form.issueDate||undefined, expiryDate:form.expiryDate||undefined, attachmentUrl:form.attachmentUrl||undefined }); } else { await assetApi.createCertificate(form); } setShowForm(false); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } finally { setSaving(false); } };

  const verify = async (id:string) => { try { await assetApi.verifyCertificate(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };
  const remove = async (id:string) => { if(!confirm('Delete?')) return; try { await assetApi.deleteCertificate(id); fetchData(); } catch(e:any){ alert(e.response?.data?.message||'Error'); } };

  const isExpiring = (date:string) => { const d = new Date(date); const now = new Date(); const days = Math.ceil((d.getTime()-now.getTime())/(1000*60*60*24)); return days<=30; };
  const isExpired = (date:string) => new Date(date) < new Date();

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Certificates</h1><p className="text-gray-600 mt-1">Manage asset certificates and expiries</p></div><button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Certificate</button></div>
      <div className="flex gap-2"><input type="text" placeholder="Search..." value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg flex-1" /><select value={filterStatus} onChange={(e)=>{setFilterStatus(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg"><option value="">All Status</option><option value="active">Active</option><option value="expired">Expired</option><option value="revoked">Revoked</option></select></div>
      {records.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No certificates found.</p></div>:(
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium">Certificate No</th><th className="px-4 py-3 font-medium">Asset</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Issued By</th><th className="px-4 py-3 font-medium">Issue Date</th><th className="px-4 py-3 font-medium">Expiry</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody>{records.map((r:any)=>(<tr key={r.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-mono">{r.certificateNo}</td><td className="px-4 py-3">{r.asset?.name||'-'}</td><td className="px-4 py-3">{r.certificateType}</td><td className="px-4 py-3">{r.issuedBy}</td><td className="px-4 py-3">{r.issueDate?new Date(r.issueDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><span className={`${isExpired(r.expiryDate)?'text-red-600 font-medium':isExpiring(r.expiryDate)?'text-yellow-600 font-medium':''}`}>{r.expiryDate?new Date(r.expiryDate).toLocaleDateString():'-'}</span></td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${r.status==='active'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{r.status}</span></td><td className="px-4 py-3"><button onClick={()=>openEdit(r)} className="text-blue-600 hover:text-blue-800 mr-2 text-xs">Edit</button><button onClick={()=>verify(r.id)} className="text-green-600 hover:text-green-800 mr-2 text-xs">Verify</button><button onClick={()=>remove(r.id)} className="text-red-600 hover:text-red-800 text-xs">Del</button></td></tr>))}</tbody></table>
          {meta.totalPages>1&&<div className="flex justify-between items-center px-4 py-3 border-t"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button><span className="text-sm text-gray-500">Page {page} of {meta.totalPages}</span><button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div>}
        </div>
      )}
      {showForm&&<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-lg font-semibold mb-4">{editId?'Edit Certificate':'New Certificate'}</h2><div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Asset *</label><select value={form.assetId} disabled={!!editId} onChange={(e)=>setForm({...form,assetId:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">Select asset...</option>{assets.map((a:any)=>(<option key={a.id} value={a.id}>{a.assetNumber} - {a.name}</option>))}</select></div>
        <div><label className="block text-sm font-medium mb-1">Type *</label><select value={form.certificateType} onChange={(e)=>setForm({...form,certificateType:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="CALIBRATION">Calibration</option><option value="LOAD_TEST">Load Test</option><option value="NDT">NDT</option><option value="PRESSURE_TEST">Pressure Test</option><option value="ELECTRICAL">Electrical Safety</option><option value="STATUTORY">Statutory</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Certificate No *</label><input value={form.certificateNo} onChange={(e)=>setForm({...form,certificateNo:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Issued By *</label><input value={form.issuedBy} onChange={(e)=>setForm({...form,issuedBy:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Issue Date *</label><input type="date" value={form.issueDate} onChange={(e)=>setForm({...form,issueDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Expiry Date *</label><input type="date" value={form.expiryDate} onChange={(e)=>setForm({...form,expiryDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Attachment URL</label><input value={form.attachmentUrl} onChange={(e)=>setForm({...form,attachmentUrl:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
      </div><div className="flex gap-3 mt-6"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving?'Saving...':(editId?'Update':'Create')}</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div></div></div>}
    </div>
  );
}
