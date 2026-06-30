'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const EMPTY = { name: '', permitNumber: '', permitType: '', issuingAuthority: '', issueDate: '', expiryDate: '', status: 'active', description: '' };

export default function PermitsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<any>({ ...EMPTY }); const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await environmentApi.getPermits({ page, limit: 20, search: search || undefined }); setItems(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load permits'); console.error(e); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (editId) { await environmentApi.updatePermit(editId, form); } else { await environmentApi.createPermit(form); } setForm({ ...EMPTY }); setShowForm(false); setEditId(null); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (item: any) => { setForm({ name: item.name || '', permitNumber: item.permitNumber || '', permitType: item.permitType || '', issuingAuthority: item.issuingAuthority || '', issueDate: item.issueDate ? item.issueDate.slice(0, 10) : '', expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : '', status: item.status || 'active', description: item.description || '' }); setEditId(item.id); setShowForm(true); };

  const handleDelete = async (id: string) => { if (!confirm('Delete this permit?')) return; try { await environmentApi.deletePermit(id); fetchData(); } catch (e) { console.error(e); } };

  const handleCancel = () => { setForm({ ...EMPTY }); setShowForm(false); setEditId(null); };

  const inp = "px-3 py-2 border rounded-lg text-sm w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Environmental Permits</h1><p className="text-gray-600 mt-1">Manage environmental permits and compliance</p></div><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Create Permit</button></div>
      <div className="flex gap-3 items-center"><input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search permits..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Permit' : 'Create Permit'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Permit Number</label><input type="text" value={form.permitNumber} onChange={(e) => setForm({ ...form, permitNumber: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Permit Type</label><input type="text" value={form.permitType} onChange={(e) => setForm({ ...form, permitType: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Issuing Authority</label><input type="text" value={form.issuingAuthority} onChange={(e) => setForm({ ...form, issuingAuthority: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Issue Date</label><input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Expiry Date</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inp} /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}><option value="active">Active</option><option value="expired">Expired</option><option value="revoked">Revoked</option><option value="pending">Pending</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} rows={2} /></div>
          </div>
          <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : error ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div> : items.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No permits found</p><button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY }); }} className="text-blue-600 hover:underline text-sm mt-1">Create your first permit</button></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Authority</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{items.map((item: any) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.permitNumber || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.permitType || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.issuingAuthority || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : item.status === 'expired' ? 'bg-red-100 text-red-800' : item.status === 'revoked' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status || '-'}</span></td><td className="px-4 py-3 text-sm"><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button></div></td></tr>))}</tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
