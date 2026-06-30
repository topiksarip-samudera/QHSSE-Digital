'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityLostFoundPage() {
  const [tab, setTab] = useState<'lost' | 'theft' | 'ua'>('lost');
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    itemName: '', itemDescription: '', location: '', reportedBy: '', reportDate: new Date().toISOString().split('T')[0],
    title: '', description: '', itemsStolen: '', estimatedValue: '', reportingDate: new Date().toISOString().split('T')[0],
    accessPoint: '', attemptedBy: '', attemptTime: new Date().toISOString().slice(0, 16), result: 'prevented',
  });

  const fetchData = () => {
    setLoading(true);
    const fetcher = tab === 'lost' ? securityApi.getLostItems : tab === 'theft' ? securityApi.getThefts : securityApi.getUnauthorizedAccess;
    fetcher({ page, limit: 20 }).then(r => {
      const d = r.data.data || r.data;
      setItems(d.data || d);
      setTotal(d.meta?.total || d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, tab]);

  const handleCreate = async () => {
    if (tab === 'lost') await securityApi.createLostItem(form);
    else if (tab === 'theft') await securityApi.createTheft({ ...form, estimatedValue: parseFloat(form.estimatedValue) || 0 });
    else await securityApi.createUnauthorizedAccess(form);
    setShowForm(false);
    fetchData();
  };

  const handleMarkFound = async (id: string) => { await securityApi.markItemFound(id); fetchData(); };
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lost & Found / Theft / Unauthorized Access</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">{showForm ? 'Cancel' : 'New Report'}</button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['lost', 'theft', 'ua'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`px-4 py-2 rounded text-sm ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {t === 'lost' ? 'Lost Items' : t === 'theft' ? 'Theft Reports' : 'Unauthorized Access'}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-card">
          <div className="grid grid-cols-2 gap-4">
            {tab === 'lost' && (<>
              <input placeholder="Item Name *" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Description" value={form.itemDescription} onChange={e => setForm({ ...form, itemDescription: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Reported By" value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} className="px-3 py-2 border rounded" />
              <input type="date" value={form.reportDate} onChange={e => setForm({ ...form, reportDate: e.target.value })} className="px-3 py-2 border rounded" />
            </>)}
            {tab === 'theft' && (<>
              <input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Items Stolen" value={form.itemsStolen} onChange={e => setForm({ ...form, itemsStolen: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Estimated Value" type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Reported By" value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} className="px-3 py-2 border rounded" />
              <input type="date" value={form.reportingDate} onChange={e => setForm({ ...form, reportingDate: e.target.value })} className="px-3 py-2 border rounded" />
            </>)}
            {tab === 'ua' && (<>
              <input placeholder="Access Point *" value={form.accessPoint} onChange={e => setForm({ ...form, accessPoint: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Attempted By" value={form.attemptedBy} onChange={e => setForm({ ...form, attemptedBy: e.target.value })} className="px-3 py-2 border rounded" />
              <input type="datetime-local" value={form.attemptTime} onChange={e => setForm({ ...form, attemptTime: e.target.value })} className="px-3 py-2 border rounded" />
              <select value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} className="px-3 py-2 border rounded"><option>prevented</option><option>breached</option></select>
            </>)}
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm" disabled={tab === 'lost' ? !form.itemName : tab === 'theft' ? !form.title : !form.accessPoint}>Submit</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                {tab === 'lost' && <tr><th className="p-3 text-left">Item</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Reported</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr>}
                {tab === 'theft' && <tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Value</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Date</th></tr>}
                {tab === 'ua' && <tr><th className="p-3 text-left">Access Point</th><th className="p-3 text-left">Attempted By</th><th className="p-3 text-left">Result</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Time</th></tr>}
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    {tab === 'lost' && (<>
                      <td className="p-3 font-medium">{item.itemName}</td><td className="p-3">{item.location || '-'}</td>
                      <td className="p-3 text-xs text-muted-foreground">{new Date(item.reportDate).toLocaleDateString()}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'found' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                      <td className="p-3">{item.status !== 'found' && <button onClick={() => handleMarkFound(item.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Mark Found</button>}</td>
                    </>)}
                    {tab === 'theft' && (<>
                      <td className="p-3 font-medium">{item.title}</td><td className="p-3">{item.location || '-'}</td>
                      <td className="p-3">{item.estimatedValue ? `$${item.estimatedValue}` : '-'}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">{item.status}</span></td>
                      <td className="p-3 text-xs text-muted-foreground">{new Date(item.reportingDate).toLocaleDateString()}</td>
                    </>)}
                    {tab === 'ua' && (<>
                      <td className="p-3 font-medium">{item.accessPoint}</td><td className="p-3">{item.attemptedBy || '-'}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${item.result === 'prevented' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.result}</span></td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">{item.status}</span></td>
                      <td className="p-3 text-xs text-muted-foreground">{new Date(item.attemptTime).toLocaleString()}</td>
                    </>)}
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No records found</td></tr>}
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
