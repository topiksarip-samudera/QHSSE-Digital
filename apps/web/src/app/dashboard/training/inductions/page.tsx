'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function InductionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ inductionType: 'site', userId: '', conductedBy: '', date: '', expiryDate: '', status: 'completed', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const r = await trainingApi.getInductions(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const save = async () => { try { if (editId) await trainingApi.updateInduction(editId, form); else await trainingApi.createInduction(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteInduction(id); load(); } };
  const edit = (r: any) => { setForm({ ...r, date: r.date?.slice(0,10)||'', expiryDate: r.expiryDate?.slice(0,10)||'' }); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Induction Records</h1><button onClick={()=>{setForm({inductionType:'site',status:'completed'});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ New Induction</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <select value={form.inductionType||'site'} onChange={e=>setForm({...form,inductionType:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="general_hse">General HSE</option><option value="site">Site</option><option value="contractor">Contractor</option><option value="visitor">Visitor</option><option value="executive">Executive</option>
          </select>
          <input placeholder="User ID" value={form.userId||''} onChange={e=>setForm({...form,userId:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input placeholder="Conducted By" value={form.conductedBy||''} onChange={e=>setForm({...form,conductedBy:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.date||''} onChange={e=>setForm({...form,date:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input type="date" value={form.expiryDate||''} onChange={e=>setForm({...form,expiryDate:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <select value={form.status||'completed'} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="expired">Expired</option>
          </select>
          <textarea placeholder="Notes" value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2}/>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length===0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No induction records.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Conducted By</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Expiry</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3 capitalize">{String(r.inductionType).replace(/_/g,' ')}</td><td className="px-4 py-3">{r.userId}</td><td className="px-4 py-3">{r.conductedBy}</td><td className="px-4 py-3">{r.date?new Date(r.date).toLocaleDateString():'-'}</td><td className="px-4 py-3">{r.expiryDate?new Date(r.expiryDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.status==='completed'?'bg-green-100 text-green-800':r.status==='expired'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
