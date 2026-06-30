'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const KPI_LABELS: Record<string, string> = { totalContractors: 'Total Contractors', active: 'Active', suspended: 'Suspended', underReview: 'Under Review', highRisk: 'High Risk', totalWorkers: 'Workers', totalEquipment: 'Equipment', expiringDocs: 'Expiring Docs' };

export default function ContractorDashboardPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/contractor/dashboard'); setData(r.data); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard'); console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  const summary: Record<string, number> = data?.summary || {};
  if (Object.keys(summary).length === 0) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No contractor dashboard data available</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Contractor Management Dashboard</h1><p className="text-gray-600 mt-1">Overview of contractor management KPIs</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{KPI_LABELS[key] || key}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
      {data?.recentProfiles && data.recentProfiles.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent Contractors</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.recentProfiles.map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{p.companyName || p.name || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{p.contractorType || '-'}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' : p.status === 'suspended' ? 'bg-red-100 text-red-800' : p.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>{p.status?.replace(/_/g, ' ') || '-'}</span></td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${p.riskLevel === 'high' ? 'bg-red-100 text-red-800' : p.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{p.riskLevel || '-'}</span></td></tr>))}</tbody>
          </table>
        </div>
      )}
      {data?.expiringDocuments && data.expiringDocuments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-lg font-semibold text-gray-900">Expiring Documents</h2></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{data.expiringDocuments.map((d: any) => (<tr key={d.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{d.contractorName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{d.documentName || d.type || '-'}</td><td className="px-4 py-3 text-sm text-red-600">{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
