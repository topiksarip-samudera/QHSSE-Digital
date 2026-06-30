'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [form, setForm] = useState({ defaultFormat: 'pdf', autoExport: false, exportRetentionDays: 90, maxExportRows: 10000 });
  const [saved, setSaved] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/report-settings`, { headers: headers() })
      .then((r) => r.json())
      .then((data) => {
        const s = data?.data || data;
        setSettings(s);
        setForm({ defaultFormat: s.defaultFormat, autoExport: s.autoExport, exportRetentionDays: s.exportRetentionDays, maxExportRows: s.maxExportRows });
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${baseUrl}/api/v1/report-settings`, {
      method: 'PATCH', headers: headers(), body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Back to Reports</Link>
        <h1 className="text-2xl font-bold">Report Settings</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Default Export Format</label>
          <select value={form.defaultFormat} onChange={(e) => setForm({ ...form, defaultFormat: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="pdf">PDF</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Export Retention (Days)</label>
          <input type="number" value={form.exportRetentionDays} onChange={(e) => setForm({ ...form, exportRetentionDays: parseInt(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Export Rows</label>
          <input type="number" value={form.maxExportRows} onChange={(e) => setForm({ ...form, maxExportRows: parseInt(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="autoExport" checked={form.autoExport} onChange={(e) => setForm({ ...form, autoExport: e.target.checked })} className="rounded" />
          <label htmlFor="autoExport" className="text-sm font-medium">Auto Export</label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
        {saved && <span className="text-green-600 text-sm ml-3">Settings saved!</span>}
      </form>
    </div>
  );
}
