'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formApi, FormData } from '@/lib/api';
import Link from 'next/link';

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await formApi.getForm(id); setForm(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePublish = async () => {
    setActionLoading('publish');
    try { await formApi.publishForm(id); fetchData(); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setActionLoading(''); }
  };

  const handleClone = async () => {
    setActionLoading('clone');
    try { const res = await formApi.cloneForm(id); router.push(`/dashboard/form-builder/${res.data.id}`); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setActionLoading(''); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this form?')) return;
    try { await formApi.deleteForm(id); router.push('/dashboard/form-builder'); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading form...</div>;
  if (!form) return <div className="text-center py-12 text-red-500">Form not found</div>;

  const isDraft = form.status === 'draft';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/form-builder" className="hover:text-blue-600">Form Builder</Link><span>/</span><span className="text-gray-900 truncate">{form.name}</span>
      </div>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${form.status === 'published' ? 'bg-green-100 text-green-800' : form.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{form.status}</span>
            <span className="text-xs text-gray-400">v{form.version}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isDraft && <button onClick={handlePublish} disabled={actionLoading === 'publish'} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">{actionLoading === 'publish' ? '...' : 'Publish'}</button>}
          <button onClick={handleClone} disabled={actionLoading === 'clone'} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">{actionLoading === 'clone' ? '...' : 'Clone'}</button>
          <Link href={`/dashboard/form-builder/${id}/edit`} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</Link>
          <button onClick={handleDelete} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50">Delete</button>
        </div>
      </div>

      {form.description && <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-2">Description</h2><p className="text-sm text-gray-600">{form.description}</p></div>}

      {/* Sections */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sections ({form.sections?.length || 0})</h2>
        {(!form.sections || form.sections.length === 0) ? (
          <p className="text-sm text-gray-400">No sections yet. Edit the form to add sections and fields.</p>
        ) : (
          <div className="space-y-4">
            {form.sections.map((s: any) => (
              <div key={s.id} className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                {(!s.fields || s.fields.length === 0) ? (
                  <p className="text-xs text-gray-400">No fields</p>
                ) : (
                  <div className="space-y-1">
                    {s.fields.map((f: any) => (
                      <div key={f.id} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-700 font-medium">{f.label}</span>
                        <span className="text-gray-400">({f.type})</span>
                        {f.required && <span className="text-red-500">*</span>}
                        {f.options && f.options.length > 0 && <span className="text-gray-400">- {f.options.length} options</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Versions */}
      {form.versions && form.versions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Versions</h2>
          <ul className="space-y-2">
            {form.versions.map((v: any) => (
              <li key={v.id} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">v{v.version}</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${v.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{v.status}</span>
                <span className="text-xs text-gray-400">{new Date(v.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
