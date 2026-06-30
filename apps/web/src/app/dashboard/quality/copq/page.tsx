'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';

const costColors: Record<string,string> = { appraisal:'bg-blue-100 text-blue-800', prevention:'bg-green-100 text-green-800', internal_failure:'bg-yellow-100 text-yellow-800', external_failure:'bg-red-100 text-red-800' };

export default function CopqPage() {
  const [data, setData] = useState<any[]>([]); const [summary, setSummary] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ title: '', description: '', costCategory: 'internal_failure', amount: '', currency: 'USD', incidentDate: '', relatedRecordId: '' });

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [r, s] = await Promise.all([qualityApi.getCopq(), qualityApi.getCopqSummary()]);
      setData(r.data.data || r.data || []); setSummary(s.data);
    } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load COPQ data'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => { try { await qualityApi.createCopq({ ...form, amount: parseFloat(form.amount) }); setShowForm(false); resetForm(); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error'); } };
  const handleUpdate = async () => { try { await qualityApi.updateCopq(editId!, { ...form, amount: parseFloat(form.amount) }); setShowForm(false); setEditId(null); resetForm(); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error'); } };
  const handleDelete = async (id: string) => { if (!confirm('Delete this COPQ entry?')) return; try { await qualityApi.deleteCopq(id); fetch(); } catch (e: any) { alert(e?.response?.data?.message || 'Error'); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm({ ...item, amount: String(item.amount || '') }); setShowForm(true); };
  const resetForm = () => setForm({ title: '', description: '', costCategory: 'internal_failure', amount: '', currency: 'USD', incidentDate: '', relatedRecordId: '' });

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const totalCost = summary?.totalCost || data.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Cost of Poor Quality (COPQ)</h1><button onClick={() => { setEditId(null); resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm ? 'Cancel' : 'New Entry'}</button></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4"><p className="text-sm text-gray-500">Total COPQ</p><p className="text-3xl font-bold text-red-600 mt-1">${totalCost.toLocaleString()}</p></div>
        {summary?.byCategory && Object.entries(summary.byCategory).map(([key, val]: [string, any]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4"><p className="text-sm text-gray-500">{key.replace(/_/g, ' ')}</p><p className="text-2xl font-bold text-gray-900 mt-1">${(val as number).toLocaleString()}</p></div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Entry' : 'New COPQ Entry'}</h2>
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Category</label><select value={form.costCategory} onChange={e => setForm({ ...form, costCategory: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="appraisal">Appraisal</option><option value="prevention">Prevention</option><option value="internal_failure">Internal Failure</option><option value="external_failure">External Failure</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Amount</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Currency</label><select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={form.incidentDate} onChange={e => setForm({ ...form, incidentDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
          <button onClick={editId ? handleUpdate : handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Create'}</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t">
                <td className="px-4 py-3 text-sm">{d.title}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${costColors[d.costCategory] || ''}`}>{d.costCategory?.replace(/_/g, ' ')}</span></td>
                <td className="px-4 py-3 text-sm text-right font-medium">${(Number(d.amount) || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.incidentDate ? new Date(d.incidentDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => openEdit(d)} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Edit</button><button onClick={() => handleDelete(d.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Del</button></div></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No COPQ entries found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
