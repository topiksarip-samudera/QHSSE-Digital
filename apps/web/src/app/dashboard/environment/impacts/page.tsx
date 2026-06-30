'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const EMPTY = { title: '', description: '', impactId: '', severity: 0, likelihood: 0 };

export default function ImpactsPage() {
  const [impacts, setImpacts] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<any>({ ...EMPTY }); const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [masterData, setMasterData] = useState<any>(null);

  const fetchMasterData = useCallback(async () => { try { const r = await environmentApi.getMasterData(); setMasterData(r.data); } catch (e) { console.error(e); } }, []);
  const fetchData = useCallback(async () => { setLoading(true); try { const r = await environmentApi.getImpacts({ page, limit: 20, search: search || undefined }); setImpacts(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e) { console.error(e); } finally { setLoading(false); } }, [page, search]);
  useEffect(() => { fetchMasterData(); }, [fetchMasterData]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (editId) { await environmentApi.updateImpact(editId, form); } else { await environmentApi.createImpact(form); } setForm({ ...EMPTY }); setShowForm(false); setEditId(null); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (i: any) => { setForm({ title: i.title || '', description: i.description || '', impactId: i.impactId || '', severity: i.severity || 0, likelihood: i.likelihood || 0 }); setEditId(i.id); setShowForm(true); };

  const handleDelete = async (id: string) => { if (!confirm('Delete this impact?')) return; try { await environmentApi.deleteImpact(id); fetchData(); } catch (e) { console.error(e); } };

  const handleCancel = () => { setForm({ ...EMPTY }); setShowForm(false); setEditId(null); };
  const impactTypes = masterData?.impacts || [];

  const inp = "px-3 py-2 border rounded-lg text-sm w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Environmental Impacts</h1><p className="text-gray-600 mt-1">Manage environmental impacts</p></div><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Create Impact</button></div>
      <div className="flex gap-3 items-center"><input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search impacts..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Impact' : 'Create Impact'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Title</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} rows={2} /></div>
            <div><label className="block text-sm font-medium mb-1">Impact Type</label><select value={form.impactId} onChange={(e) => setForm({ ...form, impactId: e.target.value })} className={inp}><option value="">Select...</option>{impactTypes.map((it: any) => <option key={it.id} value={it.id}>{it.name || it.title}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Severity (0-10)</label><input type="number" min={0} max={10} value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Likelihood (0-10)</label><input type="number" min={0} max={10} value={form.likelihood} onChange={(e) => setForm({ ...form, likelihood: Number(e.target.value) })} className={inp} /></div>
          </div>
          <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : impacts.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No impacts found</p><button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline text-sm mt-1">Create your first impact</button></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likelihood</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{impacts.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{i.title}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${(i.severity ?? 0) >= 7 ? 'bg-red-100 text-red-800' : (i.severity ?? 0) >= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{i.severity ?? '-'}</span></td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${(i.likelihood ?? 0) >= 7 ? 'bg-red-100 text-red-800' : (i.likelihood ?? 0) >= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{i.likelihood ?? '-'}</span></td><td className="px-4 py-3 text-sm text-gray-500">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm"><div className="flex gap-2"><button onClick={() => handleEdit(i)} className="text-blue-600 hover:underline text-xs">Edit</button><button onClick={() => handleDelete(i.id)} className="text-red-600 hover:underline text-xs">Delete</button></div></td></tr>))}</tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
