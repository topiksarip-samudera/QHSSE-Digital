'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface SubscriptionStatus { plan: string; status: string; trialEndsAt?: string; trialDaysLeft?: number; currentPeriodEnd?: string; }
interface Invoice { id: string; number: string; amount: number; currency: string; status: string; dueDate: string; paidAt?: string; createdAt: string; }

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  trialing: 'bg-blue-100 text-blue-800',
  past_due: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  unpaid: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-600',
};

export default function BillingPage() {
  const companyId = 'current';
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, invRes] = await Promise.all([
        apiClient.get(`/billing/subscriptions/${companyId}/status`).catch(() => ({ data: null })),
        apiClient.get('/billing/invoices').catch(() => ({ data: { data: [] } })),
      ]);
      setSubscription(subRes.data);
      setInvoices(invRes.data.data || []);
    } catch (e) { console.error('Failed to load billing data', e); }
    finally { setLoading(false); }
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (action: string, endpoint: string) => {
    if (!confirm(`Are you sure you want to ${action}?`)) return;
    setActionLoading(action);
    try {
      await apiClient.post(endpoint);
      load();
    } catch (e) { console.error(`Failed to ${action}`, e); }
    finally { setActionLoading(''); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading billing info...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>

      {/* Subscription Status */}
      {subscription ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Subscription</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[subscription.status] || 'bg-gray-100 text-gray-600'}`}>
              {subscription.status.replace('_', ' ')}
            </span>
          </div>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><dt className="text-xs text-gray-500">Plan</dt><dd className="text-sm font-medium capitalize">{subscription.plan}</dd></div>
            {subscription.trialEndsAt && (
              <div><dt className="text-xs text-gray-500">Trial ends</dt><dd className="text-sm font-medium">{new Date(subscription.trialEndsAt).toLocaleDateString()}{subscription.trialDaysLeft != null ? ` (${subscription.trialDaysLeft}d left)` : ''}</dd></div>
            )}
            {subscription.currentPeriodEnd && (
              <div><dt className="text-xs text-gray-500">Period ends</dt><dd className="text-sm font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</dd></div>
            )}
          </dl>
          <div className="flex gap-2 mt-4">
            {subscription.status === 'active' && (
              <>
                <button
                  onClick={() => handleAction('upgrade plan', `/billing/subscriptions/${companyId}/upgrade`)}
                  disabled={actionLoading === 'upgrade plan'}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading === 'upgrade plan' ? 'Processing...' : 'Upgrade'}
                </button>
                <button
                  onClick={() => handleAction('cancel subscription', `/billing/subscriptions/${companyId}/cancel`)}
                  disabled={actionLoading === 'cancel subscription'}
                  className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {actionLoading === 'cancel subscription' ? 'Processing...' : 'Cancel Subscription'}
                </button>
              </>
            )}
            {subscription.status === 'trialing' && (
              <button
                onClick={() => handleAction('start subscription', `/billing/subscriptions/${companyId}/start-trial`)}
                disabled={actionLoading === 'start subscription'}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === 'start subscription' ? 'Processing...' : 'Start Full Subscription'}
              </button>
            )}
            {(!subscription.status || subscription.status === 'inactive' || subscription.status === 'expired') && (
              <button
                onClick={() => handleAction('start trial', `/billing/subscriptions/${companyId}/start-trial`)}
                disabled={actionLoading === 'start trial'}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === 'start trial' ? 'Processing...' : 'Start Trial'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">💳</div>
          <p className="text-gray-500 mb-4">No active subscription</p>
          <button
            onClick={() => handleAction('start trial', `/billing/subscriptions/${companyId}/start-trial`)}
            disabled={actionLoading === 'start trial'}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading === 'start trial' ? 'Processing...' : 'Start Trial'}
          </button>
        </div>
      )}

      {/* Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-gray-400 text-sm">No invoices yet</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.amount.toLocaleString()} {inv.currency}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
