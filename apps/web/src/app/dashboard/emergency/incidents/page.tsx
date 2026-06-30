'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyIncidentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ incidentType: '', severity: '', status: '', search: '', page: 1 });
  const [form, setForm] = useState<any>({ title: '', incidentType: 'Fire', severity: 'medium', description: '', location: '', siteId: '', incidentDate: '', casualties: 0, injuries: 0 });
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [responseText, setResponseText] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.incidentType) params.incidentType = filters.incidentType;
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    apiClient.get('/emergency/incidents', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/incidents', form); setShowForm(false); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/incidents/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete incident?')) { await apiClient.delete(`/emergency/incidents/${id}`); fetchData(); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  const addResponse = async () => {
    if (!selectedIncident || !responseText.trim()) return;
    await apiClient.post(`/emergency/incidents/${selectedIncident.id}/responses`, { actionTaken: responseText });
    setResponseText('');
    refreshIncident(selectedIncident.id);
  };
  const refreshIncident = async (id: string) => { const r = await apiClient.get(`/emergency/incidents/${id}`); setSelectedIncident(r.data); };

  const severityColor: any = { low: 'bg-gray-100 text-gray-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };
  const statusColor: any = { reported: 'bg-blue-100 text-blue-700', responding: 'bg-amber-100 text-amber-700', contained: 'bg-yellow-100 text-yellow-700', under_control: 'bg-green-100 text-green-700', resolved: 'bg-emerald-100 text-emerald-700', closed: 'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Incidents</h1>
        <button onClick={() => { setEditId(null); setForm({ title: '', incidentType: 'Fire', severity: 'medium', description: '', location: '', siteId: '', incidentDate: '', casualties: 0, injuries: 0 }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Report Incident</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.incidentType} onChange={(e: any) => setFilters({ ...filters, incidentType: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Types</option>
          {['Fire','Explosion','Chemical Spill','Medical Emergency','Earthquake','Flood','Gas Leak','Vehicle Accident'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.severity} onChange={(e: any) => setFilters({ ...filters, severity: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Severity</option>
          {['low','medium','high','critical'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.status} onChange={(e: any) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          {['reported','responding','contained','under_control','resolved','closed'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className={`rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors ${selectedIncident?.id === item.id ? 'border-primary bg-accent' : 'bg-card'}`} onClick={() => { setSelectedIncident(item); refreshIncident(item.id); }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.incidentType} | {item.location || 'No location'} | {item.incidentDate ? new Date(item.incidentDate).toLocaleDateString() : '-'}</p>
                  {item.casualties > 0 && <p className="text-xs text-red-600 mt-1">Casualties: {item.casualties} (Injured: {item.injuries}, Fatal: {item.fatalities})</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${severityColor[item.severity]}`}>{item.severity}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[item.status]}`}>{item.status?.replace(/_/g, ' ')}</span>
                  <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">No incidents found</p>}
          {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}
        </div>

        <div className="space-y-4">
          {selectedIncident ? (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">Responses: {selectedIncident.title}</h3>
              <div className="space-y-2 mb-3">
                {selectedIncident.responses?.map((r: any) => (
                  <div key={r.id} className="text-sm border-b pb-2 last:border-b-0">
                    <p>{r.actionTaken}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.actionAt).toLocaleString()} {r.actionBy ? `by ${r.actionBy}` : ''}</p>
                  </div>
                ))}
                {(!selectedIncident.responses || selectedIncident.responses.length === 0) && <p className="text-xs text-muted-foreground">No responses recorded</p>}
              </div>
              <div className="border-t pt-3 space-y-2">
                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Describe response action..." rows={2} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <button onClick={addResponse} className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Add Response</button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-4 text-center text-muted-foreground text-sm">Select an incident to view responses</div>
          )}
        </div>
      </div>

      {showForm && <FormModal title={editId ? 'Edit Incident' : 'New Incident'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'title', label: 'Title', type: 'text' }, { key: 'incidentType', label: 'Type', type: 'select', options: ['Fire','Explosion','Chemical Spill','Medical Emergency','Earthquake','Flood','Gas Leak','Vehicle Accident','Electrical Emergency','Natural Disaster'] },
        { key: 'severity', label: 'Severity', type: 'select', options: ['low','medium','high','critical'] }, { key: 'location', label: 'Location', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' },
        { key: 'incidentDate', label: 'Incident Date', type: 'date' }, { key: 'description', label: 'Description', type: 'text' }, { key: 'casualties', label: 'Casualties', type: 'number' }, { key: 'injuries', label: 'Injuries', type: 'number' },
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
