'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardBuilderApi, DashboardData } from '@/lib/api';
import Link from 'next/link';

export default function DashboardBuilderListPage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await dashboardBuilderApi.getDashboards(); setDashboards(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard Builder</h1><p className="text-gray-600 mt-1">Create custom dashboards with widgets and charts</p></div>
        <Link href="/dashboard/builder/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Dashboard</Link>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : dashboards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No dashboards</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Widgets</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {dashboards.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/builder/${d.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{d.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.scope}{d.scopeId ? ` (${d.scopeId})` : ''}</td>
                  <td className="px-4 py-3 text-sm">{d.isDefault ? <span className="text-green-600">✓</span> : <span className="text-gray-300">-</span>}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d._count?.widgets || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}><button onClick={async () => { if (confirm('Delete?')) { await dashboardBuilderApi.deleteDashboard(d.id); fetchData(); } }} className="text-sm text-red-600 hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
