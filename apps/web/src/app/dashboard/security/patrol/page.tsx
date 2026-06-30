'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityPatrolPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patrolArea: '', checkpointName: '', checkpointOrder: '1', scheduledTime: new Date().toISOString().slice(0, 16), patrolledBy: '', notes: '' });

  const fetchData = () => {
    setLoading(true);
    securityApi.getPatrols({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createPatrol({ ...form, checkpointOrder: parseInt(form.checkpointOrder) });
    setShowForm(false);
    setForm({ patrolArea: '', checkpointName: '', checkpointOrder: '1', scheduledTime: new Date().toISOString().slice(0, 16), patrolledBy: '', notes: '' });
    fetchData();
  };

  const handleComplete = async (id: string) => { await securityApi.completePatrol(id, 'All clear'); fetchData(); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Patrol</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Schedule Patrol'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Patrol Area *" value={form.patrolArea} onChange={e => setForm({ ...form, patrolArea: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Checkpoint Name *" value={form.checkpointName} onChange={e => setForm({ ...form, checkpointName: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Order" type="number" value={form.checkpointOrder} onChange={e => setForm({ ...form, checkpointOrder: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="datetime-local" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Patrolled By *" value={form.patrolledBy} onChange={e => setForm({ ...form, patrolledBy: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="px-3 py-2 border rounded" />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm" disabled={!form.patrolArea || !form.checkpointName || !form.patrolledBy}>Create</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Area</th><th className="p-3 text-left">Checkpoint</th><th className="p-3 text-left">Order</th><th className="p-3 text-left">Scheduled</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.patrolArea}</td><td className="p-3">{item.checkpointName}</td>
                    <td className="p-3">{item.checkpointOrder}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(item.scheduledTime).toLocaleString()}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                    <td className="p-3">{item.status === 'pending' && <button onClick={() => handleComplete(item.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Complete</button>}</td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No patrols found</td></tr>}
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
