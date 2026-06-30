'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const statusColors: Record<string,string> = { active:'bg-green-100 text-green-800', overdue:'bg-red-100 text-red-800', upcoming:'bg-blue-100 text-blue-800', completed:'bg-gray-100 text-gray-700' };

export default function CalibrationListPage() {
  const [data, setData] = useState<any[]>([]); const [dueData, setDueData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'due'>('all');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [r, d] = await Promise.all([apiClient.get('/asset/calibrations'), apiClient.get('/asset/calibrations?status=due')]);
      setData(r.data.data || r.data || []); setDueData(d.data.data || d.data || []);
    } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load calibrations'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const displayData = activeTab === 'all' ? data : dueData;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Calibration Management</h1><p className="text-gray-600 mt-1">Asset calibration schedules and status</p></div>

      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>All Calibrations ({data.length})</button>
        <button onClick={() => setActiveTab('due')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'due' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Due / Overdue ({dueData.length})</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Equipment</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Serial #</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Calibrated</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Due Date</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead>
          <tbody>
            {displayData.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.equipmentName || d.name || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.serialNumber || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.calibrationDate ? new Date(d.calibrationDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.calibrationDue ? new Date(d.calibrationDue).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>{d.status || 'unknown'}</span></td>
              </tr>
            ))}
            {displayData.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No calibrations found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
