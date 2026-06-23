'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checklistApi, ChecklistData } from '@/lib/api';
import Link from 'next/link';

export default function ChecklistDetailPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [c, setC] = useState<ChecklistData | null>(null); const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(''); const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await checklistApi.getChecklist(id); setC(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePublish = async () => { setActionLoading('pub'); try { await checklistApi.publishChecklist(id); fetchData(); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setActionLoading(''); } };
  const handleDelete = async () => { if (!confirm('Delete?')) return; try { await checklistApi.deleteChecklist(id); router.push('/dashboard/checklist-builder'); } catch (err) { console.error(err); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!c) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/checklist-builder" className="hover:text-blue-600">Checklist Builder</Link><span>/</span><span className="text-gray-900 truncate">{c.name}</span></div>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
          <div className="flex items-center gap-2 mt-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span><span className="text-xs text-gray-400">v{c.version}</span>{c.passScore != null && <span className="text-xs text-gray-400">Pass: {c.passScore}</span>}</div>
        </div>
        <div className="flex gap-2">
          {c.status !== 'active' && <button onClick={handlePublish} disabled={actionLoading === 'pub'} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Publish</button>}
          <Link href={`/dashboard/checklist-builder/${id}/edit`} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</Link>
          <button onClick={handleDelete} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50">Delete</button>
        </div>
      </div>
      {c.description && <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-2">Description</h2><p className="text-sm text-gray-600">{c.description}</p></div>}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sections ({c.sections?.length || 0})</h2>
        {(!c.sections || c.sections.length === 0) ? <p className="text-sm text-gray-400">No sections. Edit to add.</p> : (
          <div className="space-y-4">
            {c.sections.map((s: any) => (
              <div key={s.id} className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                {s.items?.map((it: any) => (
                  <div key={it.id} className="flex items-center gap-2 text-xs py-0.5">
                    <span className="text-gray-700">{it.question}</span>
                    <span className="text-gray-400">[{it.answerType}]</span>
                    {it.required && <span className="text-red-500">*</span>}
                    {it.critical && <span className="text-orange-600 font-medium">CRITICAL</span>}
                    <span className="text-gray-400">w:{it.weight}</span>
                    {it.options?.length > 0 && <span className="text-gray-400">{it.options.length} opts</span>}
                  </div>
                )) || <p className="text-xs text-gray-400">No items</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
