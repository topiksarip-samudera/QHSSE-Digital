'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { numberingApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateNumberingPage() {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', moduleCode: '', prefix: '', suffix: '', digitCount: 5, connector: '-', resetBy: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.moduleCode) { setError('Name and module code required'); return; }
    setSaving(true);
    try { const res = await numberingApi.createRule(form); router.push(`/dashboard/numbering/${res.data.id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/numbering" className="hover:text-blue-600">Numbering</Link><span>/</span><span className="text-gray-900">New Rule</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Numbering Rule</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Module Code *</label><input type="text" value={form.moduleCode} onChange={(e) => setForm({ ...form, moduleCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. incident" /></div>
          <div><label className="block text-sm font-medium mb-1">Prefix</label><input type="text" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="INC" /></div>
          <div><label className="block text-sm font-medium mb-1">Suffix</label><input type="text" value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Digits</label><input type="number" value={form.digitCount} onChange={(e) => setForm({ ...form, digitCount: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" min={1} max={10} /></div>
          <div><label className="block text-sm font-medium mb-1">Connector</label><input type="text" value={form.connector} onChange={(e) => setForm({ ...form, connector: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Reset By</label><select value={form.resetBy} onChange={(e) => setForm({ ...form, resetBy: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">None</option><option value="year">Year</option><option value="month">Month</option><option value="year_month">Year-Month</option></select></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create Rule'}</button><Link href="/dashboard/numbering" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
