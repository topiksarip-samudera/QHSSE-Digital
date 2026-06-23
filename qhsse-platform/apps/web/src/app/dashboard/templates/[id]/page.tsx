'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { templateApi, TemplateData } from '@/lib/api';
import Link from 'next/link';

export default function TemplateDetailPage() {
  const params = useParams(); const id = params.id as string;
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true); const [actionLoading, setActionLoading] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await templateApi.getTemplate(id); setTemplate(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePublish = async () => { setActionLoading('pub'); try { await templateApi.publishTemplate(id); fetchData(); } catch (e) { console.error(e); } finally { setActionLoading(''); } };
  const handleClone = async () => { setActionLoading('clone'); try { await templateApi.cloneTemplate(id); fetchData(); } catch (e) { console.error(e); } finally { setActionLoading(''); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!template) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/templates" className="hover:text-blue-600">Templates</Link><span>/</span><span className="text-gray-900">{template.name}</span></div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{template.status}</span>
            <span className="text-xs text-gray-400">v{template.version} - {template.type}</span>
            {template.isGlobal && <span className="text-xs text-blue-600 font-medium">Global</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {template.status !== 'active' && <button onClick={handlePublish} disabled={actionLoading === 'pub'} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Publish</button>}
          <button onClick={handleClone} disabled={actionLoading === 'clone'} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Clone</button>
          <Link href={`/dashboard/templates/${id}/edit`} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Template Content</h2>
        <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">{JSON.stringify(template.content, null, 2)}</pre>
      </div>
      {template.versions && template.versions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-3">Versions</h2><ul className="space-y-1">{template.versions.map((v: any) => (<li key={v.id} className="text-sm flex gap-3"><span className="font-medium">v{v.version}</span><span className="text-gray-400">{new Date(v.createdAt).toLocaleString()}</span></li>))}</ul></div>
      )}
    </div>
  );
}
