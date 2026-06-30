'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function TrainingMatrixPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ type: '', requirement: 'mandatory', frequency: '', competencyTarget: '', validUntil: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const r = await trainingApi.getMatrices(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const save = async () => { try { if (editId) await trainingApi.updateMatrix(editId, form); else await trainingApi.createMatrix(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteMatrix(id); load(); } };
  const edit = (r: any) => { setForm(r); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Training Matrix</h1><button onClick={()=>{setForm({});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ Add</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input placeholder="Type (role/position/department...)" value={form.type||''} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <select value={form.requirement||'mandatory'} onChange={e=>setForm({...form,requirement:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="mandatory">Mandatory</option><option value="recommended">Recommended</option><option value="optional">Optional</option><option value="conditional">Conditional</option>
          </select>
          <input placeholder="Frequency" value={form.frequency||''} onChange={e=>setForm({...form,frequency:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input placeholder="Competency Target" value={form.competencyTarget||''} onChange={e=>setForm({...form,competencyTarget:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input type="date" value={form.validUntil?form.validUntil.slice(0,10):''} onChange={e=>setForm({...form,validUntil:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No training matrices defined.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Requirement</th><th className="text-left px-4 py-3">Frequency</th><th className="text-left px-4 py-3">Target</th><th className="text-left px-4 py-3">Valid Until</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3 capitalize">{r.type}</td><td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{r.requirement}</span></td><td className="px-4 py-3">{r.frequency||'-'}</td><td className="px-4 py-3">{r.competencyTarget||'-'}</td><td className="px-4 py-3">{r.validUntil?new Date(r.validUntil).toLocaleDateString():'-'}</td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
