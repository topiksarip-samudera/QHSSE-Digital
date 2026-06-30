'use client'; import { useState, useEffect } from 'react'; import { docApi } from '@/lib/api';

export default function DocControlSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await docApi.getSettings(); setSettings(r.data); } catch(e){console.error(e);} finally{setLoading(false);} })(); }, []);

  const handleSave = async () => { try { await docApi.updateSettings(settings); setSaved(true); setTimeout(()=>setSaved(false),2000); } catch(e){console.error(e);} };
  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  const s = settings||{};

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Document Control Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {[{key:'requireReview',label:'Require Review',desc:'Mandatory review before document becomes effective'},
          {key:'requireApproval',label:'Require Approval',desc:'Formal approval required for document publication'},
          {key:'enforceReadAck',label:'Enforce Read Acknowledgement',desc:'Users must acknowledge reading controlled documents'}
        ].map(({key,label,desc})=>(
          <label key={key} className="flex items-center gap-3"><input type="checkbox" checked={s[key]||false} onChange={(e)=>{const upd={...s};upd[key]=e.target.checked;setSettings(upd)}} className="rounded"/><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-gray-500">{desc}</p></div></label>
        ))}
        <div className="grid grid-cols-3 gap-4">
          {[{key:'defaultReviewDays',label:'Default Review Days'},{key:'defaultRetentionYears',label:'Default Retention Years'},{key:'autoArchiveObsoleteDays',label:'Auto-Archive Obsolete (days)'}].map(({key,label})=>(
            <div key={key}><label className="block text-sm font-medium mb-1">{label}</label><input type="number" value={s[key]||0} onChange={(e)=>setSettings({...s,[key]:Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg text-sm"/></div>
          ))}
        </div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved?'✓ Saved':'Save Settings'}</button></div>
      </div>
    </div>
  );
}
