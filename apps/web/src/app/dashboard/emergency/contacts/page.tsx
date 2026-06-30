'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyContactsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ contactType: '', status: '', search: '', page: 1 });
  const [form, setForm] = useState<any>({ name: '', title: '', organization: '', contactType: 'internal', phone: '', mobile: '', email: '', isPrimary: false, siteId: '', priority: 0 });

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.contactType) params.contactType = filters.contactType;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    apiClient.get('/emergency/contacts', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/contacts', form); setShowForm(false); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/contacts/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete contact?')) { await apiClient.delete(`/emergency/contacts/${id}`); fetchData(); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', title: '', organization: '', contactType: 'internal', phone: '', mobile: '', email: '', isPrimary: false, siteId: '', priority: 0 }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add Contact</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.contactType} onChange={(e: any) => setFilters({ ...filters, contactType: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Types</option>
          <option value="internal">Internal</option><option value="external">External</option>
        </select>
        <select value={filters.status} onChange={(e: any) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          <option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Title/Org</th><th className="text-left px-4 py-3 font-medium">Type</th><th className="text-left px-4 py-3 font-medium">Phone</th><th className="text-left px-4 py-3 font-medium">Email</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{item.name}{item.isPrimary && ' ⭐'}</td>
                <td className="px-4 py-3 text-xs">{item.title}{item.organization ? `, ${item.organization}` : ''}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.contactType === 'internal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.contactType}</span></td>
                <td className="px-4 py-3">{item.phone || item.mobile || '-'}</td>
                <td className="px-4 py-3 text-xs">{item.email || '-'}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button onClick={() => openEdit(item)} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No contacts found</td></tr>}
          </tbody>
        </table>
      </div>
      {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}

      {showForm && <FormModal title={editId ? 'Edit Contact' : 'New Contact'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'title', label: 'Title', type: 'text' }, { key: 'organization', label: 'Organization', type: 'text' }, { key: 'contactType', label: 'Type', type: 'select', options: ['internal','external'] },
        { key: 'phone', label: 'Phone', type: 'text' }, { key: 'mobile', label: 'Mobile', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' }, { key: 'priority', label: 'Priority', type: 'number' },
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
      <div className="bg-card rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">{title}</h2>
        {fields.map((f: any) => (
          <div key={f.key}><label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.key] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background"><option value="">--Select--</option>{f.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}</select>
            ) : (
              <input type={f.type || 'text'} value={form[f.key] != null ? form[f.key] : ''} onChange={e => onChange({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
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
