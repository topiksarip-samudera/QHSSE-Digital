'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templateApi, TemplateData } from '@/lib/api';
import Link from 'next/link';

export default function EditTemplatePage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [template, setTemplate] = useState<TemplateData | null>(null); const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', type: '', content: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await templateApi.getTemplate(id); const t = res.data; setTemplate(t); setForm({ name: t.name, description: t.description || '', type: t.type, content: JSON.stringify(t.content, null, 2) }); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let content: any = {};
      try { content = JSON.parse(form.content); } catch {}
      await templateApi.updateTemplate(id, { name: form.name, description: form.description, type: form.type, content });
      router.push(`/dashboard/templates/${id}`);
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!template) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/templates" className="hover:text-blue-600">Templates</Link><span>/</span><Link href={`/dashboard/templates/${id}`} className="hover:text-blue-600">{template.name}</Link><span>/</span><span className="text-gray-900">Edit</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="document">Document</option><option value="email">Email</option><option value="report">Report</option><option value="checklist">Checklist</option><option value="form">Form</option></select></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Content (JSON)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" /></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save'}</button><Link href={`/dashboard/templates/${id}`} className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
