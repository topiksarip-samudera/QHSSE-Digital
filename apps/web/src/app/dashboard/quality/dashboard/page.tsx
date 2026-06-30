'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';

const KPI_LABELS: Record<string, string> = { openNcr: 'Open NCRs', overdueCapa: 'Overdue CAPAs', calibrationDue: 'Calibrations Due', openComplaints: 'Open Complaints', openDefects: 'Open Defects', totalCopqCost: 'COPQ Total Cost', qualityScore: 'Quality Score' };

export default function QualityDashboardPage() {
  const [data, setData] = useState<any>(null); const [score, setScore] = useState<any>(null); const [copq, setCopq] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [d, s, c] = await Promise.all([qualityApi.getDashboard(), qualityApi.getScore(), qualityApi.getCopqSummary()]);
      setData(d.data); setScore(s.data); setCopq(c.data);
    } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard data'); console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const summary: Record<string, number> = data?.summary || {};
  if (score?.score != null) summary.qualityScore = score.score;
  if (copq?.totalCost != null) summary.totalCopqCost = copq.totalCost;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Quality Management Dashboard</h1><p className="text-gray-600 mt-1">Overview of quality KPIs and performance metrics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{KPI_LABELS[key] || key}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? (key === 'totalCopqCost' ? `$${value.toLocaleString()}` : key === 'qualityScore' ? `${value}%` : value) : value}</p>
          </div>
        ))}
      </div>
      {score && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">Score:</span> <span className="font-bold">{score.score}%</span></div>
            <div><span className="text-gray-500">Grade:</span> <span className="font-bold">{score.grade || '-'}</span></div>
            <div><span className="text-gray-500">Trend:</span> <span className="font-bold">{score.trend || '-'}</span></div>
            <div><span className="text-gray-500">Last Updated:</span> <span className="font-bold">{score.lastUpdated ? new Date(score.lastUpdated).toLocaleDateString() : '-'}</span></div>
          </div>
        </div>
      )}
      {data?.recentNcrs && data.recentNcrs.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent NCRs</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.recentNcrs.map((n: any) => (<tr key={n.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{n.title || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{n.ncrType || '-'}</td><td className="px-4 py-3 text-sm">{n.severity ? <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${n.severity === 'critical' ? 'bg-red-100 text-red-800' : n.severity === 'major' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>{n.severity}</span> : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{n.status || '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
      {data?.overdueCapas && data.overdueCapas.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Overdue CAPAs</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.overdueCapas.map((c: any) => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{c.title || '-'}</td><td className="px-4 py-3 text-sm text-red-600">{c.dueDate ? new Date(c.dueDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{c.status || '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
