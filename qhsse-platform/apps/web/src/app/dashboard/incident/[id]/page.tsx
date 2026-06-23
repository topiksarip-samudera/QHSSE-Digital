'use client'; import { useState, useEffect, useCallback } from 'react'; import { useParams, useRouter } from 'next/navigation'; import { incidentReportApi } from '@/lib/api'; import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = { draft: 'bg-gray-100 text-gray-800', submitted: 'bg-blue-100 text-blue-800', under_review: 'bg-yellow-100 text-yellow-800', investigation: 'bg-purple-100 text-purple-800', rca_completed: 'bg-indigo-100 text-indigo-800', capa_in_progress: 'bg-orange-100 text-orange-800', closed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

export default function IncidentDetailPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [incident, setIncident] = useState<any>(null); const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await incidentReportApi.getIncident(id); setIncident(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async () => { if (!confirm('Submit this incident?')) return; try { await incidentReportApi.submitIncident(id); fetchData(); } catch (e) { console.error(e); } };
  const handleDelete = async () => { if (!confirm('Delete?')) return; try { await incidentReportApi.deleteIncident(id); router.push('/dashboard/incident'); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!incident) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/incident" className="hover:text-blue-600">Incidents</Link><span>/</span><span className="text-gray-900 truncate">{incident.title}</span></div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1><div className="flex items-center gap-2 mt-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[incident.status]||''}`}>{incident.status.replace('_',' ')}</span><span className="text-xs text-gray-400 font-mono">{incident.number || `Draft-${incident.id?.slice(0,8)}`}</span></div></div>
        <div className="flex gap-2">{incident.status === 'draft' && <><button onClick={handleSubmit} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Submit</button><Link href={`/dashboard/incident/${id}/edit`} className="px-3 py-1.5 border rounded text-sm">Edit</Link><button onClick={handleDelete} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm">Delete</button></>}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
        <div><dt className="text-sm text-gray-500">Date</dt><dd className="text-sm font-medium">{new Date(incident.incidentDate).toLocaleDateString()}</dd></div>
        <div><dt className="text-sm text-gray-500">Reported By</dt><dd className="text-sm">{incident.reportedById}</dd></div>
        <div><dt className="text-sm text-gray-500">Site</dt><dd className="text-sm">{incident.siteId || '-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Created</dt><dd className="text-sm text-gray-400">{new Date(incident.createdAt).toLocaleString()}</dd></div>
        <div className="col-span-2"><dt className="text-sm text-gray-500">Description</dt><dd className="text-sm mt-1 whitespace-pre-wrap">{incident.description || '-'}</dd></div>
        {incident.immediateAction && <div className="col-span-2"><dt className="text-sm text-gray-500">Immediate Action</dt><dd className="text-sm mt-1">{incident.immediateAction}</dd></div>}
      </div>
      {incident.statusHistories && incident.statusHistories.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-3">Status History</h2><ul className="space-y-2">{incident.statusHistories.map((h:any)=>(<li key={h.id} className="text-sm flex gap-3"><span className="text-gray-400 w-28">{new Date(h.createdAt).toLocaleString()}</span><span className={h.oldStatus?'text-gray-500':''}>{h.oldStatus || '—'}</span><span className="text-gray-400">→</span><span className={`font-medium ${h.newStatus==='submitted'?'text-blue-600':h.newStatus==='closed'?'text-green-600':''}`}>{h.newStatus}</span></li>))}</ul></div>
      )}
    </div>
  );
}
