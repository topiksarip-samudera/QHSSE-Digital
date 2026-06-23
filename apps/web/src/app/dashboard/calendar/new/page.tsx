'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calendarApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateSchedulePage() {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', type: 'inspection', startDate: '', endDate: '', frequency: '', interval: 1, reminderMinutes: [1440] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate) { setError('Name and start date required'); return; }
    setSaving(true);
    try { const r = await calendarApi.createSchedule({ ...form, interval: Number(form.interval), frequency: form.frequency || undefined, endDate: form.endDate || undefined }); router.push(`/dashboard/calendar/${r.data.id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/calendar" className="hover:text-blue-600">Calendar</Link><span>/</span><span className="text-gray-900">New Schedule</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Schedule</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="audit">Audit</option><option value="inspection">Inspection</option><option value="training">Training</option><option value="drill">Drill</option><option value="maintenance">Maintenance</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">Recurrence</h3>
          <div className="flex gap-3 items-end"><div><label className="block text-xs mb-1">Frequency</label><select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="px-3 py-2 border rounded-lg text-sm"><option value="">None</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></div><div><label className="block text-xs mb-1">Every</label><input type="number" value={form.interval} onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })} className="w-20 px-3 py-2 border rounded-lg text-sm" min={1} /></div><span className="text-sm text-gray-500 pb-2">{form.frequency || 'N/A'}</span></div>
        </div>
        <div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create'}</button><Link href="/dashboard/calendar" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </form>
    </div>
  );
}
