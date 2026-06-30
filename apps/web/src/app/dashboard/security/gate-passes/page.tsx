'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityGatePassPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ passNumber: '', vehicleNumber: '', driverName: '', purpose: '', entryGate: '' });

  const fetchData = () => {
    setLoading(true);
    securityApi.getGatePasses({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createGatePass(form);
    setShowForm(false);
    setForm({ passNumber: '', vehicleNumber: '', driverName: '', purpose: '', entryGate: '' });
    fetchData();
  };

  const handleCheckIn = async (id: string) => { await securityApi.checkInGatePass(id); fetchData(); };
  const handleCheckOut = async (id: string) => { await securityApi.checkOutGatePass(id); fetchData(); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gate Pass Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Issue Gate Pass'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Pass Number *" value={form.passNumber} onChange={e => setForm({ ...form, passNumber: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Vehicle Number" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Driver Name" value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Purpose" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Entry Gate" value={form.entryGate} onChange={e => setForm({ ...form, entryGate: e.target.value })} className="px-3 py-2 border rounded" />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm" disabled={!form.passNumber}>Create</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Pass #</th><th className="p-3 text-left">Vehicle</th><th className="p-3 text-left">Driver</th><th className="p-3 text-left">Gate</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.passNumber}</td><td className="p-3">{item.vehicleNumber || '-'}</td>
                    <td className="p-3">{item.driverName || '-'}</td><td className="p-3">{item.entryGate || '-'}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'checked_in' ? 'bg-green-100 text-green-700' : item.status === 'checked_out' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                    <td className="p-3 flex gap-2">
                      {item.status === 'pending' && <button onClick={() => handleCheckIn(item.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Check In</button>}
                      {item.status === 'checked_in' && <button onClick={() => handleCheckOut(item.id)} className="px-2 py-1 bg-orange-500 text-white rounded text-xs">Check Out</button>}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No gate passes found</td></tr>}
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
