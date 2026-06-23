'use client'; import { useState, useEffect } from 'react'; import { riskApi } from '@/lib/api';

export default function RiskSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await riskApi.getSettings(); setSettings(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const handleSave = async () => { try { await riskApi.updateSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const s = settings;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Risk Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={s?.requireWorkflow||false} onChange={(e)=>setSettings({...s,requireWorkflow:e.target.checked})} className="rounded text-blue-600" /><div><p className="text-sm font-medium">Require Workflow Approval</p><p className="text-xs text-gray-500">Risk assessments must go through workflow review</p></div></label>
        <div>
          <label className="block text-sm font-medium mb-1">Matrix Type</label>
          <select value={s?.matrixType||'5x5'} onChange={(e)=>setSettings({...s,matrixType:e.target.value})} className="px-3 py-2 border rounded-lg text-sm">
            <option value="3x3">3×3</option><option value="4x4">4×4</option><option value="5x5">5×5</option><option value="6x6">6×6</option>
          </select>
        </div>

        <div><h2 className="text-lg font-semibold mb-3">Severity Levels</h2>
          <div className="space-y-2">{(s?.severityLevels||[]).map((l:any,i:number)=>(<div key={i} className="flex items-center gap-3"><span className="w-8 text-sm font-bold">{l.level}</span><input value={l.label} onChange={(e)=>{const arr=[...s.severityLevels];arr[i].label=e.target.value;setSettings({...s,severityLevels:arr});}} className="px-2 py-1 border rounded text-sm flex-1" /></div>))}</div>
        </div>

        <div><h2 className="text-lg font-semibold mb-3">Risk Levels</h2>
          <div className="space-y-2">{s?.riskLevels?.map((l:any,i:number)=>(<div key={i} className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{backgroundColor:l.color}}/><span className="text-sm font-medium w-24">{l.level} - {l.label}</span><span className="text-xs text-gray-400">Score: {l.scoreMin}–{l.scoreMax}</span></div>))}</div>
        </div>

        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved?'✓ Saved':'Save Settings'}</button></div>
      </div>
    </div>
  );
}
