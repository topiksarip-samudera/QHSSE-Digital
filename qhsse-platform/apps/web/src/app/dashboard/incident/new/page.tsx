'use client'; import { useState } from 'react'; import { useRouter } from 'next/navigation'; import { incidentReportApi } from '@/lib/api'; import Link from 'next/link';

export default function CreateIncidentPage() {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', incidentDate: '', siteId: '', immediateAction: '' });

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!form.title || !form.incidentDate) { setError('Title and date required'); return; } setSaving(true); try { const r = await incidentReportApi.createIncident(form); router.push(`/dashboard/incident/${r.data.id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); } };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/incident" className="hover:text-blue-600">Incidents</Link><span>/</span><span className="text-gray-900">Report</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Report Incident</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Incident Date *</label><input type="date" value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Site</label><input type="text" value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Immediate Action</label><textarea value={form.immediateAction} onChange={(e) => setForm({ ...form, immediateAction: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saving ? 'Saving...' : 'Save Draft'}</button><Link href="/dashboard/incident" className="px-6 py-2 border rounded-lg text-sm">Cancel</Link></div>
      </form>
    </div>
  );
}
