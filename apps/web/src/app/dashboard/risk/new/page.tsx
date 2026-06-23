'use client'; import { useState } from 'react'; import { useRouter } from 'next/navigation'; import { riskReportApi } from '@/lib/api'; import Link from 'next/link';

export default function CreateRiskPage() {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', riskOwnerId: '', initialSeverity: '', initialLikelihood: '', riskType: '', siteId: '' });

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!form.title||!form.riskOwnerId) { setError('Title and owner required'); return; } setSaving(true); try { const r = await riskReportApi.createRisk({...form, initialSeverity: Number(form.initialSeverity)||undefined, initialLikelihood: Number(form.initialLikelihood)||undefined }); router.push(`/dashboard/risk/${r.data.id}`); } catch (err: any) { setError(err?.response?.data?.message||'Failed'); } finally { setSaving(false); } };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/risk" className="hover:text-blue-600">Risk Register</Link><span>/</span><span className="text-gray-900">New Risk</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Risk</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error&&<div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Risk Owner ID *</label><input type="text" value={form.riskOwnerId} onChange={(e)=>setForm({...form,riskOwnerId:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Severity (1-5)</label><input type="number" min={1} max={5} value={form.initialSeverity} onChange={(e)=>setForm({...form,initialSeverity:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Likelihood (1-5)</label><input type="number" min={1} max={5} value={form.initialLikelihood} onChange={(e)=>setForm({...form,initialLikelihood:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Risk Type</label><input type="text" value={form.riskType} onChange={(e)=>setForm({...form,riskType:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="safety, health, environment..." /></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saving?'Saving...':'Create Risk'}</button><Link href="/dashboard/risk" className="px-6 py-2 border rounded-lg text-sm">Cancel</Link></div>
      </form>
    </div>
  );
}
