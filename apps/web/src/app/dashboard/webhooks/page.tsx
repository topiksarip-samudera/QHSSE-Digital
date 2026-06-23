'use client';

import { useState, useEffect, useCallback } from 'react';
import { webhookApi, WebhookData } from '@/lib/api';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', description: '', events: '', secret: '' });
  const [testResult, setTestResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await webhookApi.getWebhooks(); setWebhooks(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!form.name || !form.url) return;
    setCreating(true);
    try {
      await webhookApi.createWebhook({
        name: form.name, url: form.url, description: form.description || undefined,
        events: form.events ? form.events.split(',').map((s: string) => s.trim()) : undefined,
        secret: form.secret || undefined,
      });
      setShowCreate(false); fetchData(); setForm({ name: '', url: '', description: '', events: '', secret: '' });
    } catch (e) { console.error(e); } finally { setCreating(false); }
  };

  const handleTest = async (id: string) => {
    try { const r = await webhookApi.testWebhook(id); setTestResult(r.data); } catch (e) { console.error(e); }
  };

  const handleViewLogs = async (id: string) => {
    setSelectedId(id);
    try { const r = await webhookApi.getLogs(id); setLogs(r.data || []); } catch (e) { console.error(e); }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try { await webhookApi.updateWebhook(id, { isActive: !active }); fetchData(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1><p className="text-gray-600 mt-1">Configure outgoing webhooks for event-driven integrations</p></div>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Add Webhook</button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-sm font-medium">{testResult.success ? 'Test Successful' : 'Test Failed'}</p>
          <p className="text-xs mt-1">Status: {testResult.statusCode || testResult.error} | Duration: {testResult.duration}ms</p>
          <button onClick={() => setTestResult(null)} className="text-xs text-gray-500 mt-2 hover:underline">Dismiss</button>
        </div>
      )}

      {showCreate && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Webhook</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">URL *</label><input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Events (comma-separated)</label><input type="text" value={form.events} onChange={(e) => setForm({ ...form, events: e.target.value })} placeholder="action.created, incident.submitted" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          </div>
          <div className="flex gap-2"><button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{creating ? '...' : 'Create'}</button><button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </div>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : webhooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No webhooks</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logs</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {webhooks.map((w: any) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{w.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-xs">{w.url}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{w.events?.map((e: any) => e.event).join(', ') || '*'}</td>
                  <td className="px-4 py-3"><button onClick={() => handleToggle(w.id, w.isActive)} className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${w.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{w.isActive ? 'Active' : 'Disabled'}</button></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{w._count?.logs || 0}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleTest(w.id)} className="text-sm text-blue-600 hover:underline">Test</button>
                    <button onClick={() => handleViewLogs(w.id)} className="text-sm text-gray-600 hover:underline">Logs</button>
                    <button onClick={async () => { if (confirm('Delete?')) { await webhookApi.deleteWebhook(w.id); fetchData(); } }} className="text-sm text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Delivery Logs ({selectedId})</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">{logs.map((l: any) => (<li key={l.id} className="text-xs flex gap-3"><span className={l.statusCode && l.statusCode >= 200 && l.statusCode < 300 ? 'text-green-600' : 'text-red-600'}>{l.statusCode || l.error}</span><span className="text-gray-400">{l.event}</span><span className="text-gray-300">{l.duration}ms</span><span className="text-gray-300">{new Date(l.createdAt).toLocaleString()}</span></li>))}</ul>
        </div>
      )}
    </div>
  );
}
