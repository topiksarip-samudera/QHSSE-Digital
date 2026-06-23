'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checklistApi, ChecklistData } from '@/lib/api';
import Link from 'next/link';

export default function EditChecklistPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [c, setC] = useState<ChecklistData | null>(null); const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [name, setName] = useState(''); const [description, setDescription] = useState('');
  const [passScore, setPassScore] = useState(''); const [sections, setSections] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await checklistApi.getChecklist(id); const f = res.data;
      setC(f); setName(f.name || ''); setDescription(f.description || ''); setPassScore(f.passScore != null ? String(f.passScore) : '');
      setSections(f.sections?.map((s: any) => ({ title: s.title, description: s.description, sortOrder: s.sortOrder, items: s.items?.map((it: any) => ({ question: it.question, description: it.description, answerType: it.answerType, required: it.required, weight: it.weight, critical: it.critical, requireEvidence: it.requireEvidence, requireComment: it.requireComment, autoFinding: it.autoFinding, findingAction: it.findingAction, sortOrder: it.sortOrder, options: it.options?.map((o: any) => ({ label: o.label, value: o.value, score: o.score, isPass: o.isPass, sortOrder: o.sortOrder })) })) || [] })) || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const addSection = () => setSections([...sections, { title: '', sortOrder: sections.length, items: [] }]);
  const removeSection = (si: number) => setSections(sections.filter((_, i) => i !== si));
  const updateSection = (si: number, f: string, v: any) => { const u = [...sections]; (u[si] as any)[f] = v; setSections(u); };
  const addItem = (si: number) => { const u = [...sections]; u[si].items = [...u[si].items, { question: '', answerType: 'yes_no', required: false, weight: 1, critical: false, requireEvidence: false, requireComment: false, sortOrder: u[si].items.length, options: [] }]; setSections(u); };
  const updateItem = (si: number, ii: number, f: string, v: any) => { const u = [...sections]; (u[si].items[ii] as any)[f] = v; setSections(u); };
  const removeItem = (si: number, ii: number) => { const u = [...sections]; u[si].items = u[si].items.filter((_: any, i: number) => i !== ii); setSections(u); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await checklistApi.updateChecklist(id, { name, description: description || undefined, passScore: passScore ? Number(passScore) : undefined, sections: sections.map((s) => ({ title: s.title, description: s.description, sortOrder: s.sortOrder, items: s.items.map((it: any) => ({ question: it.question, description: it.description, answerType: it.answerType, required: it.required, weight: it.weight, critical: it.critical, requireEvidence: it.requireEvidence, requireComment: it.requireComment, autoFinding: it.autoFinding, findingAction: it.findingAction, sortOrder: it.sortOrder, options: it.options?.length > 0 ? it.options : undefined })) })) });
      router.push(`/dashboard/checklist-builder/${id}`);
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!c) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/checklist-builder" className="hover:text-blue-600">Checklist Builder</Link><span>/</span><Link href={`/dashboard/checklist-builder/${id}`} className="hover:text-blue-600">{c.name}</Link><span>/</span><span className="text-gray-900">Edit</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Checklist</h1>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label><input type="number" value={passScore} onChange={(e) => setPassScore(e.target.value)} className="w-32 px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-gray-900">Sections ({sections.length})</h3><button type="button" onClick={addSection} className="text-sm text-blue-600 hover:underline">+ Add Section</button></div>
          {sections.map((s, si) => (
            <div key={si} className="border rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-2"><input type="text" value={s.title} onChange={(e) => updateSection(si, 'title', e.target.value)} placeholder="Section title" className="w-48 px-2 py-1 border rounded text-sm font-medium" /><button type="button" onClick={() => removeSection(si)} className="text-xs text-red-500 hover:underline">Remove</button></div>
              <div className="ml-4 space-y-2">
                {s.items.map((it: any, ii: number) => (
                  <div key={ii} className="flex items-center gap-1">
                    <input type="text" value={it.question} onChange={(e) => updateItem(si, ii, 'question', e.target.value)} placeholder="Question" className="flex-1 px-2 py-1 border rounded text-xs" />
                    <select value={it.answerType} onChange={(e) => updateItem(si, ii, 'answerType', e.target.value)} className="w-20 px-1 py-1 border rounded text-xs"><option value="yes_no">Yes/No</option><option value="pass_fail">Pass/Fail</option><option value="score_1_5">Score 1-5</option><option value="text">Text</option><option value="select">Select</option></select>
                    <label className="flex items-center gap-0.5 text-xs"><input type="checkbox" checked={it.required} onChange={(e) => updateItem(si, ii, 'required', e.target.checked)} className="rounded" />Req</label>
                    <label className="flex items-center gap-0.5 text-xs"><input type="checkbox" checked={it.critical} onChange={(e) => updateItem(si, ii, 'critical', e.target.checked)} className="rounded" />Crit</label>
                    <button type="button" onClick={() => removeItem(si, ii)} className="text-xs text-red-400 hover:underline">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => addItem(si)} className="text-xs text-blue-500 hover:underline ml-1">+ Add Item</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save Changes'}</button><Link href={`/dashboard/checklist-builder/${id}`} className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
      </div>
    </div>
  );
}
