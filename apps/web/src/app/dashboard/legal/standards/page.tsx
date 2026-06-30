'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const statusColors: Record<string,string> = { active:'bg-green-100 text-green-700', draft:'bg-gray-100 text-gray-600', archived:'bg-yellow-100 text-yellow-700', obsolete:'bg-red-100 text-red-700' };

export default function LegalStandardsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ name:'', type:'', status:'active', description:'' });

  const fetch = useCallback(async () => { try { const r = await legalApi.getStandards(); setData(r.data.data||[]); setError(''); } catch(e:any){ setError(e.response?.data?.message||'Failed to load standards'); } finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleSave = async () => {
    try {
      if (editing) { await legalApi.updateStandard(editing.id, form); }
      else { await legalApi.createStandard(form); }
      setShowForm(false); setEditing(null); setForm({ name:'', type:'', status:'active', description:'' }); fetch();
    } catch(e:any){ alert(e.response?.data?.message||'Error saving standard'); }
  };

  const handleEdit = (item:any) => { setEditing(item); setForm({ name:item.name||'', type:item.type||'', status:item.status||'active', description:item.description||'' }); setShowForm(true); };

  const handleDelete = async (id:string) => { if (!confirm('Delete this standard?')) return; try { await legalApi.deleteStandard(id); fetch(); } catch(e:any){ alert(e.response?.data?.message||'Error deleting standard'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading standards...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}<button onClick={fetch} className="ml-3 text-sm text-blue-600 underline">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Legal Standards</h1><button onClick={()=>{setEditing(null);setForm({ name:'', type:'', status:'active', description:'' });setShowForm(!showForm)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Standard'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Type</label><input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="ISO, OHSAS, etc." /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option><option value="obsolete">Obsolete</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{editing?'Update':'Create'} Standard</button>
        </div>
      )}
      {data.length===0 ? <div className="text-center py-8 text-gray-400">No standards found.</div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{d.name}</td><td className="px-4 py-3 text-sm text-gray-500">{d.type||'-'}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td><td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{d.description||'-'}</td><td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end"><button onClick={()=>handleEdit(d)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">Edit</button><button onClick={()=>handleDelete(d.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Delete</button></div></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
