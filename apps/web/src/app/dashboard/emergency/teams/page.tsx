'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyTeamsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ status: '', search: '', page: 1 });
  const [form, setForm] = useState<any>({ name: '', teamCode: '', description: '', siteId: '', leaderId: '' });
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [memberForm, setMemberForm] = useState<any>({ userId: '', role: 'ERT Member', isBackup: false, phone: '', email: '' });

  const fetchData = () => {
    setLoading(true);
    const params: any = { page: filters.page, limit: 10 };
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    apiClient.get('/emergency/teams', { params }).then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async () => { await apiClient.post('/emergency/teams', form); setShowForm(false); fetchData(); };
  const handleUpdate = async () => { await apiClient.patch(`/emergency/teams/${editId}`, form); setShowForm(false); setEditId(null); fetchData(); };
  const handleDelete = async (id: string) => { if (confirm('Delete this team?')) { await apiClient.delete(`/emergency/teams/${id}`); fetchData(); } };
  const openEdit = (item: any) => { setEditId(item.id); setForm(item); setShowForm(true); };

  const addMember = async () => { if (!selectedTeam) return; await apiClient.post(`/emergency/teams/${selectedTeam.id}/members`, memberForm); setMemberForm({ userId: '', role: 'ERT Member', isBackup: false, phone: '', email: '' }); refreshTeam(selectedTeam.id); };
  const removeMember = async (teamId: string, memberId: string) => { await apiClient.delete(`/emergency/teams/${teamId}/members/${memberId}`); refreshTeam(teamId); };
  const refreshTeam = async (id: string) => { const r = await apiClient.get(`/emergency/teams/${id}`); setSelectedTeam(r.data); };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Response Teams</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', teamCode: '', description: '', siteId: '', leaderId: '' }); setShowForm(true); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add Team</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input placeholder="Search..." value={filters.search} onChange={(e: any) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background w-48" />
        <select value={filters.status} onChange={(e: any) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          <option value="active">Active</option><option value="inactive">Inactive</option><option value="standby">Standby</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className={`rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors ${selectedTeam?.id === item.id ? 'border-primary bg-accent' : 'bg-card'}`} onClick={() => { setSelectedTeam(item); refreshTeam(item.id); }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description || 'No description'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : item.status === 'standby' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span>
                  <span className="text-xs text-muted-foreground">{item.members?.length || 0} members</span>
                  <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">Edit</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Del</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">No teams found</p>}
          {total > 10 && <Pagination page={filters.page} total={total} limit={10} onChange={(p: number) => setFilters({ ...filters, page: p })} />}
        </div>

        {/* Team Detail / Members */}
        <div className="space-y-4">
          {selectedTeam ? (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-3">Team Members: {selectedTeam.name}</h3>
              <div className="space-y-2 mb-4">
                {selectedTeam.members?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between text-sm py-1 border-b last:border-b-0">
                    <div><span className="font-medium">{m.role}</span> <span className="text-muted-foreground">({m.userId})</span> {m.isBackup && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Backup</span>}</div>
                    <button onClick={() => removeMember(selectedTeam.id, m.id)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <input placeholder="User ID" value={memberForm.userId} onChange={e => setMemberForm({ ...memberForm, userId: e.target.value })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background" />
                <select value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} className="w-full rounded-md border px-3 py-1.5 text-sm bg-background">
                  {['Incident Commander','Safety Officer','Operations Officer','First Aider','Fire Warden','Evacuation Marshal','ERT Member','Logistics','Planning'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={memberForm.isBackup} onChange={e => setMemberForm({ ...memberForm, isBackup: e.target.checked })} /> Is Backup</label>
                <button onClick={addMember} className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Add Member</button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-4 text-center text-muted-foreground text-sm">Select a team to view members</div>
          )}
        </div>
      </div>

      {showForm && <FormModal title={editId ? 'Edit Team' : 'New Team'} form={form} onChange={setForm} onSave={editId ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditId(null); }} fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'teamCode', label: 'Team Code', type: 'text' }, { key: 'description', label: 'Description', type: 'text' }, { key: 'siteId', label: 'Site ID', type: 'text' }, { key: 'leaderId', label: 'Leader ID', type: 'text' },
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
            <input type="text" value={form[f.key] || ''} onChange={e => onChange({ ...form, [f.key]: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
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
