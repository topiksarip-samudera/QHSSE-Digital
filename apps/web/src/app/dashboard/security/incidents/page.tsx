'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityIncidentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', incidentType: 'Theft', severity: 'Low', description: '', location: '', incidentDate: new Date().toISOString().split('T')[0] });

  const fetchData = () => {
    setLoading(true);
    securityApi.getIncidents({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createIncident(form);
    setShowForm(false);
    setForm({ title: '', incidentType: 'Theft', severity: 'Low', description: '', location: '', incidentDate: new Date().toISOString().split('T')[0] });
    fetchData();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Incidents</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Report Incident'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded" />
            <select value={form.incidentType} onChange={e => setForm({ ...form, incidentType: e.target.value })} className="px-3 py-2 border rounded">
              <option>Theft</option><option>Unauthorized Access</option><option>Vandalism</option><option>Assault</option><option>Suspicious Activity</option><option>Policy Violation</option>
            </select>
            <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="px-3 py-2 border rounded">
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded col-span-2" rows={2} />
            <input type="date" value={form.incidentDate} onChange={e => setForm({ ...form, incidentDate: e.target.value })} className="px-3 py-2 border rounded" />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm col-span-2" disabled={!form.title}>Save</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Severity</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Date</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.title}</td><td className="p-3">{item.incidentType}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.severity === 'Critical' ? 'bg-red-100 text-red-700' : item.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{item.severity}</span></td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'open' ? 'bg-yellow-100 text-yellow-700' : item.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(item.incidentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No incidents found</td></tr>}
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
