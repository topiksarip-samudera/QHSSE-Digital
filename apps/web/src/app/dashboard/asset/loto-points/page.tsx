'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const typeColors: Record<string,string> = { electrical:'bg-yellow-100 text-yellow-800', mechanical:'bg-blue-100 text-blue-800', pneumatic:'bg-purple-100 text-purple-800', hydraulic:'bg-cyan-100 text-cyan-800', chemical:'bg-red-100 text-red-800', thermal:'bg-orange-100 text-orange-800' };

export default function LotoPointsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/asset/loto-points'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load LOTO points'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">LOTO Points</h1><p className="text-gray-600 mt-1">Lockout/Tagout isolation points for maintenance safety</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Point ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Energy Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Equipment</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.pointId || d.id}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${typeColors[d.energyType] || 'bg-gray-100 text-gray-700'}`}>{d.energyType || '-'}</span></td>
                <td className="px-4 py-3 text-sm">{d.equipmentName || d.assetName || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.location || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.status === 'active' ? 'bg-green-100 text-green-800' : d.status === 'locked' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>{d.status || '-'}</span></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No LOTO points found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
