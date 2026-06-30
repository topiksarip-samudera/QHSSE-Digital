'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function EmergencyDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/emergency/dashboard').then(r => {
      setDashboard(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading emergency dashboard...</div>;
  if (!dashboard) return <div className="p-8 text-muted-foreground">Failed to load dashboard.</div>;

  const score = dashboard.score || {};

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Emergency Response Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Readiness Score" value={`${Math.round(score.readinessScore || 0)}%`} color="blue" />
        <KpiCard label="Drill Completion" value={`${Math.round(score.drillCompletionRate || 0)}%`} color="green" />
        <KpiCard label="Equipment Ready" value={`${Math.round(score.equipmentReadyRate || 0)}%`} color="amber" />
        <KpiCard label="Incidents Resolved" value={score.resolvedIncidents != null ? `${score.resolvedIncidents}/${score.totalIncidents}` : '-/-'} color="red" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Plans" value={dashboard.totalPlans} onClick={() => router.push('/dashboard/emergency/plans')} />
        <StatCard label="Total Drills" value={dashboard.totalDrills} onClick={() => router.push('/dashboard/emergency/drills')} />
        <StatCard label="Total Equipment" value={dashboard.totalEquipment} onClick={() => router.push('/dashboard/emergency/equipment')} />
        <StatCard label="Total Incidents" value={dashboard.totalIncidents} onClick={() => router.push('/dashboard/emergency/incidents')} />
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusGroup title="Plans by Status" items={dashboard.planByStatus || []} keyField="status" />
        <StatusGroup title="Drills by Status" items={dashboard.drillByStatus || []} keyField="status" />
        <StatusGroup title="Equipment by Status" items={dashboard.equipmentByStatus || []} keyField="inspectionStatus" />
        <StatusGroup title="Incidents by Status" items={dashboard.incidentByStatus || []} keyField="status" />
      </div>
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: any = { blue: 'bg-blue-50 border-blue-200 text-blue-700', green: 'bg-green-50 border-green-200 text-green-700', amber: 'bg-amber-50 border-amber-200 text-amber-700', red: 'bg-red-50 border-red-200 text-red-700' };
  return (
    <div className={`rounded-lg border p-5 ${colors[color] || colors.blue}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatCard({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg border bg-card p-5 text-left hover:bg-accent transition-colors">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </button>
  );
}

function StatusGroup({ title, items, keyField }: { title: string; items: any[]; keyField: string }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">{title}</h3>
      <div className="space-y-2">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm capitalize">{item[keyField]?.replace(/_/g, ' ') || 'unknown'}</span>
            <span className="text-sm font-medium bg-accent rounded-full px-2.5 py-0.5">{item._count}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
      </div>
    </div>
  );
}
