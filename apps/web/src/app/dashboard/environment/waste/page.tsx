'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const EMPTY = { wasteType: '', description: '', quantity: '', unit: 'kg', disposalMethod: '', disposalDate: '', location: '', handler: '', status: 'pending' };
const MANIFEST_EMPTY = { manifestNumber: '', transporter: '', destination: '', transportDate: '' };

export default function WastePage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<any>({ ...EMPTY }); const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [manifestWasteId, setManifestWasteId] = useState<string | null>(null);
  const [manifestForm, setManifestForm] = useState<any>({ ...MANIFEST_EMPTY });

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await environmentApi.getWaste({ page, limit: 20, search: search || undefined }); setItems(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load waste records'); console.error(e); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (editId) { await environmentApi.updateWaste(editId, form); } else { await environmentApi.createWaste(form); } setForm({ ...EMPTY }); setShowForm(false); setEditId(null); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (item: any) => { setForm({ wasteType: item.wasteType || '', description: item.description || '', quantity: item.quantity != null ? String(item.quantity) : '', unit: item.unit || 'kg', disposalMethod: item.disposalMethod || '', disposalDate: item.disposalDate ? item.disposalDate.slice(0, 10) : '', location: item.location || '', handler: item.handler || '', status: item.status || 'pending' }); setEditId(item.id); setShowForm(true); };

  const handleDelete = async (id: string) => { if (!confirm('Delete this waste record?')) return; try { await environmentApi.deleteWaste(id); fetchData(); } catch (e) { console.error(e); } };

  const handleCancel = () => { setForm({ ...EMPTY }); setShowForm(false); setEditId(null); };

  const handleManifestSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!manifestWasteId) return; try { await environmentApi.createWasteManifest(manifestWasteId, manifestForm); setManifestForm({ ...MANIFEST_EMPTY }); setManifestWasteId(null); fetchData(); } catch (e) { console.error(e); } };

  const openManifest = (wasteId: string) => { setManifestWasteId(wasteId); setManifestForm({ ...MANIFEST_EMPTY }); };

  const inp = "px-3 py-2 border rounded-lg text-sm w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Waste Management</h1><p className="text-gray-600 mt-1">Track waste generation and disposal</p></div><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Create Waste Record</button></div>
      <div className="flex gap-3 items-center"><input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search waste records..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div>
      {manifestWasteId && (
        <form onSubmit={handleManifestSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 border-l-4 border-orange-400">
          <h2 className="text-lg font-semibold">Create Waste Manifest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Manifest Number</label><input type="text" required value={manifestForm.manifestNumber} onChange={(e) => setManifestForm({ ...manifestForm, manifestNumber: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Transporter</label><input type="text" value={manifestForm.transporter} onChange={(e) => setManifestForm({ ...manifestForm, transporter: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Destination</label><input type="text" value={manifestForm.destination} onChange={(e) => setManifestForm({ ...manifestForm, destination: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Transport Date</label><input type="date" value={manifestForm.transportDate} onChange={(e) => setManifestForm({ ...manifestForm, transportDate: e.target.value })} className={inp} /></div>
          </div>
          <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm">Create Manifest</button><button type="button" onClick={() => { setManifestWasteId(null); setManifestForm({ ...MANIFEST_EMPTY }); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </form>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Waste Record' : 'Create Waste Record'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Waste Type</label><input type="text" required value={form.wasteType} onChange={(e) => setForm({ ...form, wasteType: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Quantity</label><input type="number" min="0" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Unit</label><select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inp}><option value="kg">kg</option><option value="ton">ton</option><option value="L">L</option><option value="m3">m³</option><option value="unit">unit</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Disposal Method</label><input type="text" value={form.disposalMethod} onChange={(e) => setForm({ ...form, disposalMethod: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Disposal Date</label><input type="date" value={form.disposalDate} onChange={(e) => setForm({ ...form, disposalDate: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Handler</label><input type="text" value={form.handler} onChange={(e) => setForm({ ...form, handler: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="disposed">Disposed</option><option value="recycled">Recycled</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} rows={2} /></div>
          </div>
          <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : error ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div> : items.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No waste records found</p><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="text-blue-600 hover:underline text-sm mt-1">Create your first waste record</button></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposal</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{items.map((item: any) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.wasteType || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.quantity != null ? `${item.quantity} ${item.unit || ''}` : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.disposalMethod || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.disposalDate ? new Date(item.disposalDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.location || '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.status === 'disposed' ? 'bg-green-100 text-green-800' : item.status === 'recycled' ? 'bg-blue-100 text-blue-800' : item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{item.status || '-'}</span></td><td className="px-4 py-3 text-sm"><div className="flex gap-2 flex-wrap"><button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button><button onClick={() => openManifest(item.id)} className="text-orange-600 hover:underline text-xs">Manifest</button></div></td></tr>))}</tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
