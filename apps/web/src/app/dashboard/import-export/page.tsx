'use client';

import { useState, useEffect, useCallback } from 'react';
import { importExportApi } from '@/lib/api';
import Link from 'next/link';

export default function ImportExportPage() {
  const [tab, setTab] = useState<'import' | 'export'>('import');
  const [imports, setImports] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [moduleCode, setModuleCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fetchImports = useCallback(async () => {
    setLoading(true);
    try { const r = await importExportApi.getImports(); setImports(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  const fetchExports = useCallback(async () => {
    setLoading(true);
    try { const r = await importExportApi.getExports(); setExports(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === 'import') fetchImports(); else fetchExports(); }, [tab]);

  const handleImport = async () => {
    if (!file || !moduleCode) return;
    setUploading(true);
    try { const r = await importExportApi.uploadImport(file, moduleCode); setResult(r.data); fetchImports(); } catch (e) { console.error(e); } finally { setUploading(false); }
  };

  const handleCommit = async (id: string) => {
    try { const r = await importExportApi.commitImport(id); setResult(r.data); fetchImports(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Import & Export Center</h1><p className="text-gray-600 mt-1">Bulk import and export data across modules</p></div>
      <div className="flex border-b border-gray-200 mb-4">
        {[{ key: 'import' as const, label: 'Import' }, { key: 'export' as const, label: 'Export History' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'import' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold">Upload CSV File</h2>
            <div className="flex gap-3 items-end">
              <div><label className="block text-sm font-medium mb-1">Module</label><input type="text" value={moduleCode} onChange={(e) => setModuleCode(e.target.value)} placeholder="e.g. master-data" className="px-3 py-2 border rounded-lg text-sm w-40" /></div>
              <div><label className="block text-sm font-medium mb-1">File</label><input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" /></div>
              <button onClick={handleImport} disabled={uploading || !file} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload & Preview'}</button>
            </div>
            {result && <div className={`p-3 rounded-lg text-sm ${result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{result.error || `Uploaded ${result.rows} rows. Preview before committing.`}</div>}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Import History</h2>
            {loading ? <p className="text-sm text-gray-400">Loading...</p> : imports.length === 0 ? <p className="text-sm text-gray-400">No imports</p> : (
              <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">File</th><th className="text-left py-2">Module</th><th className="text-left py-2">Status</th><th className="text-left py-2">Rows</th><th className="text-right py-2">Actions</th></tr></thead><tbody>{imports.map((j: any) => (<tr key={j.id}><td className="py-1">{j.fileName}</td><td className="py-1">{j.moduleCode}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${j.status === 'committed' ? 'bg-green-100 text-green-800' : j.status === 'preview' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>{j.status}</span></td><td className="py-1">{j.totalRows}</td><td className="py-1 text-right">{j.status === 'preview' && <button onClick={() => handleCommit(j.id)} className="text-sm text-blue-600 hover:underline">Commit</button>}</td></tr>))}</tbody></table>
            )}
          </div>
        </div>
      )}

      {tab === 'export' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Export History</h2>
          {loading ? <p className="text-sm text-gray-400">Loading...</p> : exports.length === 0 ? <p className="text-sm text-gray-400">No exports</p> : (
            <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">File</th><th className="text-left py-2">Module</th><th className="text-left py-2">Format</th><th className="text-left py-2">Status</th><th className="text-left py-2">Created</th></tr></thead><tbody>{exports.map((j: any) => (<tr key={j.id}><td className="py-1">{j.fileName}</td><td className="py-1">{j.moduleCode}</td><td className="py-1">{j.format}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${j.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{j.status}</span></td><td className="py-1 text-xs text-gray-400">{new Date(j.createdAt).toLocaleString()}</td></tr>))}</tbody></table>
          )}
        </div>
      )}
    </div>
  );
}
