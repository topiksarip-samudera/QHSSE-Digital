'use client'; import { useState, useEffect, useCallback } from 'react'; import { useParams, useRouter } from 'next/navigation'; import { incidentReportApi } from '@/lib/api'; import Link from 'next/link';

export default function EditIncidentPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [incident, setIncident] = useState<any>(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', incidentDate: '', siteId: '', immediateAction: '' });

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await incidentReportApi.getIncident(id); const i = r.data; setIncident(i); setForm({ title: i.title, description: i.description, incidentDate: i.incidentDate?.split('T')[0] || '', siteId: i.siteId || '', immediateAction: i.immediateAction || '' }); } catch (e) { console.error(e); } finally { setLoading(false); } }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => { setSaving(true); try { await incidentReportApi.updateIncident(id, form); router.push(`/dashboard/incident/${id}`); } catch (e) { console.error(e); } finally { setSaving(false); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/incident" className="hover:text-blue-600">Incidents</Link><span>/</span><Link href={`/dashboard/incident/${id}`} className="hover:text-blue-600">{incident?.title}</Link><span>/</span><span className="text-gray-900">Edit</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Incident</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div><div><label className="block text-sm font-medium mb-1">Site</label><input type="text" value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div></div>
        <div><label className="block text-sm font-medium mb-1">Immediate Action</label><textarea value={form.immediateAction} onChange={(e) => setForm({ ...form, immediateAction: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saving ? 'Saving...' : 'Save'}</button><Link href={`/dashboard/incident/${id}`} className="px-6 py-2 border rounded-lg text-sm">Cancel</Link></div>
      </form>
    </div>
  );
}
