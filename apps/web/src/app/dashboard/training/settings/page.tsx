'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function TrainingSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await trainingApi.getSettings(); setSettings(r.data); } catch(e){console.error(e);} finally{setLoading(false);} })(); }, []);

  const handleSave = async () => { try { await trainingApi.updateSettings(settings); setSaved(true); setTimeout(()=>setSaved(false),2000); } catch(e){console.error(e);} };
  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const s = settings||{};

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Training & Competency Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {[{key:'requireCompetencyCheck',label:'Require Competency Check',desc:'Verify worker competencies before permit/work assignment'},
          {key:'autoAssignFromMatrix',label:'Auto-Assign from Training Matrix',desc:'Automatically assign training based on the training matrix'}
        ].map(({key,label,desc})=>(
          <label key={key} className="flex items-center gap-3"><input type="checkbox" checked={s[key]||false} onChange={(e)=>{const upd={...s};upd[key]=e.target.checked;setSettings(upd)}} className="rounded"/><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-gray-500">{desc}</p></div></label>
        ))}
        <div><label className="block text-sm font-medium mb-1">Default Training Due (days)</label><input type="number" value={s.defaultTrainingDueDays||30} onChange={(e)=>setSettings({...s,defaultTrainingDueDays:Number(e.target.value)})} className="w-24 px-3 py-2 border rounded-lg text-sm"/></div>
        <div><label className="block text-sm font-medium mb-1">Certificate Expiry Warning (days before)</label><input type="number" value={s.certificateExpiryWarningDays||30} onChange={(e)=>setSettings({...s,certificateExpiryWarningDays:Number(e.target.value)})} className="w-24 px-3 py-2 border rounded-lg text-sm"/></div>
        <div><label className="block text-sm font-medium mb-1">Induction Frequency (months)</label><input type="number" value={s.inductionFrequencyMonths||12} onChange={(e)=>setSettings({...s,inductionFrequencyMonths:Number(e.target.value)})} className="w-24 px-3 py-2 border rounded-lg text-sm"/></div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved?'✓ Saved':'Save Settings'}</button></div>
      </div>
    </div>
  );
}
