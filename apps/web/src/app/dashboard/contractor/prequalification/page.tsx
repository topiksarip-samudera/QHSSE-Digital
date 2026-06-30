'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorPrequalificationPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [prequals, setPrequals] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchPrequals = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const q: any = { page, limit: 20 };
      if (riskFilter) q.riskLevel = riskFilter;
      const r = await contractorApi.getPrequalifications(selectedContractor, q);
      setPrequals(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchPrequals(); }, [selectedContractor, riskFilter]);

  const riskColors: Record<string, string> = { low: 'bg-green-200 text-green-700', medium: 'bg-yellow-200 text-yellow-700', high: 'bg-red-200 text-red-700' };
  const statusColors: Record<string, string> = { pending: 'bg-gray-200 text-gray-700', approved: 'bg-green-200 text-green-700', rejected: 'bg-red-200 text-red-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Prequalification</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
          <option value="">All Risk Levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const category = prompt('Category:'); if (!category) return;
          const riskLevel = prompt('Risk Level (low/medium/high):', 'medium');
          contractorApi.createPrequalification(selectedContractor, { category, riskLevel }).then(() => fetchPrequals());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + New Prequalification
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {prequals.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{p.category || 'General'}</div>
                <div className="text-sm text-muted-foreground">Score: {p.score || 'N/A'} | Expiry: {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${riskColors[p.riskLevel] || 'bg-gray-100'}`}>{p.riskLevel}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[p.status] || 'bg-gray-100'}`}>{p.status}</span>
                {p.status === 'pending' && (
                  <div className="flex gap-1">
                    <button onClick={() => {
                      const score = prompt('Score (0-100):', '80');
                      contractorApi.updatePrequalificationStatus(p.id, { status: 'approved', score: score ? parseInt(score) : 80 }).then(() => fetchPrequals());
                    }} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Approve</button>
                    <button onClick={() => contractorApi.updatePrequalificationStatus(p.id, { status: 'rejected' }).then(() => fetchPrequals())} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Reject</button>
                  </div>
                )}
                <button onClick={() => contractorApi.deletePrequalification(p.id).then(() => fetchPrequals())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {prequals.length === 0 && <div className="text-muted-foreground">No prequalifications found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
