'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FormBuilderSettingsPage() {
  const [requirePublish, setRequirePublish] = useState(true);
  const [maxFieldsPerForm, setMaxFieldsPerForm] = useState(100);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/form-builder" className="hover:text-blue-600">Form Builder</Link><span>/</span><span className="text-gray-900">Settings</span>
      </div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Form Builder Settings</h1><p className="text-gray-600 mt-1">Configure default behavior and limits</p></div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save Settings'}</button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={requirePublish} onChange={(e) => setRequirePublish(e.target.checked)} className="rounded text-blue-600" /><div><p className="text-sm font-medium text-gray-700">Require publish before use</p><p className="text-xs text-gray-500">Forms must be published before they can accept submissions</p></div></label>
        <div>
          <h2 className="text-lg font-semibold mb-3">Max Fields Per Form</h2>
          <div className="flex items-center gap-4">
            <input type="range" min={10} max={500} step={10} value={maxFieldsPerForm} onChange={(e) => setMaxFieldsPerForm(Number(e.target.value))} className="flex-1" />
            <span className="text-sm font-medium w-16 text-right">{maxFieldsPerForm}</span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Field Types</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {['Text', 'Number', 'Textarea', 'Select', 'Radio', 'Checkbox', 'Date', 'File', 'Email', 'Phone'].map((t) => (
              <label key={t} className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded" />{t}</label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
