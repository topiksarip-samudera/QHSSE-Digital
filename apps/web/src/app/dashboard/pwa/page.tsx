'use client'; import { useState, useEffect } from 'react'; import { offlineSyncApi } from '@/lib/api';

export default function PwaPage() {
  const [status, setStatus] = useState<any>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const [s, c] = await Promise.all([offlineSyncApi.getStatus().catch(()=>({data:{}})), offlineSyncApi.getConflicts().catch(()=>({data:[]})) ]);
      setStatus(s.data); setConflicts(c.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  const handleResolve = async (id: string, resolution: string) => {
    try { await offlineSyncApi.resolveConflict(id, resolution); window.location.reload(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Offline PWA & Sync</h1>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="space-y-6">
          {status && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Queued</p><p className="text-2xl font-bold text-blue-600">{status.queued||0}</p></div>
              <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Failed</p><p className="text-2xl font-bold text-red-600">{status.failed||0}</p></div>
              <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Conflicts</p><p className="text-2xl font-bold text-yellow-600">{status.pendingConflicts||0}</p></div>
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Pending Conflicts</h2>
              <ul className="space-y-3">
                {conflicts.map((c:any) => (
                  <li key={c.id} className="border rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><p className="font-medium text-gray-700">Server Data</p><pre className="bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-24">{JSON.stringify(c.serverData,null,2)}</pre></div>
                      <div><p className="font-medium text-gray-700">Client Data</p><pre className="bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-24">{JSON.stringify(c.clientData,null,2)}</pre></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>handleResolve(c.id,'keep_server')} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Keep Server</button>
                      <button onClick={()=>handleResolve(c.id,'keep_client')} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Keep Client</button>
                      <button onClick={()=>handleResolve(c.id,'merge')} className="px-3 py-1 bg-purple-600 text-white rounded text-xs">Merge</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
