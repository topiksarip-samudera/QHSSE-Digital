'use client';

import { useState, useEffect, useCallback } from 'react';
import { ssoApi, SsoProviderData } from '@/lib/api';

const PROVIDER_ICONS: Record<string, string> = { google: '(G)', azure: '(M)', okta: '(O)', keycloak: '(K)', oidc: '(OIDC)', saml: '(SAML)' };

export default function SsoListPage() {
  const [providers, setProviders] = useState<SsoProviderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await ssoApi.getProviders(); setProviders(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTest = async (id: string) => { try { const r = await ssoApi.testProvider(id); setTestResult(r.data); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">SSO Providers</h1><p className="text-gray-600 mt-1">Manage single sign-on with OIDC, SAML, Google, Azure, Okta, Keycloak</p></div>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-sm font-medium">{testResult.success ? 'Configuration Valid' : 'Test Failed'}</p>
          <p className="text-xs mt-1">Provider: {testResult.testResult?.provider} | Keys: {testResult.testResult?.configKeys?.join(', ') || 'none'}</p>
          <button onClick={() => setTestResult(null)} className="text-xs mt-2 text-gray-500 hover:underline">Dismiss</button>
        </div>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : providers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No SSO providers</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mappings</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logins</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-sm"><span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{p.provider}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.mappings?.length || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p._count?.logs || 0}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleTest(p.id)} className="text-sm text-blue-600 hover:underline">Test</button>
                    <button onClick={async () => { if (confirm('Delete?')) { await ssoApi.deleteProvider(p.id); fetchData(); } }} className="text-sm text-red-600 hover:underline">Delete</button>
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
