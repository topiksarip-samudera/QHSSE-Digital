'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'custom', config: {} });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  });

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/api/v1/report-templates`, { headers: headers() });
    const data = await res.json();
    setTemplates(data?.data?.data || data?.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${baseUrl}/api/v1/report-templates`, {
      method: 'POST', headers: headers(), body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', type: 'custom', config: {} });
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/api/v1/report-templates/${id}`, { method: 'DELETE', headers: headers() });
    fetchTemplates();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Back to Reports</Link>
          <h1 className="text-2xl font-bold">Report Templates</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ New Template'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded px-3 py-2">
                <option value="custom">Custom</option>
                <option value="executive">Executive</option>
                <option value="monthly_qhsse">Monthly QHSSE</option>
                <option value="site_comparison">Site Comparison</option>
                <option value="kpi_trends">KPI Trends</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Create Template</button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No templates found.</p>
      ) : (
        <div className="space-y-3">
          {templates.map((t: any) => (
            <div key={t.id} className="bg-white rounded-lg border p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-500">Type: {t.type} | Runs: {t._count?.runHistory || 0}</p>
              </div>
              <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
