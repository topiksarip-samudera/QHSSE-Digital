'use client'; import { useState, useEffect } from 'react'; import { riskApi } from '@/lib/api';

export default function RiskMasterDataPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState<any>(null);

  useEffect(() => { (async () => { try { const r = await riskApi.getMasterData(); setData(r.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const handleSeed = async () => { try { const r = await riskApi.seedDefaults(); setSeeded(r.data); setTimeout(()=>window.location.reload(),1500); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Risk Master Data</h1><button onClick={handleSeed} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Seed Default Data</button></div>
      {seeded&&<div className="p-3 bg-green-50 border rounded-lg text-sm text-green-700">{seeded.seeded} items seeded across {seeded.groups} groups</div>}
      {loading?<div className="text-center py-12 text-gray-500">Loading...</div>:data.length===0?<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No master data. Click "Seed Default Data".</p></div>:(
        <div className="space-y-4">{data.map((g:any)=>(<div key={g.id} className="bg-white rounded-lg shadow p-4"><h2 className="text-lg font-semibold mb-2">{g.name}</h2><div className="flex flex-wrap gap-2">{g.items?.map((i:any)=>(<span key={i.id} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">{i.name}</span>))}</div></div>))}</div>
      )}
    </div>
  );
}
