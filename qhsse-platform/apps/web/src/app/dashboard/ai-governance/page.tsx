'use client'; import { useState, useEffect } from 'react'; import { aiGovernanceApi } from '@/lib/api';

export default function AiGovernancePage() {
  const [tab, setTab] = useState<'settings'|'prompts'|'knowledge'|'usage'>('settings');
  const [settings, setSettings] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [usage, setUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, t, k, u] = await Promise.all([
          aiGovernanceApi.getSettings().catch(()=>({data:{}})),
          aiGovernanceApi.getPromptTemplates().catch(()=>({data:[]})),
          aiGovernanceApi.getKnowledgeSources().catch(()=>({data:[]})),
          aiGovernanceApi.getUsageLogs().catch(()=>({data:{data:[]}})),
        ]);
        setSettings(s.data); setTemplates(t.data); setSources(k.data); setUsage(u.data.data||[]);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const handleToggleAI = async () => {
    try { await aiGovernanceApi.updateSettings({ aiEnabled: !settings?.aiEnabled }); setSettings({...settings, aiEnabled: !settings?.aiEnabled}); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI Governance</h1>
      <div className="flex border-b border-gray-200">
        {[{key:'settings',label:'Settings'},{key:'prompts',label:'Prompt Templates'},{key:'knowledge',label:'Knowledge'},{key:'usage',label:'Usage Logs'}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as any)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab===t.key?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>{t.label}</button>
        ))}
      </div>

      {tab==='settings'&&settings&&(
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">AI Settings</h2><button onClick={handleToggleAI} className={`px-4 py-2 rounded-lg text-sm font-medium ${settings.aiEnabled?'bg-red-600 text-white':'bg-green-600 text-white'}`}>{settings.aiEnabled?'Disable AI':'Enable AI'}</button></div>
          <div className="grid grid-cols-2 gap-4"><div><dt className="text-sm text-gray-500">Status</dt><dd className="text-sm font-medium">{settings.aiEnabled?'Enabled':'Disabled'}</dd></div><div><dt className="text-sm text-gray-500">Data Redaction</dt><dd className="text-sm">{settings.dataRedaction?'Enabled':'Disabled'}</dd></div></div>
          <div><h3 className="text-sm font-semibold mb-2">Allowed Modules</h3><div className="flex flex-wrap gap-2">{(settings.allowedModules||[]).map((m:string)=>(<span key={m} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{m}</span>))}</div></div>
        </div>
      )}

      {tab==='prompts'&&(
        <div className="bg-white rounded-lg shadow p-6">{templates.length===0?<p className="text-sm text-gray-400">No prompt templates</p>:<ul className="space-y-3">{templates.map((t:any)=>(<li key={t.id} className="border rounded-lg p-3"><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-gray-500">{t.module}</p><pre className="text-xs mt-1 bg-gray-50 p-2 rounded overflow-auto max-h-24">{t.prompt}</pre></li>))}</ul>}</div>
      )}

      {tab==='knowledge'&&(
        <div className="bg-white rounded-lg shadow p-6">{sources.length===0?<p className="text-sm text-gray-400">No knowledge sources</p>:<ul className="space-y-2">{sources.map((s:any)=>(<li key={s.id} className="text-sm"><span className="font-medium">{s.name}</span><span className="text-gray-400 ml-2">[{s.type}]</span></li>))}</ul>}</div>
      )}

      {tab==='usage'&&(
        <div className="bg-white rounded-lg shadow p-6">{usage.length===0?<p className="text-sm text-gray-400">No usage logs</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Module</th><th className="text-left py-2">Feature</th><th className="text-left py-2">Tokens</th><th className="text-left py-2">Duration</th><th className="text-left py-2">Cost</th></tr></thead><tbody>{usage.map((l:any)=>(<tr key={l.id}><td className="py-1">{l.module}</td><td className="py-1">{l.feature}</td><td className="py-1">{l.tokensIn||0}+{l.tokensOut||0}</td><td className="py-1">{l.duration}ms</td><td className="py-1">${(l.cost||0).toFixed(4)}</td></tr>))}</tbody></table>}</div>
      )}
    </div>
  );
}
