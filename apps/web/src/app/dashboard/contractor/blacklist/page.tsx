'use client'; import { useState, useEffect, useCallback } from 'react'; import { apiClient } from '@/lib/api';

const reasonColors: Record<string,string> = { safety_violation:'bg-red-100 text-red-800', performance:'bg-yellow-100 text-yellow-800', compliance:'bg-orange-100 text-orange-800', fraud:'bg-purple-100 text-purple-800', misconduct:'bg-amber-100 text-amber-800', other:'bg-gray-100 text-gray-700' };

export default function ContractorBlacklistPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await apiClient.get('/contractor/blacklist'); setData(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load blacklist'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Contractor Blacklist</h1><p className="text-gray-600 mt-1">Blacklisted and debarred contractors</p></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reason</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Blacklisted By</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead>
          <tbody>
            {data.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{d.companyName || d.contractorName || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${reasonColors[d.reason] || 'bg-gray-100 text-gray-700'}`}>{d.reason?.replace(/_/g, ' ') || '-'}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.blacklistedBy || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.blacklistedAt ? new Date(d.blacklistedAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.status === 'active' ? 'bg-red-100 text-red-800' : d.status === 'lifted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{d.status || '-'}</span></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No blacklisted contractors found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
