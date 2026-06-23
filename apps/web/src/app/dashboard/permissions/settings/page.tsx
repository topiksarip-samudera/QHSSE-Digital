'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function AdvancedPermissionPage() {
  const [simResult, setSimResult] = useState<any>(null);
  const [userId, setUserId] = useState(''); const [module, setModule] = useState(''); const [simLoading, setSimLoading] = useState(false);

  const handleSimulate = async () => {
    if (!userId || !module) return;
    setSimLoading(true);
    try {
      const { advancedPermissionApi } = await import('@/lib/api');
      const r = await advancedPermissionApi.simulate({ userId, module });
      setSimResult(r.data);
    } catch (e) { console.error(e); } finally { setSimLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Advanced Permission Management</h1>
      <p className="text-gray-600">Field-level, record-level permissions, data masking, temporary access, and permission simulation</p>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Permission Simulator</h2>
        <p className="text-sm text-gray-500">Test what a user can access in a given module</p>
        <div className="flex gap-3 items-end">
          <div><label className="block text-sm font-medium mb-1">User ID</label><input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="px-3 py-2 border rounded-lg text-sm w-40" /></div>
          <div><label className="block text-sm font-medium mb-1">Module</label><input type="text" value={module} onChange={(e) => setModule(e.target.value)} className="px-3 py-2 border rounded-lg text-sm w-40" placeholder="e.g. actions" /></div>
          <button onClick={handleSimulate} disabled={simLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{simLoading ? 'Simulating...' : 'Simulate'}</button>
        </div>
        {simResult && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <pre className="text-xs">{JSON.stringify(simResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { title: 'Access Policies', desc: 'Rule-based policies per module with conditions' },
            { title: 'Field Permissions', desc: 'Control read/write/hidden per field per role' },
            { title: 'Record Permissions', desc: 'Per-record access grants for specific users/roles' },
            { title: 'Data Masking', desc: 'Full, partial, regex, credit card, email masking' },
            { title: 'Temporary Access', desc: 'Time-limited access grants with expiry' },
            { title: 'Simulator', desc: 'Test permission outcome for any user/module' },
          ].map((c) => (
            <div key={c.title} className="border rounded-lg p-3">
              <p className="font-medium text-gray-900">{c.title}</p>
              <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
