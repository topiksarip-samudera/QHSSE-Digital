'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityInvestigationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ incidentId: '', investigatorId: '', findings: '', evidence: '', conclusion: '' });

  const fetchData = () => {
    setLoading(true);
    securityApi.getInvestigations({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    await securityApi.createInvestigation(form);
    setShowForm(false);
    setForm({ incidentId: '', investigatorId: '', findings: '', evidence: '', conclusion: '' });
    fetchData();
  };

  const handleComplete = async (id: string) => { await securityApi.completeInvestigation(id, 'Investigation completed'); fetchData(); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Investigations</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'Start Investigation'}</button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Incident ID *" value={form.incidentId} onChange={e => setForm({ ...form, incidentId: e.target.value })} className="px-3 py-2 border rounded" />
            <input placeholder="Investigator ID *" value={form.investigatorId} onChange={e => setForm({ ...form, investigatorId: e.target.value })} className="px-3 py-2 border rounded" />
            <textarea placeholder="Findings" value={form.findings} onChange={e => setForm({ ...form, findings: e.target.value })} className="px-3 py-2 border rounded col-span-2" rows={2} />
            <textarea placeholder="Evidence" value={form.evidence} onChange={e => setForm({ ...form, evidence: e.target.value })} className="px-3 py-2 border rounded col-span-2" rows={2} />
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm col-span-2" disabled={!form.incidentId || !form.investigatorId}>Start</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr><th className="p-3 text-left">Incident</th><th className="p-3 text-left">Investigator</th><th className="p-3 text-left">Findings</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.incident?.title || item.incidentId}</td>
                    <td className="p-3">{item.investigatorId}</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">{item.findings || '-'}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></td>
                    <td className="p-3">{item.status === 'in_progress' && <button onClick={() => handleComplete(item.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Complete</button>}</td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No investigations found</td></tr>}
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
