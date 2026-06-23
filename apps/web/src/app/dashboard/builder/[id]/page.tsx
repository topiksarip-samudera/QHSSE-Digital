'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { dashboardBuilderApi, DashboardData } from '@/lib/api';
import Link from 'next/link';

export default function DashboardDetailPage() {
  const params = useParams(); const id = params.id as string;
  const [dash, setDash] = useState<DashboardData | null>(null); const [loading, setLoading] = useState(true);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [widgetForm, setWidgetForm] = useState({ type: 'stat', title: '', config: '{}' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await dashboardBuilderApi.getDashboard(id); setDash(r.data); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddWidget = async () => {
    if (!widgetForm.title) return;
    try {
      await dashboardBuilderApi.addWidget(id, { type: widgetForm.type, title: widgetForm.title, config: JSON.parse(widgetForm.config || '{}') });
      setShowAddWidget(false); setWidgetForm({ type: 'stat', title: '', config: '{}' }); fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!dash) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/builder" className="hover:text-blue-600">Dashboards</Link><span>/</span><span className="text-gray-900">{dash.name}</span></div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">{dash.name}</h1><p className="text-sm text-gray-500">{dash.scope} dashboard</p></div>
        <button onClick={() => setShowAddWidget(!showAddWidget)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ Add Widget</button>
      </div>

      {showAddWidget && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Widget</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={widgetForm.title} onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Type</label><select value={widgetForm.type} onChange={(e) => setWidgetForm({ ...widgetForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="stat">Stat Card</option><option value="chart">Chart</option><option value="table">Table</option><option value="text">Text</option><option value="list">List</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Config (JSON)</label><textarea value={widgetForm.config} onChange={(e) => setWidgetForm({ ...widgetForm, config: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" /></div>
          <div className="flex gap-2"><button onClick={handleAddWidget} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add</button><button onClick={() => setShowAddWidget(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
        </div>
      )}

      {dash.description && <p className="text-sm text-gray-500">{dash.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dash.widgets?.map((w: any) => (
          <div key={w.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">{w.title}</h3>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{w.type}</span>
            </div>
            <pre className="text-xs text-gray-400 overflow-auto max-h-24">{JSON.stringify(w.config, null, 2)}</pre>
            <button onClick={async () => { await dashboardBuilderApi.deleteWidget(id, w.id); fetchData(); }} className="mt-2 text-xs text-red-500 hover:underline">Remove</button>
          </div>
        ))}
        {(!dash.widgets || dash.widgets.length === 0) && <p className="text-sm text-gray-400">No widgets</p>}
      </div>
    </div>
  );
}
