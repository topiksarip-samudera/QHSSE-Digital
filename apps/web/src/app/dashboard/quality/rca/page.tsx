'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';

const methodColors: Record<string,string> = { '5why':'bg-blue-100 text-blue-800', fishbone:'bg-purple-100 text-purple-800', fta:'bg-orange-100 text-orange-800', taproot:'bg-teal-100 text-teal-800' };
const statusColors: Record<string,string> = { draft:'bg-gray-100 text-gray-700', in_progress:'bg-yellow-100 text-yellow-800', completed:'bg-green-100 text-green-800', reviewed:'bg-blue-100 text-blue-700' };

export default function RcaPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ title: '', method: '5why', problemStatement: '', rootCause: '', correctiveAction: '', status: 'draft' });

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await qualityApi.getRcas(); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load RCAs'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => { try { await qualityApi.createRca(form); setShowForm(false); resetForm(); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error creating RCA'); } };
  const handleUpdate = async () => { try { await qualityApi.updateRca(editId!, form); setShowForm(false); setEditId(null); resetForm(); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error updating RCA'); } };
  const handleDelete = async (id: string) => { if (!confirm('Delete this RCA?')) return; try { await qualityApi.deleteRca(id); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error deleting RCA'); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };
  const resetForm = () => setForm({ title: '', method: '5why', problemStatement: '', rootCause: '', correctiveAction: '', status: 'draft' });

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Root Cause Analysis (RCA)</h1>
        <button onClick={() => { setEditId(null); resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm ? 'Cancel' : 'New RCA'}</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <h2 className="text-lg font-semibold">{editId ? 'Edit RCA' : 'New RCA'}</h2>
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Method</label><select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="5why">5 Whys</option><option value="fishbone">Fishbone</option><option value="fta">Fault Tree Analysis</option><option value="taproot">TapRooT</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="draft">Draft</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="reviewed">Reviewed</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Problem Statement</label><textarea value={form.problemStatement} onChange={e => setForm({ ...form, problemStatement: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
          <div><label className="block text-sm font-medium mb-1">Root Cause</label><textarea value={form.rootCause} onChange={e => setForm({ ...form, rootCause: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
          <div><label className="block text-sm font-medium mb-1">Corrective Action</label><textarea value={form.correctiveAction} onChange={e => setForm({ ...form, correctiveAction: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
          <button onClick={editId ? handleUpdate : handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Create'}</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Method</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Problem</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t">
                <td className="px-4 py-3 text-sm">{d.title}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${methodColors[d.method] || ''}`}>{d.method}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] || ''}`}>{d.status?.replace(/_/g, ' ')}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{d.problemStatement || '-'}</td>
                <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => openEdit(d)} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Edit</button><button onClick={() => handleDelete(d.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Del</button></div></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No RCAs found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
