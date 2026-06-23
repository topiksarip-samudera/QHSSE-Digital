'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { actionApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateActionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    sourceType: '',
    sourceId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.assignedTo) {
      setError('Title and Assignee are required');
      return;
    }
    setSaving(true);
    try {
      await actionApi.createAction({
        title: form.title,
        description: form.description || undefined,
        assignedTo: form.assignedTo,
        priority: form.priority as any,
        dueDate: form.dueDate || undefined,
        sourceType: form.sourceType || undefined,
        sourceId: form.sourceId || undefined,
      });
      router.push('/dashboard/action-tracking');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create action');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/action-tracking" className="hover:text-blue-600">Action Tracking</Link>
        <span>/</span>
        <span className="text-gray-900">New Action</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Create Action</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee ID *</label>
            <input type="text" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="User ID" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
            <input type="text" value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="incident, audit, risk..." />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source ID</label>
          <input type="text" value={form.sourceId} onChange={(e) => setForm({ ...form, sourceId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. INC-001" />
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create Action'}</button>
          <Link href="/dashboard/action-tracking" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
