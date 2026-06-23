'use client'; import { useState, useEffect } from 'react'; import { auditInspectionApi } from '@/lib/api';

export default function AuditSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await auditInspectionApi.getSettings(); setSettings(r.data); } catch(e){console.error(e);} finally{setLoading(false);} })(); }, []);

  const handleSave = async () => { try { await auditInspectionApi.updateSettings(settings); setSaved(true); setTimeout(()=>setSaved(false),2000); } catch(e){console.error(e);} };
  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const s = settings||{};

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Audit & Inspection Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={s.autoCreateAction||false} onChange={(e)=>setSettings({...s,autoCreateAction:e.target.checked})} className="rounded"/><div><p className="text-sm font-medium">Auto-Create Action from Finding</p><p className="text-xs text-gray-500">Automatically create corrective action in Action Tracking when finding is raised</p></div></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={s.requireEvidenceMajorNc||false} onChange={(e)=>setSettings({...s,requireEvidenceMajorNc:e.target.checked})} className="rounded"/><div><p className="text-sm font-medium">Require Evidence for Major NC</p><p className="text-xs text-gray-500">Major nonconformities must have evidence attached</p></div></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={s.requireRootCauseMajorNc||false} onChange={(e)=>setSettings({...s,requireRootCauseMajorNc:e.target.checked})} className="rounded"/><div><p className="text-sm font-medium">Require Root Cause for Major NC</p><p className="text-xs text-gray-500">Major nonconformities must include root cause analysis</p></div></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={s.scoreFailedCriticalAsZero||false} onChange={(e)=>setSettings({...s,scoreFailedCriticalAsZero:e.target.checked})} className="rounded"/><div><p className="text-sm font-medium">Score Failed Critical Items as Zero</p><p className="text-xs text-gray-500">Failed critical checklist items score 0 regardless of weight</p></div></label>
        <div>
          <label className="block text-sm font-medium mb-1">Default Finding Due Days</label>
          <input type="number" value={s.defaultFindingDueDays||14} onChange={(e)=>setSettings({...s,defaultFindingDueDays:Number(e.target.value)})} className="w-24 px-3 py-2 border rounded-lg text-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pass Score (%)</label>
          <input type="number" value={s.passScorePercent||75} onChange={(e)=>setSettings({...s,passScorePercent:Number(e.target.value)})} className="w-24 px-3 py-2 border rounded-lg text-sm"/>
        </div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved?'✓ Saved':'Save Settings'}</button></div>
      </div>
    </div>
  );
}
