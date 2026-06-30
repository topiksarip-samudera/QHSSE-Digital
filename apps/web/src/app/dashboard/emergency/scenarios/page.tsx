'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const typeColors: Record<string,string> = { fire:'bg-red-100 text-red-800', 'chemical_spill':'bg-yellow-100 text-yellow-800', explosion:'bg-orange-100 text-orange-800', 'medical_emergency':'bg-blue-100 text-blue-800', earthquake:'bg-purple-100 text-purple-800', flood:'bg-cyan-100 text-cyan-800', evacuation:'bg-teal-100 text-teal-800', 'gas_leak':'bg-amber-100 text-amber-800' };

export default function EmergencyScenariosPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/emergency/scenarios'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load scenarios'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Emergency Scenarios</h1><p className="text-gray-600 mt-1">Emergency response scenarios and contingency plans</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Reviewed</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.name || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${typeColors[d.emergencyType] || 'bg-gray-100 text-gray-700'}`}>{d.emergencyType?.replace(/_/g, ' ') || '-'}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.severity === 'High' || d.severity === 'Critical' ? 'bg-red-100 text-red-800' : d.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{d.severity || '-'}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.status === 'active' ? 'bg-green-100 text-green-800' : d.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>{d.status || '-'}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.lastReviewed ? new Date(d.lastReviewed).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No scenarios found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
