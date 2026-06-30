'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function CriticalEquipmentPage() {
  const [records, setRecords] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await assetApi.getCriticalEquipment(); setRecords(r.data.data || r.data || []); } catch (e: any) { setError(e?.response?.data?.message || e?.message || 'Failed to load critical equipment'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div>;
  if (records.length===0) return <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No critical equipment found.</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Critical Equipment</h1><p className="text-gray-600 mt-1">High-criticality assets requiring special attention</p></div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium">Asset Number</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">Criticality</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Certificates</th><th className="px-4 py-3 font-medium">Last Inspection</th></tr></thead><tbody>{records.map((r:any)=>(<tr key={r.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-mono text-xs">{r.assetNumber||'-'}</td><td className="px-4 py-3 font-medium">{r.name||'-'}</td><td className="px-4 py-3">{r.category?.name||r.categoryName||'-'}</td><td className="px-4 py-3">{r.location?.name||r.locationName||'-'}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.criticality==='CRITICAL'?'bg-red-100 text-red-800':r.criticality==='HIGH'?'bg-orange-100 text-orange-800':'bg-yellow-100 text-yellow-800'}`}>{r.criticality||r.criticalityLevel||'-'}</span></td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${r.status==='active'?'bg-green-100 text-green-800':r.status==='inactive'?'bg-gray-100 text-gray-800':'bg-yellow-100 text-yellow-800'}`}>{r.status||'-'}</span></td><td className="px-4 py-3">{r._count?.certificates ?? r.certificatesCount ?? '-'}</td><td className="px-4 py-3">{r.lastInspectionDate?new Date(r.lastInspectionDate).toLocaleDateString():'-'}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
