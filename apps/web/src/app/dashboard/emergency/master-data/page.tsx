'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencyMasterDataPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    apiClient.get('/emergency/master-data').then(r => setGroups(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const r = await apiClient.post('/emergency/master-data/seed-defaults');
      alert(`Seeded ${r.data.seeded} items in ${r.data.groups} groups`);
      const g = await apiClient.get('/emergency/master-data');
      setGroups(g.data || []);
    } catch { alert('Failed to seed'); }
    finally { setSeeding(false); }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading master data...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Master Data</h1>
        <button onClick={handleSeed} disabled={seeding} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {seeding ? 'Seeding...' : 'Seed Defaults'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group: any) => (
          <div key={group.id} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">{group.name}</h3>
            <ul className="space-y-1">
              {group.items?.map((item: any) => (
                <li key={item.id} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                  {item.name}
                </li>
              ))}
              {(!group.items || group.items.length === 0) && <li className="text-sm text-muted-foreground italic">No items</li>}
            </ul>
          </div>
        ))}
        {groups.length === 0 && <p className="text-muted-foreground col-span-full">No master data groups. Click &quot;Seed Defaults&quot; to initialize.</p>}
      </div>
    </div>
  );
}
