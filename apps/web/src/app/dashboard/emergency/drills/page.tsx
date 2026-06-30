'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyDrillsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ drillType: '', status: '', search: '', page: 1 });
  const [form, setForm] = useState<any>({ name: '', drillType: 'fire', scenario: '', siteId: '', scheduledDate: '', location: '', expectedParticipants: 0 });
  const [selectedDrill, setSelectedDrill] = useState<any>(null);
  const [resultForm, setResultForm] = useState<any>({ actualParticipants: 0, evacuationTimeSec: 0, responseTimeSec: 0, score: 0, strengths: '', weaknesses: '', findings: '', lessonsLearned: '' });

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.drillType) params.drillType = filters.drillType;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    apiClient.get('/emergency/drills', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/drills', form); setShowForm(false); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/drills/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete drill?')) { await apiClient.delete(`/emergency/drills/${id}`); fetchData(); } };
  const handleAction = async (id: string, action: string) => { await apiClient.post(`/emergency/drills/${id}/${action}`); fetchData(); };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  const addResult = async () => { if (!selectedDrill) return; await apiClient.post(`/emergency/drills/${selectedDrill.id}/results`, resultForm); refreshDrill(selectedDrill.id); };
  const refreshDrill = async (id: string) => { const r = await apiClient.get(`/emergency/drills/${id}`); setSelectedDrill(r.data); };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Drills</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', drillType: 'fire', scenario: '', siteId: '', scheduledDate: '', location: '', expectedParticipants: 0 }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Schedule Drill</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.drillType} onChange={(e: any) => setFilters({ ...filters, drillType: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Types</option>
          {['fire','evacuation','chemical','medical','earthquake','combined','tabletop'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.status} onChange={(e: any) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          {['planned','scheduled','in_progress','conducted','evaluation_in_progress','closed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className={`rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors ${selectedDrill?.id === item.id ? 'border-primary bg-accent' : 'bg-card'}`} onClick={() => { setSelectedDrill(item); refreshDrill(item.id); }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.drillType} | {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'TBD'} | {item.location || 'No location'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'planned' ? 'bg-gray-100 text-gray-700' : item.status === 'conducted' ? 'bg-green-100 text-green-700' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : item.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status?.replace(/_/g, ' ')}</span>
                  <div className="flex gap-1">
                    {['planned','scheduled'].includes(item.status) && <button onClick={e => { e.stopPropagation(); handleAction(item.id, 'start'); }} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">Start</button>}
                    {item.status === 'in_progress' && <button onClick={e => { e.stopPropagation(); handleAction(item.id, 'complete'); }} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Complete</button>}
                    <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">No drills found</p>}
          {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}
        </div>

        <div className="space-y-4">
          {selectedDrill ? (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">Results: {selectedDrill.name}</h3>
              {selectedDrill.results?.map((r: any) => (
                <div key={r.id} className="text-sm border-b py-2 last:border-b-0">
                  <p><span className="font-medium">Score:</span> {r.score || '-'}%</p>
                  <p><span className="font-medium">Participants:</span> {r.actualParticipants}</p>
                  <p><span className="font-medium">Evac Time:</span> {r.evacuationTimeSec}s</p>
                  {r.strengths && <p className="text-green-600 text-xs">✓ {r.strengths}</p>}
                  {r.weaknesses && <p className="text-red-600 text-xs">⚠ {r.weaknesses}</p>}
                </div>
              ))}
              {(!selectedDrill.results || selectedDrill.results.length === 0) && <p className="text-xs text-muted-foreground">No results yet</p>}
              <div className="border-t pt-3 mt-3 space-y-2">
                <input type="number" placeholder="Actual Participants" value={resultForm.actualParticipants} onChange={e => setResultForm({ ...resultForm, actualParticipants: Number(e.target.value) })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <input type="number" placeholder="Evacuation Time (sec)" value={resultForm.evacuationTimeSec} onChange={e => setResultForm({ ...resultForm, evacuationTimeSec: Number(e.target.value) })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <input type="number" placeholder="Score (0-100)" value={resultForm.score} onChange={e => setResultForm({ ...resultForm, score: Number(e.target.value) })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <input placeholder="Strengths" value={resultForm.strengths} onChange={e => setResultForm({ ...resultForm, strengths: e.target.value })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <input placeholder="Weaknesses" value={resultForm.weaknesses} onChange={e => setResultForm({ ...resultForm, weaknesses: e.target.value })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <button onClick={addResult} className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Add Result</button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-4 text-center text-muted-foreground text-sm">Select a drill to view results</div>
          )}
        </div>
      </div>

      {showForm && <FormModal title={editId ? 'Edit Drill' : 'New Drill'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'drillType', label: 'Drill Type', type: 'select', options: ['fire','evacuation','chemical','medical','earthquake','combined','tabletop'] },
        { key: 'scenario', label: 'Scenario', type: 'text' }, { key: 'location', label: 'Location', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' },
        { key: 'scheduledDate', label: 'Scheduled Date', type: 'date' }, { key: 'expectedParticipants', label: 'Expected Participants', type: 'number' },
      ]} />}
    </div>
  );
}

function Pagination({ page, total, limit, onChange }: any) {
  const pages = Math.ceil(total / limit);
  return <div className="flex items-center gap-2">{Array.from({ length: pages }, (_, i) => i + 1).map(p => <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded text-sm ${p === page ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{p}</button>)}</div>;
}

function FormModal({ title, form, onChange, onSave, onClose, fields }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {fields.map((f: any) => (
          <div key={f.key}><label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.key] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background"><option value="">--Select--</option>{f.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}</select>
            ) : (
              <input type={f.type || 'text'} value={form[f.key] != null ? (f.type === 'date' ? form[f.key]?.split('T')[0] || '' : form[f.key]) : ''} onChange={e => onChange({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
