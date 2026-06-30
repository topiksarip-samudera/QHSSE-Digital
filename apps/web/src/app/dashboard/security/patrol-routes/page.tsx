'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const statusColors: Record<string,string> = { active:'bg-green-100 text-green-800', completed:'bg-blue-100 text-blue-700', pending:'bg-yellow-100 text-yellow-800', cancelled:'bg-gray-100 text-gray-700' };
const freqColors: Record<string,string> = { hourly:'bg-purple-100 text-purple-800', daily:'bg-blue-100 text-blue-800', weekly:'bg-teal-100 text-teal-800', monthly:'bg-orange-100 text-orange-800' };

export default function PatrolRoutesPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/security/patrol-routes'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load patrol routes'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Patrol Routes</h1><p className="text-gray-600 mt-1">Security patrol routes and schedules</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Route Name</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Frequency</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Checkpoints</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Assigned To</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.name || d.routeName || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${freqColors[d.frequency] || 'bg-gray-100 text-gray-700'}`}>{d.frequency || '-'}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.checkpoints || d.checkpointCount || '-'}</td>
                <td className="px-4 py-3 text-sm">{d.assignedTo || d.guardName || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>{d.status || '-'}</span></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No patrol routes found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
