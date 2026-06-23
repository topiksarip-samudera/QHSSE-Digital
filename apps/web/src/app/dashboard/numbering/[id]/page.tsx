'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { numberingApi, NumberingRule } from '@/lib/api';
import Link from 'next/link';

export default function NumberingDetailPage() {
  const params = useParams(); const id = params.id as string;
  const [rule, setRule] = useState<NumberingRule | null>(null); const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any>(null); const [genResult, setGenResult] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await numberingApi.getRule(id); setRule(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePreview = async () => { try { const r = await numberingApi.preview(id); setPreview(r.data); } catch (e) { console.error(e); } };
  const handleGenerate = async () => { try { const r = await numberingApi.generate(id, { recordType: 'test', recordId: 'test-1' }); setGenResult(r.data); fetchData(); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!rule) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/numbering" className="hover:text-blue-600">Numbering</Link><span>/</span><span className="text-gray-900">{rule.name}</span></div>
      <h1 className="text-2xl font-bold text-gray-900">{rule.name}</h1>
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
        <div><dt className="text-sm text-gray-500">Module</dt><dd className="text-sm font-mono">{rule.moduleCode}</dd></div>
        <div><dt className="text-sm text-gray-500">Sample</dt><dd className="text-sm font-mono font-medium">{rule.sample}</dd></div>
        <div><dt className="text-sm text-gray-500">Prefix</dt><dd className="text-sm font-mono">{rule.prefix || '-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Suffix</dt><dd className="text-sm font-mono">{rule.suffix || '-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Digit Count</dt><dd className="text-sm">{rule.digitCount}</dd></div>
        <div><dt className="text-sm text-gray-500">Connector</dt><dd className="text-sm">{rule.connector}</dd></div>
        <div><dt className="text-sm text-gray-500">Reset By</dt><dd className="text-sm">{rule.resetBy || 'none'}</dd></div>
        <div><dt className="text-sm text-gray-500">Status</dt><dd className="text-sm">{rule.isActive ? 'Active' : 'Inactive'}</dd></div>
      </div>
      <div className="flex gap-3">
        <button onClick={handlePreview} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Preview Next</button>
        <button onClick={handleGenerate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Generate Number</button>
        <Link href={`/dashboard/numbering/${id}/edit`} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Edit</Link>
      </div>
      {preview && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-sm font-medium">Next Preview: <span className="font-mono text-lg">{preview.preview}</span></p><p className="text-xs text-gray-500 mt-1">Counter: {preview.nextCounter} | Sample: {preview.sample}</p></div>}
      {genResult && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm font-medium">Generated: <span className="font-mono text-lg">{genResult.number}</span></p><p className="text-xs text-gray-500 mt-1">Counter: {genResult.counter}</p></div>}
      {rule.histories && rule.histories.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-3">Recent History</h2><ul className="space-y-1">{rule.histories.map((h: any) => (<li key={h.id} className="text-sm flex gap-3"><span className="font-mono text-gray-700">{h.generatedNumber}</span><span className="text-gray-400">{h.recordType}/{h.recordId}</span><span className="text-gray-300">{new Date(h.createdAt).toLocaleString()}</span></li>))}</ul></div>
      )}
    </div>
  );
}
