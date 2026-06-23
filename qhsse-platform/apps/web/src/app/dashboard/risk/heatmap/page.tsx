'use client'; import { useState, useEffect } from 'react'; import { riskDashboardApi } from '@/lib/api';

export default function RiskDashboardPage() {
  const [dash, setDash] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const r = await riskDashboardApi.getDashboard(); setDash(r.data); } catch(e){console.error(e);} finally{setLoading(false);} })(); }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const d = dash||{};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Risk Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Total Risks</p><p className="text-2xl font-bold text-blue-600">{d.total||0}</p></div>
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Draft</p><p className="text-2xl font-bold text-gray-600">{d.draft||0}</p></div>
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Submitted</p><p className="text-2xl font-bold text-blue-600">{d.submitted||0}</p></div>
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Approved</p><p className="text-2xl font-bold text-green-600">{d.approved||0}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">High Risks</p><p className="text-2xl font-bold text-orange-600">{d.highCount||0}</p></div>
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Extreme Risks</p><p className="text-2xl font-bold text-red-600">{d.extremeCount||0}</p></div>
        <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Overdue Reviews</p><p className="text-2xl font-bold text-red-600">{d.overdueReviews||0}</p></div>
      </div>
      {(d.byLevel||[]).length>0&&(
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">By Risk Level</h2>
          <div className="flex gap-3">{d.byLevel.map((l:any)=>(<div key={l.level} className="flex items-center gap-2"><span className="text-sm font-medium">{l.level||'N/A'}</span><span className="text-sm text-gray-600">{l.count}</span></div>))}</div>
        </div>
      )}
    </div>
  );
}
