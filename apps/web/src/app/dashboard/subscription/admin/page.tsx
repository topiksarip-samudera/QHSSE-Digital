'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface SaasDashboard {
  totalTenants: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  totalPlans: number;
  totalRevenue: number;
  recentPaidInvoices?: Array<{ id: string; number: string; tenantName: string; amount: number; currency: string; paidAt: string }>;
}

const KPI_CARDS = [
  { key: 'totalTenants', label: 'Total Tenants', icon: '🏢', color: 'bg-blue-50 text-blue-700' },
  { key: 'activeSubscriptions', label: 'Active', icon: '✅', color: 'bg-green-50 text-green-700' },
  { key: 'trialSubscriptions', label: 'Trials', icon: '🧪', color: 'bg-yellow-50 text-yellow-700' },
  { key: 'cancelledSubscriptions', label: 'Cancelled', icon: '❌', color: 'bg-red-50 text-red-700' },
  { key: 'totalPlans', label: 'Plans', icon: '📦', color: 'bg-purple-50 text-purple-700' },
  { key: 'totalRevenue', label: 'Revenue', icon: '💰', color: 'bg-emerald-50 text-emerald-700', format: true },
];

export default function SaasAdminPage() {
  const [data, setData] = useState<SaasDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/saas/dashboard');
      setData(res.data.data || res.data);
    } catch (e) { console.error('Failed to load SaaS dashboard', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading SaaS dashboard...</div>;

  if (!data) return <div className="text-center py-12 text-gray-500">⚠️ Failed to load dashboard data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">SaaS Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_CARDS.map((card) => {
          const value = (data as any)[card.key] ?? 0;
          return (
            <div key={card.key} className={`rounded-lg shadow p-4 ${card.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{card.icon}</span>
                <p className="text-xs font-medium opacity-75">{card.label}</p>
              </div>
              <p className="text-2xl font-bold">
                {card.format ? `$${(value / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Paid Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Paid Invoices</h2>
        </div>
        {!data.recentPaidInvoices || data.recentPaidInvoices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-gray-400 text-sm">No paid invoices yet</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentPaidInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.tenantName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{(inv.amount / 100).toFixed(2)} {inv.currency}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(inv.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
