'use client'; import { useState, useEffect } from 'react'; import { subscriptionApi } from '@/lib/api';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, u, i] = await Promise.all([subscriptionApi.getPlans().catch(()=>({data:{}})), subscriptionApi.getUsage().catch(()=>({data:{}})), subscriptionApi.getInvoices().catch(()=>({data:[]})) ]);
        setPlans(p.data.data || []); setUsage(u.data); setInvoices(i.data || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>

      {usage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Plan</p><p className="text-lg font-bold">{usage.plan || '-'}</p><p className="text-xs text-gray-400">{usage.status}</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Users</p><p className="text-lg font-bold">{usage.usage?.users || 0} / {usage.limits?.maxUsers || '∞'}</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Sites</p><p className="text-lg font-bold">{usage.usage?.sites || 0} / {usage.limits?.maxSites || '∞'}</p></div>
          <div className="bg-white rounded-lg shadow p-4"><p className="text-xs text-gray-500">Storage</p><p className="text-lg font-bold">{((usage.usage?.storageMb || 0) / 1024).toFixed(1)} GB / {usage.limits?.maxStorage || '∞'}</p></div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Plans ({plans.length})</h2>
        {loading ? <p className="text-sm text-gray-400">Loading...</p> : (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((p: any) => (
              <div key={p.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-2xl font-bold mt-1">${p.price}<span className="text-sm font-normal text-gray-500">/{p.interval}</span></p>
                <p className="text-xs text-gray-400 mt-1">{p.description || ''}</p>
                <ul className="mt-3 space-y-1">
                  {p.features?.map((f: any) => (<li key={f.id} className="text-xs text-gray-600">✓ {f.name}</li>))}
                </ul>
                <p className="text-xs text-gray-400 mt-2">{p._count?.subscriptions || 0} subscribers</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {invoices.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Invoices</h2>
          <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Number</th><th className="text-left py-2">Amount</th><th className="text-left py-2">Status</th><th className="text-left py-2">Due</th></tr></thead><tbody>{invoices.map((i: any) => (<tr key={i.id}><td className="py-1 font-mono text-xs">{i.number}</td><td className="py-1">${i.amount}</td><td className="py-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${i.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span></td><td className="py-1 text-xs text-gray-400">{new Date(i.dueDate).toLocaleDateString()}</td></tr>))}</tbody></table>
        </div>
      )}
    </div>
  );
}
