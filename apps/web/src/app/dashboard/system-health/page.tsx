'use client'; import { useState, useEffect } from 'react'; import { systemHealthApi } from '@/lib/api';

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const [h, a] = await Promise.all([systemHealthApi.getHealth().catch(()=>({data:{}})), systemHealthApi.getAlerts().catch(()=>({data:[]})) ]);
      setHealth(h.data); setAlerts(a.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading health data...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Health Monitoring</h1>

      {health && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">CPU</p><p className="text-2xl font-bold">{health.cpu}%</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">RAM</p><p className="text-2xl font-bold">{health.ram}%</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Disk</p><p className="text-2xl font-bold">{health.disk}%</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Status</p><p className="text-2xl font-bold text-green-600">{health.status || 'healthy'}</p></div>
        </div>
      )}

      {health && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">DB</p><p className="text-sm">{health.dbStatus}</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Uptime</p><p className="text-sm">{Math.round((health.uptimeMin||0)/60)}h</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Errors (24h)</p><p className="text-sm">{health.errors24h}</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">API Calls (24h)</p><p className="text-sm">{health.apiCalls24h}</p></div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Active Alerts</h2>
          <ul className="space-y-2">{alerts.map((a:any)=>(<li key={a.id} className="flex items-center justify-between text-sm border-b pb-2"><div><span className="font-medium">{a.metric}</span><span className="text-gray-500 mx-2">value: {a.value} / {a.threshold}</span></div><span className={`text-xs ${a.acknowledged?'text-gray-400':'text-red-600 font-medium'}`}>{a.acknowledged?'Acknowledged':'Active'}</span></li>))}</ul>
        </div>
      )}
    </div>
  );
}
