'use client'; import { useState, useEffect } from 'react'; import { environmentApi } from '@/lib/api';

export default function EnvironmentSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await environmentApi.getSettings(); setSettings(r.data); } catch(e){console.error(e);} finally{setLoading(false);} })(); }, []);

  const handleSave = async () => { try { await environmentApi.updateSettings(settings); setSaved(true); setTimeout(()=>setSaved(false),2000); } catch(e){console.error(e);} };
  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const s = settings||{};

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Environment Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {[
          {key:'exceedanceThresholdPct',label:'Exceedance Threshold (%)',desc:'Percent threshold before marking a monitoring result as exceedance'},
          {key:'autoTriggerAction',label:'Auto-Trigger Action',desc:'Automatically create corrective action when exceedance detected'},
          {key:'requireLabCertification',label:'Require Lab Certification',desc:'Lab certification required for environmental sample records'},
          {key:'wasteRetentionDays',label:'Waste Record Retention (days)',desc:'Number of days to retain waste management records',type:'number'},
          {key:'defaultMonitoringDays',label:'Default Monitoring Interval (days)',desc:'Default days between scheduled environmental monitoring',type:'number'},
        ].map(({key,label,desc,type})=> type==='number'?(
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type="number" value={s[key]||0} onChange={(e)=>setSettings({...s,[key]:Number(e.target.value)})} className="w-32 px-3 py-2 border rounded-lg text-sm"/>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </div>
        ):(
          <label key={key} className="flex items-center gap-3">
            <input type="checkbox" checked={!!s[key]} onChange={(e)=>setSettings({...s,[key]:e.target.checked})} className="rounded"/>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </label>
        ))}
        <div className="flex gap-3 pt-4 border-t">
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved?'✓ Saved':'Save Settings'}</button>
        </div>
      </div>
    </div>
  );
}
