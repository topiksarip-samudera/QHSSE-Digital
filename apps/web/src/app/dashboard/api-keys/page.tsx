'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiKeyApi, ApiKeyData } from '@/lib/api';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState<any>(null);
  const [form, setForm] = useState({ name: '', expiresAt: '', scopes: '', maxRequests: 0 });
  const [creating, setCreating] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try { const r = await apiKeyApi.getKeys(); setKeys(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleCreate = async () => {
    if (!form.name) return;
    setCreating(true);
    try {
      const r = await apiKeyApi.createKey({
        name: form.name, expiresAt: form.expiresAt || undefined,
        scopes: form.scopes ? form.scopes.split(',').map((s: string) => s.trim()) : undefined,
        maxRequests: form.maxRequests || undefined,
      });
      setNewKey(r.data); setShowCreate(false); fetchKeys();
    } catch (e) { console.error(e); } finally { setCreating(false); }
  };

  const handleRevoke = async (id: string) => { if (!confirm('Revoke?')) return; try { await apiKeyApi.revokeKey(id); fetchKeys(); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">API Key Management</h1><p className="text-gray-600 mt-1">Manage API keys with scopes and rate limits</p></div>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Create Key</button>
      </div>

      {newKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-bold text-green-800">New API Key Created — Copy it now!</p>
          <p className="text-sm font-mono mt-1 break-all text-green-900">{newKey.apiKey}</p>
          <p className="text-xs text-gray-500 mt-1">Prefix: {newKey.prefix}</p>
          <button onClick={() => setNewKey(null)} className="mt-2 text-sm text-gray-500 hover:underline">Dismiss</button>
        </div>
      )}

      {showCreate && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Create API Key</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Expires At</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Scopes (comma-separated)</label><input type="text" value={form.scopes} onChange={(e) => setForm({ ...form, scopes: e.target.value })} placeholder="*:*, users:read" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Max Requests (/hour)</label><input type="number" value={form.maxRequests} onChange={(e) => setForm({ ...form, maxRequests: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          </div>
          <div className="flex gap-2"><button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{creating ? '...' : 'Create'}</button><button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </div>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : keys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No API keys</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prefix</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scopes</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate Limit</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {keys.map((k: any) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{k.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{k.keyPrefix}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${k.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{k.status}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{k.scopes?.map((s: any) => s.resource).join(', ') || '*'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{k.rateLimit ? `${k.rateLimit.maxRequests}/h` : '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-3 text-right">
                    {k.status === 'active' && <button onClick={() => handleRevoke(k.id)} className="text-sm text-red-600 hover:underline mr-2">Revoke</button>}
                    <button onClick={async () => { try { const r = await apiKeyApi.rotateKey(k.id); setNewKey(r.data); fetchKeys(); } catch (e) { console.error(e); } }} className="text-sm text-blue-600 hover:underline">Rotate</button>
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
