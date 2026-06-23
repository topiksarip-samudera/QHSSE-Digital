'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { templateApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateTemplatePage() {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', type: 'document', isGlobal: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError('Name required'); return; }
    setSaving(true);
    try { const res = await templateApi.createTemplate(form); router.push(`/dashboard/templates/${res.data.id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/templates" className="hover:text-blue-600">Templates</Link><span>/</span><span className="text-gray-900">New</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="document">Document</option><option value="email">Email</option><option value="report">Report</option><option value="checklist">Checklist</option><option value="form">Form</option></select></div>
          <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isGlobal} onChange={(e) => setForm({ ...form, isGlobal: e.target.checked })} className="rounded" />Global Template</label></div>
        </div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create'}</button><Link href="/dashboard/templates" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
