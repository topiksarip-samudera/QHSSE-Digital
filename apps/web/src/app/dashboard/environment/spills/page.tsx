'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const EMPTY = { spillDate: '', material: '', volume: '', unit: 'L', location: '', cause: '', status: 'reported', reportedBy: '', cleanupActions: '', description: '' };

export default function SpillsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<any>({ ...EMPTY }); const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await environmentApi.getSpills({ page, limit: 20, search: search || undefined }); setItems(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load spills'); console.error(e); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (editId) { await environmentApi.updateSpill(editId, form); } else { await environmentApi.createSpill(form); } setForm({ ...EMPTY }); setShowForm(false); setEditId(null); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (item: any) => { setForm({ spillDate: item.spillDate ? item.spillDate.slice(0, 10) : '', material: item.material || '', volume: item.volume != null ? String(item.volume) : '', unit: item.unit || 'L', location: item.location || '', cause: item.cause || '', status: item.status || 'reported', reportedBy: item.reportedBy || '', cleanupActions: item.cleanupActions || '', description: item.description || '' }); setEditId(item.id); setShowForm(true); };

  const handleCancel = () => { setForm({ ...EMPTY }); setShowForm(false); setEditId(null); };

  const inp = "px-3 py-2 border rounded-lg text-sm w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Spills Register</h1><p className="text-gray-600 mt-1">Track and manage environmental spills</p></div><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Report Spill</button></div>
      <div className="flex gap-3 items-center"><input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search spills..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Spill' : 'Report Spill'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Spill Date</label><input type="date" required value={form.spillDate} onChange={(e) => setForm({ ...form, spillDate: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Material</label><input type="text" required value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Volume</label><input type="number" min="0" step="0.01" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Unit</label><select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inp}><option value="L">L</option><option value="m3">m³</option><option value="kg">kg</option><option value="barrel">barrel</option><option value="gal">gal</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Cause</label><input type="text" value={form.cause} onChange={(e) => setForm({ ...form, cause: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Reported By</label><input type="text" value={form.reportedBy} onChange={(e) => setForm({ ...form, reportedBy: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}><option value="reported">Reported</option><option value="investigating">Investigating</option><option value="in_progress">In Progress</option><option value="cleaned">Cleaned</option><option value="closed">Closed</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Cleanup Actions</label><textarea value={form.cleanupActions} onChange={(e) => setForm({ ...form, cleanupActions: e.target.value })} className={inp} rows={2} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} rows={2} /></div>
          </div>
          <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Report'}</button><button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : error ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div> : items.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No spills recorded</p><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="text-blue-600 hover:underline text-sm mt-1">Report your first spill</button></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cause</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{items.map((item: any) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-500">{item.spillDate ? new Date(item.spillDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.material || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.volume != null ? `${item.volume} ${item.unit || ''}` : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.location || '-'}</td><td className="px-4 py-3 text-sm text-gray-500 max-w-[120px] truncate">{item.cause || '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.status === 'closed' || item.status === 'cleaned' ? 'bg-green-100 text-green-800' : item.status === 'in_progress' || item.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{item.status || '-'}</span></td><td className="px-4 py-3 text-sm"><button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button></td></tr>))}</tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
