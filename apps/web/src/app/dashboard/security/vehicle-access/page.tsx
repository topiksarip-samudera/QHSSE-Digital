'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const statusColors: Record<string,string> = { inside:'bg-green-100 text-green-800', exited:'bg-gray-100 text-gray-700', pending:'bg-yellow-100 text-yellow-800', denied:'bg-red-100 text-red-800' };

export default function VehicleAccessPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/security/vehicle-access'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load vehicle access logs'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Vehicle Access Log</h1><p className="text-gray-600 mt-1">Vehicle entry and exit records</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plate #</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Driver</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Entry Time</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Exit Time</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.plateNumber || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.vehicleMake ? `${d.vehicleMake} ${d.vehicleModel || ''}` : '-'}</td>
                <td className="px-4 py-3 text-sm">{d.driverName || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.entryTime ? new Date(d.entryTime).toLocaleString() : '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.exitTime ? new Date(d.exitTime).toLocaleString() : '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>{d.status || '-'}</span></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No vehicle access records found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
