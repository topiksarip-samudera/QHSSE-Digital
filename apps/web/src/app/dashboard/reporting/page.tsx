'use client'; import { useState, useEffect } from 'react'; import { reportingApi } from '@/lib/api';

export default function ReportingPage() {
  const [tab, setTab] = useState<'templates'|'scheduled'|'history'>('templates');
  const [templates, setTemplates] = useState<any[]>([]);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const [t, s, h] = await Promise.all([reportingApi.getTemplates().catch(()=>({data:[]})), reportingApi.getScheduled().catch(()=>({data:[]})), reportingApi.getRunHistory().catch(()=>({data:[]})) ]);
      setTemplates(t.data||[]); setScheduled(s.data||[]); setHistory(h.data||[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  const handleRun = async (id: string) => { try { await reportingApi.runReport(id); window.location.reload(); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Enterprise Reporting</h1>
      <div className="flex border-b border-gray-200">
        {[{key:'templates',label:'Report Templates'},{key:'scheduled',label:'Scheduled Reports'},{key:'history',label:'Run History'}].map(t=>(<button key={t.key} onClick={()=>setTab(t.key as any)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab===t.key?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>{t.label}</button>))}
      </div>

      {tab==='templates'&&(<div className="bg-white rounded-lg shadow p-6">{templates.length===0?<p className="text-sm text-gray-400">No templates</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Type</th><th className="text-left py-2">Runs</th><th className="text-right py-2">Actions</th></tr></thead><tbody>{templates.map((t:any)=>(<tr key={t.id}><td className="py-1 font-medium">{t.name}</td><td className="py-1">{t.type}</td><td className="py-1">{t._count?.runHistory||0}</td><td className="py-1 text-right"><button onClick={()=>handleRun(t.id)} className="text-sm text-blue-600 hover:underline">Run</button></td></tr>))}</tbody></table>}</div>)}

      {tab==='scheduled'&&(<div className="bg-white rounded-lg shadow p-6">{scheduled.length===0?<p className="text-sm text-gray-400">No scheduled reports</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Template</th><th className="text-left py-2">Frequency</th><th className="text-left py-2">Format</th><th className="text-left py-2">Recipients</th></tr></thead><tbody>{scheduled.map((s:any)=>(<tr key={s.id}><td className="py-1">{s.name}</td><td className="py-1">{s.template?.name}</td><td className="py-1">{s.frequency} at {s.time}</td><td className="py-1">{s.format}</td><td className="py-1">{s.recipients?.length||0}</td></tr>))}</tbody></table>}</div>)}

      {tab==='history'&&(<div className="bg-white rounded-lg shadow p-6">{history.length===0?<p className="text-sm text-gray-400">No runs</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Status</th><th className="text-left py-2">Format</th><th className="text-left py-2">Triggered</th><th className="text-left py-2">Created</th></tr></thead><tbody>{history.map((r:any)=>(<tr key={r.id}><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.status==='completed'?'bg-green-100':'bg-gray-100'}`}>{r.status}</span></td><td className="py-1">{r.format}</td><td className="py-1">{r.triggeredBy}</td><td className="py-1 text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</td></tr>))}</tbody></table>}</div>)}
    </div>
  );
}
