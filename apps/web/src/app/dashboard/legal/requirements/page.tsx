'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const priorityColors: Record<string,string> = { low:'bg-green-100 text-green-700', medium:'bg-yellow-100 text-yellow-700', high:'bg-orange-100 text-orange-800', critical:'bg-red-100 text-red-800' };
const statusColors: Record<string,string> = { active:'bg-blue-100 text-blue-700', met:'bg-green-100 text-green-700', unmet:'bg-red-100 text-red-700', na:'bg-gray-100 text-gray-600' };

export default function LegalRequirementsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title:'', clause:'', regulationId:'', regulationName:'', priority:'medium', status:'active', description:'' });

  const fetch = useCallback(async () => { try { const r = await legalApi.getRequirements(); setData(r.data.data||[]); setError(''); } catch(e:any){ setError(e.response?.data?.message||'Failed to load requirements'); } finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleSave = async () => {
    const payload = { ...form }; if (!payload.regulationId) delete payload.regulationId;
    try {
      if (editing) { await legalApi.updateRequirement(editing.id, payload); }
      else { await legalApi.createRequirement(payload); }
      setShowForm(false); setEditing(null); setForm({ title:'', clause:'', regulationId:'', regulationName:'', priority:'medium', status:'active', description:'' }); fetch();
    } catch(e:any){ alert(e.response?.data?.message||'Error saving requirement'); }
  };

  const handleEdit = (item:any) => { setEditing(item); setForm({ title:item.title||'', clause:item.clause||'', regulationId:item.regulationId||'', regulationName:item.regulation?.name||'', priority:item.priority||'medium', status:item.status||'active', description:item.description||'' }); setShowForm(true); };

  const handleDelete = async (id:string) => { if (!confirm('Delete this requirement?')) return; try { await legalApi.deleteRequirement(id); fetch(); } catch(e:any){ alert(e.response?.data?.message||'Error deleting requirement'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading requirements...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}<button onClick={fetch} className="ml-3 text-sm text-blue-600 underline">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Legal Requirements</h1><button onClick={()=>{setEditing(null);setForm({ title:'', clause:'', regulationId:'', regulationName:'', priority:'medium', status:'active', description:'' });setShowForm(!showForm)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Requirement'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Clause / Section</label><input value={form.clause} onChange={e=>setForm({...form,clause:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Regulation ID</label><input value={form.regulationId} onChange={e=>setForm({...form,regulationId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="UUID of regulation" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="met">Met</option><option value="unmet">Unmet</option><option value="na">N/A</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{editing?'Update':'Create'} Requirement</button>
        </div>
      )}
      {data.length===0 ? <div className="text-center py-8 text-gray-400">No requirements found.</div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Clause</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Regulation</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Priority</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{d.title}</td><td className="px-4 py-3 text-sm text-gray-500">{d.clause||'-'}</td><td className="px-4 py-3 text-sm text-gray-500">{d.regulation?.name||d.regulationId||'-'}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${priorityColors[d.priority]||''}`}>{d.priority}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td><td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end"><button onClick={()=>handleEdit(d)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">Edit</button><button onClick={()=>handleDelete(d.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Delete</button></div></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
