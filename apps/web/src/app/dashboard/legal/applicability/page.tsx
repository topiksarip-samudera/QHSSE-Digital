'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const statusColors: Record<string,string> = { applicable:'bg-green-100 text-green-700', not_applicable:'bg-gray-100 text-gray-600', pending:'bg-yellow-100 text-yellow-700', partially_applicable:'bg-blue-100 text-blue-700' };

export default function LegalApplicabilityPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ regulationId:'', regulationName:'', siteId:'', siteName:'', departmentId:'', departmentName:'', status:'applicable', justification:'' });

  const fetch = useCallback(async () => { try { const r = await legalApi.getApplicability(); setData(r.data.data||[]); setError(''); } catch(e:any){ setError(e.response?.data?.message||'Failed to load applicability'); } finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleSave = async () => {
    const payload = { ...form }; [''].forEach(k=>{if(!payload[k])delete payload[k]});
    try {
      if (editing) { await legalApi.updateApplicability(editing.id, payload); }
      else { await legalApi.createApplicability(payload); }
      setShowForm(false); setEditing(null); setForm({ regulationId:'', regulationName:'', siteId:'', siteName:'', departmentId:'', departmentName:'', status:'applicable', justification:'' }); fetch();
    } catch(e:any){ alert(e.response?.data?.message||'Error saving applicability'); }
  };

  const handleEdit = (item:any) => { setEditing(item); setForm({ regulationId:item.regulationId||'', regulationName:item.regulation?.name||'', siteId:item.siteId||'', siteName:item.site?.name||'', departmentId:item.departmentId||'', departmentName:item.department?.name||'', status:item.status||'applicable', justification:item.justification||'' }); setShowForm(true); };

  const handleDelete = async (id:string) => { if (!confirm('Delete this mapping?')) return; try { await legalApi.deleteApplicability(id); fetch(); } catch(e:any){ alert(e.response?.data?.message||'Error deleting mapping'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading applicability matrix...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}<button onClick={fetch} className="ml-3 text-sm text-blue-600 underline">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Applicability Matrix</h1><button onClick={()=>{setEditing(null);setForm({ regulationId:'', regulationName:'', siteId:'', siteName:'', departmentId:'', departmentName:'', status:'applicable', justification:'' });setShowForm(!showForm)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Mapping'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Regulation ID</label><input value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="UUID" /></div>
            <div><label className="block text-sm font-medium mb-1">Site ID</label><input value={form.siteId} onChange={e=>setForm({...form,siteId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="UUID" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Department ID</label><input value={form.departmentId} onChange={e=>setForm({...form,departmentId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="UUID (optional)" /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="applicable">Applicable</option><option value="not_applicable">Not Applicable</option><option value="pending">Pending</option><option value="partially_applicable">Partially Applicable</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Justification</label><textarea value={form.justification} onChange={e=>setForm({...form,justification:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Reason for applicability decision" /></div>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{editing?'Update':'Create'} Mapping</button>
        </div>
      )}
      {data.length===0 ? <div className="text-center py-8 text-gray-400">No applicability mappings found.</div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Regulation</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Site</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{d.regulation?.name||d.regulationId||'-'}</td><td className="px-4 py-3 text-sm text-gray-500">{d.site?.name||d.siteId||'-'}</td><td className="px-4 py-3 text-sm text-gray-500">{d.department?.name||d.departmentId||'-'}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status?.replace(/_/g,' ')}</span></td><td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end"><button onClick={()=>handleEdit(d)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">Edit</button><button onClick={()=>handleDelete(d.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Delete</button></div></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
