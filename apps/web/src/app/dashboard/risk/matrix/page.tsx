'use client'; import { useState, useEffect } from 'react'; import { riskMatrixApi } from '@/lib/api';

const LEVEL_COLORS: Record<string, string> = { L: '#22c55e', M: '#eab308', H: '#f97316', E: '#ef4444' };

export default function RiskMatrixPage() {
  const [matrix, setMatrix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const [sev, setSev] = useState(''); const [lik, setLik] = useState('');

  useEffect(() => { (async () => { try { const r = await riskMatrixApi.getMatrix(); setMatrix(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const handlePreview = async () => { try { const r = await riskMatrixApi.previewScore({ severity: Number(sev), likelihood: Number(lik) }); setPreview(r.data); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const m = matrix;

  const sevs = [...new Set((m?.cells||[]).map((c:any)=>c.severity))].sort() as number[];
  const liks = [...new Set((m?.cells||[]).map((c:any)=>c.likelihood))].sort() as number[];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">{m?.name||'Risk Matrix'}<span className="text-sm font-normal text-gray-400 ml-2">v{m?.version}</span></h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Score Preview</h2>
        <div className="flex gap-3 items-end mb-3">
          <div><label className="block text-xs mb-1">Severity</label><input type="number" min={1} max={5} value={sev} onChange={(e)=>setSev(e.target.value)} className="w-20 px-2 py-1 border rounded text-sm" /></div>
          <span className="text-lg pb-1">×</span>
          <div><label className="block text-xs mb-1">Likelihood</label><input type="number" min={1} max={5} value={lik} onChange={(e)=>setLik(e.target.value)} className="w-20 px-2 py-1 border rounded text-sm" /></div>
          <button onClick={handlePreview} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Calculate</button>
        </div>
        {preview&&(<div className="p-3 rounded-lg" style={{backgroundColor: preview.color+'20', borderLeft: `4px solid ${preview.color}`}}><span className="text-sm font-bold" style={{color:preview.color}}>{preview.riskLabel}</span><span className="text-xs text-gray-500 ml-2">Score: {preview.score}</span></div>)}
      </div>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Matrix {m?.matrixSize}×{m?.matrixSize}</h2>
        <table className="min-w-full text-center text-sm">
          <thead><tr><th className="p-2"></th>{liks.map((l:number)=>(<th key={l} className="p-2 text-xs text-gray-400">Likelihood {l}</th>))}</tr></thead>
          <tbody>
            {sevs.map((s:number)=>(<tr key={s}><td className="p-2 text-xs text-gray-400 font-medium">Sev {s}</td>
              {liks.map((l:number)=>{const cell=m?.cells?.find((c:any)=>c.severity===s&&c.likelihood===l);return(<td key={l} className="p-1"><div className="rounded p-2 text-xs font-medium" style={{backgroundColor:cell?.color||'#eee',color:cell?.color?'#fff':'#666'}}>{cell?.riskLevel||'-'}<br/>{cell?.riskScore||''}</div></td>);})}
            </tr>))}
          </tbody>
        </table>
        <div className="flex gap-3 mt-4">{Object.entries(LEVEL_COLORS).map(([k,v])=>(<div key={k} className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:v}}/><span className="text-xs">{k}</span></div>))}</div>
      </div>
    </div>
  );
}
