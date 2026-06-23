'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function NumberingSettingsPage() {
  const [defaultDigits, setDefaultDigits] = useState(5); const [defaultConnector, setDefaultConnector] = useState('-');
  const [saved, setSaved] = useState(false); const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/numbering" className="hover:text-blue-600">Numbering</Link><span>/</span><span className="text-gray-900">Settings</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Numbering Settings</h1></div><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div><h2 className="text-lg font-semibold mb-3">Default Digit Count</h2><div className="flex items-center gap-4"><input type="range" min={3} max={10} value={defaultDigits} onChange={(e) => setDefaultDigits(Number(e.target.value))} className="flex-1" /><span className="text-sm font-medium w-16 text-right">{defaultDigits}</span></div><p className="text-xs text-gray-400 mt-1">INC-{String(1).padStart(defaultDigits, '0')}</p></div>
        <div><h2 className="text-lg font-semibold mb-3">Default Connector</h2><div className="flex gap-2">{(['-', '/', '_', '.']).map(c => <button key={c} onClick={() => setDefaultConnector(c)} className={`px-4 py-2 border rounded text-sm ${defaultConnector === c ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}>{c}</button>)}</div></div>
      </div>
    </div>
  );
}
