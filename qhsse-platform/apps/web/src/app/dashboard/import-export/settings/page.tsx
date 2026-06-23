'use client';

import { useState } from 'react';
import { importExportApi } from '@/lib/api';
import Link from 'next/link';

export default function ExportSettingsPage() {
  const [moduleCode, setModuleCode] = useState('');
  const [format, setFormat] = useState('csv');
  const [success, setSuccess] = useState('');

  const handleExport = async () => {
    if (!moduleCode) return;
    try { const r = await importExportApi.createExport({ moduleCode, format }); setSuccess(`Export created: ${r.data.fileName}`); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/import-export" className="hover:text-blue-600">Import & Export</Link><span>/</span><span className="text-gray-900">Export</span></div>
      <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-sm text-gray-500">Generate an export file for a module's data</p>
        <div className="flex gap-3 items-end">
          <div><label className="block text-sm font-medium mb-1">Module</label><input type="text" value={moduleCode} onChange={(e) => setModuleCode(e.target.value)} placeholder="e.g. master-data" className="px-3 py-2 border rounded-lg text-sm w-40" /></div>
          <div><label className="block text-sm font-medium mb-1">Format</label><select value={format} onChange={(e) => setFormat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="csv">CSV</option><option value="xlsx">Excel</option><option value="pdf">PDF</option></select></div>
          <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Generate Export</button>
        </div>
        {success && <div className="p-3 bg-green-50 border rounded-lg text-sm text-green-700">{success}</div>}
      </div>
    </div>
  );
}
