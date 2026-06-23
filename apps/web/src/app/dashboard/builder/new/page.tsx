'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardBuilderApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateDashboardPage() {
  const router = useRouter(); const [saving, setSaving] = useState(false);
  const [name, setName] = useState(''); const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!name) return;
    setSaving(true);
    try { const r = await dashboardBuilderApi.createDashboard({ name, description: description || undefined }); router.push(`/dashboard/builder/${r.data.id}`); } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/builder" className="hover:text-blue-600">Dashboards</Link><span>/</span><span className="text-gray-900">New</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex gap-3"><button onClick={handleSubmit} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saving ? '...' : 'Create'}</button><Link href="/dashboard/builder" className="px-6 py-2 border rounded-lg text-sm">Cancel</Link></div>
      </div>
    </div>
  );
}
