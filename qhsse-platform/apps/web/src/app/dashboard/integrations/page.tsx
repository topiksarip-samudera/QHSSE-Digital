'use client'; import { useState, useEffect } from 'react'; import { integrationCenterApi } from '@/lib/api';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => { (async () => {
    try { const r = await integrationCenterApi.getIntegrations(); setIntegrations(r.data.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  const handleTest = async (id: string) => { try { const r = await integrationCenterApi.testIntegration(id); setTestResult(r.data); } catch (e) { console.error(e); } };
  const handleSync = async (id: string) => { try { await integrationCenterApi.syncIntegration(id); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Integration Center</h1>
      {testResult && (<div className={`p-3 rounded-lg text-sm ${testResult.success?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>Test: {testResult.integration} ({testResult.type}) - {testResult.success?'Success':'Failed'}<button onClick={()=>setTestResult(null)} className="ml-2 underline">Dismiss</button></div>)}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : integrations.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No integrations</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auth</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mappings</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {integrations.map((i:any)=>(<tr key={i.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{i.name}</td><td className="px-4 py-3 text-sm">{i.type}</td><td className="px-4 py-3 text-xs">{i.authType||'none'}</td><td className="px-4 py-3 text-sm">{i._count?.mappings||0}</td><td className="px-4 py-3 text-right space-x-2"><button onClick={()=>handleTest(i.id)} className="text-sm text-blue-600 hover:underline">Test</button><button onClick={()=>handleSync(i.id)} className="text-sm text-green-600 hover:underline">Sync</button></td></tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
