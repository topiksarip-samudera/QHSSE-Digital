'use client'; import { useState, useEffect } from 'react'; import { backupApi } from '@/lib/api';

export default function BackupPage() {
  const [tab, setTab] = useState<'backups' | 'schedules' | 'restore'>('backups');
  const [backups, setBackups] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try { const [b, s, r] = await Promise.all([backupApi.getBackups().catch(()=>({data:{data:[]}})), backupApi.getSchedules().catch(()=>({data:[]})), backupApi.getRestoreRequests().catch(()=>({data:[]}))]); setBackups(b.data.data||[]); setSchedules(s.data||[]); setRequests(r.data||[]); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleBackup = async () => { try { await backupApi.createBackup({}); fetchAll(); setMsg('Backup created'); } catch (e) { console.error(e); } };
  const handleApprove = async (id: string) => { try { await backupApi.approveRestore(id); fetchAll(); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
      {msg && <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">{msg}</div>}
      <div className="flex border-b border-gray-200">{[{key:'backups',label:'Backups'},{key:'schedules',label:'Schedules'},{key:'restore',label:'Restore Requests'}].map(t=>(<button key={t.key} onClick={()=>setTab(t.key as any)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab===t.key?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>{t.label}</button>))}</div>
      {tab==='backups'&&(<div className="space-y-4"><button onClick={handleBackup} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Create Backup Now</button><div className="bg-white rounded-lg shadow p-6">{backups.length===0?<p className="text-sm text-gray-400">No backups</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Scope</th><th className="text-left py-2">Status</th><th className="text-left py-2">File</th><th className="text-left py-2">Created</th></tr></thead><tbody>{backups.map((b:any)=>(<tr key={b.id}><td className="py-1">{b.scope}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${b.status==='completed'?'bg-green-100 text-green-800':'bg-gray-100'}`}>{b.status}</span></td><td className="py-1 text-xs font-mono">{b.fileName}</td><td className="py-1 text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</td></tr>))}</tbody></table>}</div></div>)}
      {tab==='schedules'&&(<div className="bg-white rounded-lg shadow p-6">{schedules.length===0?<p className="text-sm text-gray-400">No schedules</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Frequency</th><th className="text-left py-2">Scope</th><th className="text-left py-2">Retention</th><th className="text-left py-2">Active</th></tr></thead><tbody>{schedules.map((s:any)=>(<tr key={s.id}><td className="py-1">{s.name}</td><td className="py-1">{s.frequency} at {s.time}</td><td className="py-1">{s.scope}</td><td className="py-1">{s.retention}d</td><td className="py-1">{s.isActive?'✓':'✗'}</td></tr>))}</tbody></table>}</div>)}
      {tab==='restore'&&(<div className="bg-white rounded-lg shadow p-6">{requests.length===0?<p className="text-sm text-gray-400">No restore requests</p>:<table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Backup</th><th className="text-left py-2">Status</th><th className="text-left py-2">Requested</th><th className="text-right py-2">Actions</th></tr></thead><tbody>{requests.map((r:any)=>(<tr key={r.id}><td className="py-1 text-xs font-mono">{r.backupId}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.status==='completed'?'bg-green-100':r.status==='rejected'?'bg-red-100':'bg-yellow-100'}`}>{r.status}</span></td><td className="py-1 text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</td><td className="py-1 text-right">{r.status==='pending'&&<button onClick={()=>handleApprove(r.id)} className="text-sm text-green-600 hover:underline">Approve</button>}</td></tr>))}</tbody></table>}</div>)}
    </div>
  );
}
