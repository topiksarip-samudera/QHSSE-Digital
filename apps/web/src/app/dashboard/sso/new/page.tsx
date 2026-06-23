'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ssoApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateSsoPage() {
  const router = useRouter(); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', provider: 'oidc', clientId: '', clientSecret: '', issuerUrl: '' });

  const handleSubmit = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      await ssoApi.createProvider({ name: form.name, provider: form.provider, config: { clientId: form.clientId, clientSecret: form.clientSecret, issuerUrl: form.issuerUrl } });
      router.push('/dashboard/sso');
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/sso" className="hover:text-blue-600">SSO</Link><span>/</span><span className="text-gray-900">Add Provider</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Add SSO Provider</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Provider</label><select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="oidc">OIDC</option><option value="saml">SAML</option><option value="google">Google Workspace</option><option value="azure">Microsoft Entra ID</option><option value="okta">Okta</option><option value="keycloak">Keycloak</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Client ID</label><input type="text" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Client Secret</label><input type="password" value={form.clientSecret} onChange={(e) => setForm({ ...form, clientSecret: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium mb-1">Issuer URL</label><input type="text" value={form.issuerUrl} onChange={(e) => setForm({ ...form, issuerUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." /></div>
        </div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSubmit} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saving ? '...' : 'Create'}</button><Link href="/dashboard/sso" className="px-6 py-2 border rounded-lg text-sm">Cancel</Link></div>
      </div>
    </div>
  );
}
