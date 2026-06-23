'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { numberingApi, NumberingRule } from '@/lib/api';
import Link from 'next/link';

export default function EditNumberingPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [rule, setRule] = useState<NumberingRule | null>(null); const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', prefix: '', suffix: '', digitCount: 5, connector: '-', resetBy: '', isActive: true });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await numberingApi.getRule(id); const r = res.data; setRule(r); setForm({ name: r.name, prefix: r.prefix, suffix: r.suffix, digitCount: r.digitCount, connector: r.connector, resetBy: r.resetBy || '', isActive: r.isActive }); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try { await numberingApi.updateRule(id, { name: form.name, prefix: form.prefix, suffix: form.suffix, digitCount: form.digitCount, connector: form.connector, resetBy: form.resetBy || undefined, isActive: form.isActive }); router.push(`/dashboard/numbering/${id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!rule) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/numbering" className="hover:text-blue-600">Numbering</Link><span>/</span><Link href={`/dashboard/numbering/${id}`} className="hover:text-blue-600">{rule.name}</Link><span>/</span><span className="text-gray-900">Edit</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Rule</h1>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Prefix</label><input type="text" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Suffix</label><input type="text" value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Digits</label><input type="number" value={form.digitCount} onChange={(e) => setForm({ ...form, digitCount: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Connector</label><input type="text" value={form.connector} onChange={(e) => setForm({ ...form, connector: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Reset By</label><select value={form.resetBy} onChange={(e) => setForm({ ...form, resetBy: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">None</option><option value="year">Year</option><option value="month">Month</option><option value="year_month">Year-Month</option></select></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />Active</label>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save'}</button><Link href={`/dashboard/numbering/${id}`} className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
