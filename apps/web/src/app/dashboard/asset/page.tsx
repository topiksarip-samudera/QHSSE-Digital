'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

const KPI_LABELS: Record<string, string> = { totalAssets: 'Register Count', activeCertificates: 'Certificates', calibrationDue: 'Calibration Due', lotoPoints: 'LOTO Points', maintenanceDue: 'Maintenance Due', openInspections: 'Open Inspections', assetScore: 'Asset Score' };

export default function AssetDashboardPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await assetApi.getDashboard(); setData(r.data); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard'); console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const summary: Record<string, number> = data?.summary || {};
  if (Object.keys(summary).length === 0) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No asset dashboard data available</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Asset & Equipment Dashboard</h1><p className="text-gray-600 mt-1">Overview of asset management KPIs</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{KPI_LABELS[key] || key}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
      {data?.recentMaintenance && data.recentMaintenance.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent Maintenance</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.recentMaintenance.map((m: any) => (<tr key={m.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{m.assetName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{m.maintenanceType || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${m.status === 'completed' ? 'bg-green-100 text-green-800' : m.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{m.status || '-'}</span></td></tr>))}</tbody>
          </table>
        </div>
      )}
      {data?.upcomingCalibrations && data.upcomingCalibrations.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Upcoming Calibrations</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.upcomingCalibrations.map((c: any) => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{c.equipmentName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{c.serialNumber || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{c.calibrationDue ? new Date(c.calibrationDue).toLocaleDateString() : '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
