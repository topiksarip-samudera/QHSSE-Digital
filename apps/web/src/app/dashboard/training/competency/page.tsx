'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function CompetencyPage() {
  const [matrices, setMatrices] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'matrix'|'assessment'>('matrix');
  const [form, setForm] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const [m, a] = await Promise.all([trainingApi.getCompetencyMatrices(), trainingApi.getCompetencyAssessments()]); setMatrices(m.data?.data||[]); setAssessments(a.data?.data||[]); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const saveMatrix = async () => { try { if (editId) await trainingApi.updateCompetencyMatrix(editId, form); else await trainingApi.createCompetencyMatrix(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const deleteMatrix = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteCompetencyMatrix(id); load(); } };
  const editMatrix = (r: any) => { setForm(r); setEditId(r.id); setShowForm(true); };

  const deleteAssessment = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteCompetencyAssessment(id); load(); } };

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">Competency Management</h1>
      <div className="flex gap-4 border-b pb-2">
        <button onClick={()=>setTab('matrix')} className={`text-sm font-medium ${tab==='matrix'?'text-blue-600 border-b-2 border-blue-600 pb-2':'text-gray-500'}`}>Competency Matrix</button>
        <button onClick={()=>setTab('assessment')} className={`text-sm font-medium ${tab==='assessment'?'text-blue-600 border-b-2 border-blue-600 pb-2':'text-gray-500'}`}>Assessments</button>
      </div>

      {tab === 'matrix' && (
        <>
          <div className="flex justify-end"><button onClick={()=>{setForm({});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ Add</button></div>
          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 space-y-3">
              <input placeholder="Position ID" value={form.positionId||''} onChange={e=>setForm({...form,positionId:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
              <input placeholder="Competency Item" value={form.competencyItem||''} onChange={e=>setForm({...form,competencyItem:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
              <select value={form.requiredLevel||'competent'} onChange={e=>setForm({...form,requiredLevel:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="novice">Novice</option><option value="beginner">Beginner</option><option value="competent">Competent</option><option value="proficient">Proficient</option><option value="expert">Expert</option>
              </select>
              <input placeholder="Assessment Method" value={form.assessmentMethod||''} onChange={e=>setForm({...form,assessmentMethod:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
              <div className="flex gap-2"><button onClick={saveMatrix} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
            </div>
          )}
          {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : matrices.length===0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No competency matrices.</p></div> : (
            <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Position</th><th className="text-left px-4 py-3">Competency</th><th className="text-left px-4 py-3">Level</th><th className="text-left px-4 py-3">Method</th><th className="text-left px-4 py-3">Revalidation</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{matrices.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3">{r.positionId}</td><td className="px-4 py-3">{r.competencyItem}</td><td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs capitalize">{r.requiredLevel}</span></td><td className="px-4 py-3">{r.assessmentMethod||'-'}</td><td className="px-4 py-3">{r.revalidationPeriod||'-'}</td><td className="px-4 py-3 text-right"><button onClick={()=>editMatrix(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>deleteMatrix(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
          )}
        </>
      )}

      {tab === 'assessment' && (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Assessor</th><th className="text-left px-4 py-3">Result</th><th className="text-left px-4 py-3">Score</th><th className="text-left px-4 py-3">Date</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{assessments.length===0?<tr><td colSpan={6} className="text-center py-12 text-gray-500">No assessments</td></tr>:assessments.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3">{r.userId}</td><td className="px-4 py-3">{r.assessorId}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.result==='pass'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{r.result}</span></td><td className="px-4 py-3">{r.score||'-'}</td><td className="px-4 py-3">{r.assessedDate?new Date(r.assessedDate).toLocaleDateString():'-'}</td><td className="px-4 py-3 text-right"><button onClick={()=>deleteAssessment(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
