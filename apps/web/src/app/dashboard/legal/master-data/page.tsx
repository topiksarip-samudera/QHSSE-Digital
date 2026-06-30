'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

export default function LegalMasterDataPage() {
  const [groups, setGroups] = useState<any[]>([]); const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => { try { const r = await legalApi.getMasterData(); setGroups(r.data.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const seed = async () => { try { const r = await legalApi.seedDefaults(); alert(`Seeded ${r.data.data.seeded} items in ${r.data.data.groups} groups`); fetchData(); } catch (e: any) { alert(e.response?.data?.message || 'Error'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Legal Master Data</h1><p className="text-gray-600 mt-1">Configure legal compliance reference data</p></div><button onClick={seed} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Seed Defaults</button></div>
      {groups.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No master data yet. Click "Seed Defaults" to populate.</p></div>:(
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g:any)=>(<div key={g.id} className="bg-white rounded-lg shadow p-4"><h3 className="font-semibold text-gray-900 mb-2">{g.name}</h3><ul className="space-y-1">{(g.items||[]).map((item:any)=>(<li key={item.id} className="text-sm text-gray-600">• {item.name}{item.code?` (${item.code})`:''}</li>))}</ul></div>))}
        </div>
      )}
    </div>
  );
}
