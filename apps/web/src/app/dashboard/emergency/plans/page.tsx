'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyPlansPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ status: '', emergencyType: '', search: '', page: 1 });
  const [form, setForm] = useState<any>({ name: '', emergencyType: 'Fire', description: '', scenario: '', siteId: '', status: 'draft' });

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.status) params.status = filters.status;
    if (filters.emergencyType) params.emergencyType = filters.emergencyType;
    if (filters.search) params.search = filters.search;
    apiClient.get('/emergency/plans', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/plans', form); setShowForm(false); setForm({ name: '', emergencyType: 'Fire', description: '', scenario: '', siteId: '', status: 'draft' }); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/plans/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete this plan?')) { await apiClient.delete(`/emergency/plans/${id}`); fetchData(); } };
  const handleAction = async (id: string, action: string) => { await apiClient.post(`/emergency/plans/${id}/${action}`); fetchData(); };

  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Plans</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', emergencyType: 'Fire', description: '', scenario: '', siteId: '', status: 'draft' }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add Plan</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.status} onChange={(e: any) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          {['draft','submitted','under_review','approved','active','review_due','revised','obsolete','archived'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.emergencyType} onChange={(e: any) => setFilters({ ...filters, emergencyType: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Types</option>
          {['Fire','Explosion','Chemical Spill','Medical Emergency','Earthquake','Flood','Evacuation','Gas Leak'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Type</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-left px-4 py-3 font-medium">Review Date</th><th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.emergencyType}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{item.nextReviewDate ? new Date(item.nextReviewDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  {item.status === 'draft' && <button onClick={() => handleAction(item.id, 'submit')} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">Submit</button>}
                  {['submitted','under_review'].includes(item.status) && <button onClick={() => handleAction(item.id, 'approve')} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Approve</button>}
                  {item.status === 'approved' && <button onClick={() => handleAction(item.id, 'activate')} className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs">Activate</button>}
                  <button onClick={() => openEdit(item)} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No plans found</td></tr>}
          </tbody>
        </table>
      </div>
      {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}

      {/* Form Modal */}
      {showForm && <FormModal title={editId ? 'Edit Plan' : 'New Plan'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'emergencyType', label: 'Type', type: 'select', options: ['Fire','Explosion','Chemical Spill','Medical Emergency','Earthquake','Flood','Evacuation','Gas Leak'] },
        { key: 'scenario', label: 'Scenario', type: 'text' }, { key: 'description', label: 'Description', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' },
        { key: 'nextReviewDate', label: 'Next Review', type: 'date' },
      ]} />}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = { draft: 'bg-gray-100 text-gray-700', submitted: 'bg-blue-100 text-blue-700', under_review: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', active: 'bg-emerald-100 text-emerald-700', review_due: 'bg-orange-100 text-orange-700', revised: 'bg-purple-100 text-purple-700', obsolete: 'bg-red-100 text-red-700', archived: 'bg-gray-200 text-gray-500' };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status.replace(/_/g, ' ')}</span>;
}

function Pagination({ page, total, limit, onChange }: { page: number; total: number; limit: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / limit);
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded text-sm ${p === page ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{p}</button>
      ))}
    </div>
  );
}

function FormModal({ title, form, onChange, onSave, onClose, fields }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">{title}</h2>
        {fields.map((f: any) => (
          <div key={f.key}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.key] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background">
                <option value="">--Select--</option>
                {f.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'date' ? (
              <input type="date" value={form[f.key]?.split('T')[0] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
            ) : (
              <input type="text" value={form[f.key] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
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
