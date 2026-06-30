'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityActionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ incidentId: '', actionType: 'Corrective', title: '', description: '', assignedTo: '', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] });

  const fetchData = () => {
    setLoading(true);
    securityApi.getActions({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createAction(form);
    setShowForm(false);
    setForm({ incidentId: '', actionType: 'Corrective', title: '', description: '', assignedTo: '', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] });
    fetchData();
  };

  const handleVerify = async (id: string) => { await securityApi.verifyAction(id); fetchData(); };
  const handleClose = async (id: string) => { await securityApi.closeAction(id); fetchData(); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Actions</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Create Action'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Incident ID *" value={form.incidentId} onChange={e => setForm({ ...form, incidentId: e.target.value })} className="px-3 py-2 border rounded" />
            <select value={form.actionType} onChange={e => setForm({ ...form, actionType: e.target.value })} className="px-3 py-2 border rounded">
              <option>Corrective</option><option>Preventive</option><option>Disciplinary</option><option>Improvement</option>
            </select>
            <input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded col-span-2" rows={2} />
            <input placeholder="Assigned To *" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="px-3 py-2 border rounded" />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm col-span-2" disabled={!form.incidentId || !form.title || !form.assignedTo}>Create</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Assigned</th><th className="p-3 text-left">Due</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.title}</td><td className="p-3">{item.actionType}</td>
                    <td className="p-3">{item.assignedTo}</td>
                    <td className="p-3 text-xs text-muted-foreground">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'verified' ? 'bg-green-100 text-green-700' : item.status === 'closed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {item.status === 'open' && <button onClick={() => handleVerify(item.id)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Verify</button>}
                      {item.status === 'verified' && <button onClick={() => handleClose(item.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Close</button>}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No actions found</td></tr>}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
