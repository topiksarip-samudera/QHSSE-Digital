'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'module', description: '', scope: 'company' });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  });

  const fetchDashboards = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/api/v1/report-dashboards`, { headers: headers() });
    const data = await res.json();
    setDashboards(data?.data?.data || data?.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDashboards(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${baseUrl}/api/v1/report-dashboards`, {
      method: 'POST', headers: headers(), body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', type: 'module', description: '', scope: 'company' });
    fetchDashboards();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/api/v1/report-dashboards/${id}`, { method: 'DELETE', headers: headers() });
    fetchDashboards();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Back to Reports</Link>
          <h1 className="text-2xl font-bold">Global Dashboards</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ New Dashboard'}
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
                <option value="module">Module</option>
                <option value="executive">Executive</option>
                <option value="custom">Custom</option>
                <option value="cross-module">Cross-Module</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Create Dashboard</button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : dashboards.length === 0 ? (
        <p className="text-gray-500">No dashboards found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboards.map((d: any) => (
            <div key={d.id} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{d.name}</h3>
                <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
              <p className="text-sm text-gray-500">{d.description || 'No description'}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{d.type}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{d.scope}</span>
                <span className="text-xs text-gray-400">{d._count?.widgets || 0} widgets</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
