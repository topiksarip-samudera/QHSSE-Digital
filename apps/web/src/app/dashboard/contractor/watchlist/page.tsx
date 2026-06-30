'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorWatchlistPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchWatchlists = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getWatchlists(selectedContractor, { page, limit: 20 });
      setWatchlists(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchWatchlists(); }, [selectedContractor]);

  const statusColors: Record<string, string> = { active: 'bg-red-200 text-red-700', cleared: 'bg-green-200 text-green-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Watchlist</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const reason = prompt('Watchlist reason:'); if (!reason) return;
          contractorApi.createWatchlist(selectedContractor, { reason }).then(() => fetchWatchlists());
        }} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
          + Add to Watchlist
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {watchlists.map((w: any) => (
            <div key={w.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{w.reason}</div>
                <div className="text-sm text-muted-foreground">Added: {new Date(w.addedAt).toLocaleDateString()} | Review: {w.reviewDate ? new Date(w.reviewDate).toLocaleDateString() : 'N/A'}</div>
                {w.remarks && <div className="text-sm italic mt-1">{w.remarks}</div>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[w.status] || 'bg-gray-100'}`}>{w.status}</span>
                {w.status === 'active' && (
                  <button onClick={() => contractorApi.clearWatchlist(w.id).then(() => fetchWatchlists())} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Clear</button>
                )}
                <button onClick={() => contractorApi.deleteWatchlist(w.id).then(() => fetchWatchlists())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {watchlists.length === 0 && <div className="text-muted-foreground">No watchlist entries. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
