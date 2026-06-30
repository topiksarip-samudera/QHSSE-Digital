'use client'; import { useState, useEffect, useCallback } from 'react'; import { securityApi } from '@/lib/api';

const KPI_LABELS: Record<string, string> = { totalIncidents: 'Incidents', visitorsToday: 'Visitors Today', vehiclesInside: 'Vehicles Inside', activeGatePasses: 'Active Gate Passes', openInvestigations: 'Open Investigations', activePatrols: 'Active Patrols', securityScore: 'Security Score' };

export default function SecurityDashboardPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await securityApi.getDashboard(); setData(r.data); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard'); console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const summary: Record<string, number> = data?.summary || {};
  if (Object.keys(summary).length === 0) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No security dashboard data available</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Security Management Dashboard</h1><p className="text-gray-600 mt-1">Overview of security operations and KPIs</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{KPI_LABELS[key] || key}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
      {data?.recentIncidents && data.recentIncidents.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.recentIncidents.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{i.title || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{i.incidentType || '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${i.severity === 'Critical' ? 'bg-red-100 text-red-800' : i.severity === 'High' ? 'bg-orange-100 text-orange-800' : i.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'}`}>{i.severity || '-'}</span></td><td className="px-4 py-3 text-sm text-gray-500">{i.status || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{i.incidentDate ? new Date(i.incidentDate).toLocaleDateString() : '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
      {data?.activeVisitors && data.activeVisitors.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Active Visitors</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.activeVisitors.map((v: any) => (<tr key={v.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{v.visitorName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{v.hostName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{v.checkInTime ? new Date(v.checkInTime).toLocaleString() : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{v.badgeNumber || '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
