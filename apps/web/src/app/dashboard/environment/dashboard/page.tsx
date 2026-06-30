'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const KPI_LABELS: Record<string, string> = {
  aspects: 'Aspects', impacts: 'Impacts', permits: 'Permits', waste: 'Waste Records',
  monitoringSchedules: 'Monitoring Schedules', spills: 'Spills', exceedances: 'Exceedances', energy: 'Energy Records',
};

export default function EnvironmentDashboardPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await environmentApi.getDashboard(); setData(r.data); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard'); console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;
  if (!data || !data.summary || Object.keys(data.summary).length === 0) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No dashboard data available</p></div>;

  const summary: Record<string, number> = data.summary || {};

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Environment Dashboard</h1><p className="text-gray-600 mt-1">Overview of environmental management KPIs</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{KPI_LABELS[key] || key}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
      {data.recentSpills && data.recentSpills.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent Spills</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.recentSpills.map((s: any) => (<tr key={s.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-500">{s.spillDate ? new Date(s.spillDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm font-medium text-gray-900">{s.material || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{s.volume != null ? `${s.volume} ${s.unit || ''}` : '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${s.status === 'cleaned' ? 'bg-green-100 text-green-800' : s.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{s.status || '-'}</span></td></tr>))}</tbody>
          </table>
        </div>
      )}
      {data.upcomingPermits && data.upcomingPermits.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Upcoming Permit Expirations</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permit</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.upcomingPermits.map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name || p.permitNumber || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{p.permitType || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
