'use client'; import { useState, useEffect } from 'react'; import { dataRetentionApi } from '@/lib/api';

export default function DataRetentionPage() {
  const [tab, setTab] = useState<'policies'|'archive'|'holds'|'purge'>('policies');
  const [policies, setPolicies] = useState<any[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [holds, setHolds] = useState<any[]>([]);
  const [purges, setPurges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try { const [p,a,h,r] = await Promise.all([dataRetentionApi.getPolicies().catch(()=>({data:[]})), dataRetentionApi.getArchives().catch(()=>({data:[]})), dataRetentionApi.getLegalHolds().catch(()=>({data:[]})), dataRetentionApi.getPurgeRequests().catch(()=>({data:[]})) ]); setPolicies(p.data||[]); setArchives(a.data||[]); setHolds(h.data||[]); setPurges(r.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  const handleRelease = async (id: string) => { try { await dataRetentionApi.releaseLegalHold(id); setHolds(holds.filter((h:any)=>h.id!==id)); } catch (e) { console.error(e); } };
  const handleApprove = async (id: string) => { try { await dataRetentionApi.approvePurge(id); window.location.reload(); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Data Retention, Archive & Legal Hold</h1>
      <div className="flex border-b border-gray-200">
        {[{key:'policies',label:'Retention Policies'},{key:'archive',label:'Archived Records'},{key:'holds',label:'Legal Holds'},{key:'purge',label:'Purge Requests'}].map(t=>(<button key={t.key} onClick={()=>setTab(t.key as any)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab===t.key?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>{t.label}</button>))}
      </div>

      {tab==='policies'&&(<div className="bg-white rounded-lg shadow p-6">{policies.length===0?<p className="text-sm text-gray-400">No policies</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Module</th><th className="text-left py-2">Retention</th><th className="text-left py-2">Action</th></tr></thead><tbody>{policies.map((p:any)=>(<tr key={p.id}><td className="py-1">{p.name}</td><td className="py-1">{p.module}</td><td className="py-1">{p.retentionDays} days</td><td className="py-1">{p.action}</td></tr>))}</tbody></table>}</div>)}

      {tab==='archive'&&(<div className="bg-white rounded-lg shadow p-6">{archives.length===0?<p className="text-sm text-gray-400">No archived records</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Module</th><th className="text-left py-2">Record</th><th className="text-left py-2">Archived</th></tr></thead><tbody>{archives.map((a:any)=>(<tr key={a.id}><td className="py-1">{a.module}</td><td className="py-1">{a.recordType}/{a.recordId}</td><td className="py-1 text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</td></tr>))}</tbody></table>}</div>)}

      {tab==='holds'&&(<div className="bg-white rounded-lg shadow p-6">{holds.length===0?<p className="text-sm text-gray-400">No legal holds</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Module</th><th className="text-left py-2">Records</th><th className="text-left py-2">Reason</th><th className="text-right py-2">Action</th></tr></thead><tbody>{holds.map((h:any)=>(<tr key={h.id}><td className="py-1">{h.name}</td><td className="py-1">{h.module}</td><td className="py-1">{h.recordIds?.length||0}</td><td className="py-1 text-xs">{h.reason||'-'}</td><td className="py-1 text-right"><button onClick={()=>handleRelease(h.id)} className="text-sm text-blue-600 hover:underline">Release</button></td></tr>))}</tbody></table>}</div>)}

      {tab==='purge'&&(<div className="bg-white rounded-lg shadow p-6">{purges.length===0?<p className="text-sm text-gray-400">No purge requests</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Module</th><th className="text-left py-2">Records</th><th className="text-left py-2">Status</th><th className="text-left py-2">Requested</th><th className="text-right py-2">Action</th></tr></thead><tbody>{purges.map((p:any)=>(<tr key={p.id}><td className="py-1">{p.module}/{p.recordType}</td><td className="py-1">{p.recordIds?.length||0}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${p.status==='completed'?'bg-green-100':'bg-yellow-100'}`}>{p.status}</span></td><td className="py-1 text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</td><td className="py-1 text-right">{p.status==='pending'&&<button onClick={()=>handleApprove(p.id)} className="text-sm text-green-600 hover:underline">Approve</button>}</td></tr>))}</tbody></table>}</div>)}
    </div>
  );
}
