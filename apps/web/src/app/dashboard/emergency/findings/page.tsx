'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const severityColors: Record<string,string> = { low:'bg-blue-100 text-blue-800', medium:'bg-yellow-100 text-yellow-800', high:'bg-orange-100 text-orange-800', critical:'bg-red-100 text-red-800' };
const statusColors: Record<string,string> = { open:'bg-red-100 text-red-800', in_progress:'bg-yellow-100 text-yellow-800', resolved:'bg-green-100 text-green-800', closed:'bg-gray-100 text-gray-700' };

export default function EmergencyFindingsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/emergency/findings'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load findings'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Emergency Findings</h1><p className="text-gray-600 mt-1">Findings from drills, inspections, and incident reviews</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.title || d.finding || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.source || d.sourceType || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${severityColors[d.severity] || 'bg-gray-100 text-gray-700'}`}>{d.severity || '-'}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>{d.status?.replace(/_/g, ' ') || '-'}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No findings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
