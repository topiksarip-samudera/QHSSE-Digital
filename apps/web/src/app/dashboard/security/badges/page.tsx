'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityBadgesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', badgeNumber: '', badgeType: 'employee', issuedDate: new Date().toISOString().split('T')[0], expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] });

  const fetchData = () => {
    setLoading(true);
    securityApi.getBadges({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createBadge(form);
    setShowForm(false);
    setForm({ userId: '', badgeNumber: '', badgeType: 'employee', issuedDate: new Date().toISOString().split('T')[0], expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] });
    fetchData();
  };

  const handleRevoke = async (id: string) => { await securityApi.revokeBadge(id); fetchData(); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ID Badge Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Issue Badge'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="User ID *" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Badge Number *" value={form.badgeNumber} onChange={e => setForm({ ...form, badgeNumber: e.target.value })} className="px-3 py-2 border rounded" />
            <select value={form.badgeType} onChange={e => setForm({ ...form, badgeType: e.target.value })} className="px-3 py-2 border rounded">
              <option>employee</option><option>contractor</option><option>visitor</option><option>temporary</option><option>escort</option>
            </select>
            <input type="date" placeholder="Issued Date" value={form.issuedDate} onChange={e => setForm({ ...form, issuedDate: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="date" placeholder="Expiry Date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="px-3 py-2 border rounded" />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm" disabled={!form.userId || !form.badgeNumber}>Issue</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Badge #</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">User</th><th className="p-3 text-left">Expiry</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.badgeNumber}</td><td className="p-3">{item.badgeType}</td>
                    <td className="p-3">{item.userId}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></td>
                    <td className="p-3">{item.status === 'active' && <button onClick={() => handleRevoke(item.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Revoke</button>}</td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No badges found</td></tr>}
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
