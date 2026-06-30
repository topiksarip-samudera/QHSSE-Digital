'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ templateId: '', frequency: 'monthly', format: 'pdf', recipients: [] });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  });

  const fetchData = async () => {
    setLoading(true);
    const [sRes, tRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/report-schedules`, { headers: headers() }),
      fetch(`${baseUrl}/api/v1/report-templates`, { headers: headers() }),
    ]);
    const [sData, tData] = await Promise.all([sRes.json(), tRes.json()]);
    setSchedules(sData?.data || []);
    setTemplates(tData?.data?.data || tData?.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${baseUrl}/api/v1/report-schedules`, {
      method: 'POST', headers: headers(), body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ templateId: '', frequency: 'monthly', format: 'pdf', recipients: [] });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/api/v1/report-schedules/${id}`, { method: 'DELETE', headers: headers() });
    fetchData();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Back to Reports</Link>
          <h1 className="text-2xl font-bold">Report Schedules</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ New Schedule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template</label>
              <select value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} className="w-full border rounded px-3 py-2" required>
                <option value="">Select template...</option>
                {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full border rounded px-3 py-2">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full border rounded px-3 py-2">
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Create Schedule</button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-500">No schedules found.</p>
      ) : (
        <div className="space-y-3">
          {schedules.map((s: any) => (
            <div key={s.id} className="bg-white rounded-lg border p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{s.template?.name || s.templateId}</h3>
                <p className="text-sm text-gray-500">
                  {s.frequency} | {s.format.toUpperCase()} | Next: {s.nextRun ? new Date(s.nextRun).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
