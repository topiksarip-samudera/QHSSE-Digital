'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecurityMasterDataPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    securityApi.getMasterData().then(r => { setData(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSeed = async () => {
    await securityApi.seedDefaults();
    fetchData();
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Master Data</h1>
        <button onClick={handleSeed} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Seed Defaults</button>
      </div>
      {data.length === 0 ? (
        <p className="text-muted-foreground">No master data found. Click &ldquo;Seed Defaults&rdquo; to populate.</p>
      ) : (
        <div className="space-y-6">
          {data.map((group: any) => (
            <div key={group.id} className="border rounded-md p-4 bg-card">
              <h2 className="font-semibold text-lg mb-2">{group.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
              <div className="flex flex-wrap gap-2">
                {group.items?.map((item: any) => (
                  <span key={item.id} className="px-3 py-1 bg-muted rounded-full text-sm">{item.name}</span>
                )) || <span className="text-sm text-muted-foreground italic">No items</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
