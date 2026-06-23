'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { actionApi, ActionData } from '@/lib/api';
import Link from 'next/link';

export default function EditActionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [action, setAction] = useState<ActionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await actionApi.getAction(id);
      const a = res.data;
      setAction(a);
      setForm({
        title: a.title || '',
        description: a.description || '',
        assignedTo: a.assignedTo || '',
        priority: a.priority || 'medium',
        dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split('T')[0] : '',
        status: a.status || 'draft',
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await actionApi.updateAction(id, {
        title: form.title,
        description: form.description || undefined,
        assignedTo: form.assignedTo,
        priority: form.priority as any,
        dueDate: form.dueDate || undefined,
        status: form.status as any,
      });
      router.push(`/dashboard/action-tracking/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!action) return <div className="text-center py-12 text-red-500">Action not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/action-tracking" className="hover:text-blue-600">Action Tracking</Link>
        <span>/</span>
        <Link href={`/dashboard/action-tracking/${id}`} className="hover:text-blue-600 truncate">{action.title}</Link>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Action</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="bg-white rounded-lg shadow p-6 space-y-5">
        {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <input type="text" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="draft">Draft</option><option value="submitted">Submitted</option><option value="in_review">In Review</option><option value="closed">Closed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
          <Link href={`/dashboard/action-tracking/${id}`} className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
