'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyEquipmentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ equipmentType: '', inspectionStatus: '', inspectionOverdue: false, search: '', page: 1 });
  const [form, setForm] = useState<any>({ name: '', equipmentType: 'Fire Extinguisher', location: '', siteId: '', serialNumber: '', nextInspection: '', inspectionStatus: 'available' });

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.equipmentType) params.equipmentType = filters.equipmentType;
    if (filters.inspectionStatus) params.inspectionStatus = filters.inspectionStatus;
    if (filters.search) params.search = filters.search;
    if (filters.inspectionOverdue) params.inspectionOverdue = 'true';
    apiClient.get('/emergency/equipment', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/equipment', form); setShowForm(false); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/equipment/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete equipment?')) { await apiClient.delete(`/emergency/equipment/${id}`); fetchData(); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  const statusColor: any = { available: 'bg-green-100 text-green-700', ready: 'bg-green-100 text-green-700', not_ready: 'bg-red-100 text-red-700', under_maintenance: 'bg-yellow-100 text-yellow-700', expired: 'bg-red-200 text-red-800', inspection_due: 'bg-orange-100 text-orange-700', inspection_overdue: 'bg-red-100 text-red-700', out_of_service: 'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Equipment</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', equipmentType: 'Fire Extinguisher', location: '', siteId: '', serialNumber: '', nextInspection: '', inspectionStatus: 'available' }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add Equipment</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.equipmentType} onChange={(e: any) => setFilters({ ...filters, equipmentType: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Types</option>
          {['Fire Extinguisher','Fire Hydrant','Fire Alarm','AED','Rescue Kit','Spill Kit','First Aid Kit','Evacuation Chair','Emergency Light','PA System','Stretcher'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.inspectionStatus} onChange={(e: any) => setFilters({ ...filters, inspectionStatus: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          {['available','ready','not_ready','under_maintenance','expired','inspection_due','inspection_overdue','out_of_service'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.inspectionOverdue} onChange={(e: any) => setFilters({ ...filters, inspectionOverdue: e.target.checked, page: 1 })} /> Overdue Only</label>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Type</th><th className="text-left px-4 py-3 font-medium">Location</th><th className="text-left px-4 py-3 font-medium">Next Inspection</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-xs">{item.equipmentType}</td>
                <td className="px-4 py-3 text-xs">{item.location || '-'}</td>
                <td className="px-4 py-3 text-xs">{item.nextInspection ? new Date(item.nextInspection).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[item.inspectionStatus] || 'bg-gray-100'}`}>{item.inspectionStatus?.replace(/_/g, ' ')}</span></td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button onClick={() => openEdit(item)} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No equipment found</td></tr>}
          </tbody>
        </table>
      </div>
      {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}

      {showForm && <FormModal title={editId ? 'Edit Equipment' : 'New Equipment'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'equipmentType', label: 'Type', type: 'select', options: ['Fire Extinguisher','Fire Hydrant','Fire Alarm','AED','Rescue Kit','Spill Kit','First Aid Kit','Evacuation Chair','Emergency Light','PA System','Stretcher'] },
        { key: 'location', label: 'Location', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' }, { key: 'serialNumber', label: 'Serial Number', type: 'text' },
        { key: 'nextInspection', label: 'Next Inspection', type: 'date' }, { key: 'inspectionStatus', label: 'Status', type: 'select', options: ['available','ready','not_ready','under_maintenance','expired','inspection_due','inspection_overdue','out_of_service'] },
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
