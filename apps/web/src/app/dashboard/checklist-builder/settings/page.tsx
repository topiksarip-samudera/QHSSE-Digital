'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function ChecklistSettingsPage() {
  const [requireEvidence, setRequireEvidence] = useState(true); const [defaultPassScore, setDefaultPassScore] = useState(75);
  const [saved, setSaved] = useState(false); const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/checklist-builder" className="hover:text-blue-600">Checklist Builder</Link><span>/</span><span className="text-gray-900">Settings</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Checklist Settings</h1><p className="text-gray-600 mt-1">Configure defaults and scoring rules</p></div><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={requireEvidence} onChange={(e) => setRequireEvidence(e.target.checked)} className="rounded text-blue-600" /><div><p className="text-sm font-medium text-gray-700">Critical items require evidence</p><p className="text-xs text-gray-500">Failed critical items must have evidence attached</p></div></label>
        <div><h2 className="text-lg font-semibold mb-3">Default Pass Score (%)</h2><div className="flex items-center gap-4"><input type="range" min={0} max={100} step={5} value={defaultPassScore} onChange={(e) => setDefaultPassScore(Number(e.target.value))} className="flex-1" /><span className="text-sm font-medium w-16 text-right">{defaultPassScore}%</span></div></div>
        <div><h2 className="text-lg font-semibold mb-3">Answer Types</h2><div className="grid grid-cols-2 gap-2 text-sm text-gray-600">{['Yes/No','Pass/Fail','Score 1-5','Text','Select','Checkbox','Number'].map(t=><label key={t} className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded" />{t}</label>)}</div></div>
      </div>
    </div>
  );
}
