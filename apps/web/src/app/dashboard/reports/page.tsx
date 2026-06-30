'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportsDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [kpis, setKpis] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    Promise.all([
      fetch(`${baseUrl}/api/v1/analytics/executive`, { headers }).then((r) => r.json()),
      fetch(`${baseUrl}/api/v1/report-kpis`, { headers }).then((r) => r.json()),
    ]).then(([execData, kpiData]) => {
      setStats(execData?.data || execData);
      setKpis(Array.isArray(kpiData?.data) ? kpiData.data : Array.isArray(kpiData) ? kpiData : []);
    });
  }, []);

  const navItems = [
    { href: '/dashboard/reports/templates', label: 'Report Templates', desc: 'Manage report templates and configurations' },
    { href: '/dashboard/reports/schedules', label: 'Report Schedules', desc: 'Configure automated report scheduling' },
    { href: '/dashboard/reports/runs', label: 'Report Runs', desc: 'View report generation history' },
    { href: '/dashboard/reports/settings', label: 'Report Settings', desc: 'Configure default export settings' },
    { href: '/dashboard/reports/dashboards', label: 'Global Dashboards', desc: 'Manage analytics dashboards and widgets' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <span className="text-3xl">📈</span>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(stats.summary || {}).map(([key, value]: any) => (
            <div key={key} className="bg-white rounded-lg border p-4 shadow-sm">
              <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 shadow-sm">
              <p className="text-sm text-gray-500">{kpi.name}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-semibold">{kpi.value}</p>
                <p className="text-sm text-gray-400 mb-0.5">{kpi.unit}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Target: {kpi.target} | Trend: {kpi.trend === 'down' ? '↓' : '↑'}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h3 className="font-semibold text-lg">{item.label}</h3>
            <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
