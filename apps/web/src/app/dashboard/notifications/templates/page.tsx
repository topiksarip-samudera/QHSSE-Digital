'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationApi, NotificationTemplateData } from '@/lib/api';
import Link from 'next/link';

const CHANNEL_LABELS: Record<string, string> = {
  'in-app': 'In-App',
  'email': 'Email',
  'both': 'Both',
};

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    subject: '',
    body: '',
    type: 'info',
    channel: 'both',
    isActive: true,
  });
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getTemplates();
      setTemplates(res.data);
    } catch (e) {
      console.error('Failed to load templates', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ code: '', name: '', subject: '', body: '', type: 'info', channel: 'both', isActive: true });
    setShowCreate(false);
    setEditId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await notificationApi.updateTemplate(editId, form);
      } else {
        await notificationApi.createTemplate(form);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save template');
    }
  };

  const handleEdit = (t: NotificationTemplateData) => {
    setEditId(t.id);
    setForm({
      code: t.code,
      name: t.name,
      subject: t.subject,
      body: t.body,
      type: t.type,
      channel: t.channel,
      isActive: t.isActive,
    });
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await notificationApi.deleteTemplate(id);
    load();
  };

  const handleToggleActive = async (t: NotificationTemplateData) => {
    await notificationApi.updateTemplate(t.id, { isActive: !t.isActive });
    load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/notifications" className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            ← Back to Notifications
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notification Templates</h1>
          <p className="text-sm text-gray-500 mt-1">{templates.length} templates</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          + New Template
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreate && (
        <div className="border rounded-lg p-6 mb-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Template' : 'Create Template'}</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  disabled={!!editId}
                  className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
                  placeholder="e.g. incident_created"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. Incident Created"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Email/notification subject line"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={4}
                placeholder="Notification body. Use {{variable}} for dynamic values."
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  {['info', 'warning', 'alert', 'workflow', 'action', 'reminder'].map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <select
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="both">Both</option>
                  <option value="in-app">In-App</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-500">No templates yet</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Channel</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{t.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{t.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{CHANNEL_LABELS[t.channel] || t.channel}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(t)}
                      className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {t.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(t)} className="text-xs text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
