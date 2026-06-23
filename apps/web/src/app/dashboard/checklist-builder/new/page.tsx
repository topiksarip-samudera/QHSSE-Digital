'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checklistApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateChecklistPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [passScore, setPassScore] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    try {
      const res = await checklistApi.createChecklist({ name, description: description || undefined, passScore: passScore ? Number(passScore) : undefined });
      router.push(`/dashboard/checklist-builder/${res.data.id}`);
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/checklist-builder" className="hover:text-blue-600">Checklist Builder</Link><span>/</span><span className="text-gray-900">New Checklist</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Checklist</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label><input type="number" value={passScore} onChange={(e) => setPassScore(e.target.value)} className="w-32 px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 80" /></div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create Checklist'}</button><Link href="/dashboard/checklist-builder" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
