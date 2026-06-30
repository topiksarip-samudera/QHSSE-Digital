'use client';

import { useState, useEffect } from 'react';
import { securityApi } from '@/lib/api';

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    securityApi.getSettings().then(r => { setSettings(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (key: string, value: any) => {
    await securityApi.updateSettings({ [key]: value });
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!settings) return <div className="p-6 text-destructive">Failed to load settings</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Security Settings</h1>
      <div className="space-y-4">
        {[
          { key: 'requireBadgeCheck', label: 'Require Badge Check', val: settings.requireBadgeCheck },
          { key: 'defaultPatrolFrequencyHrs', label: 'Default Patrol Frequency (Hours)', val: settings.defaultPatrolFrequencyHrs },
          { key: 'visitorExpiryHrs', label: 'Visitor Expiry (Hours)', val: settings.visitorExpiryHrs },
          { key: 'requireInvestigation', label: 'Require Investigation', val: settings.requireInvestigation },
          { key: 'autoEscalate', label: 'Auto Escalate', val: settings.autoEscalate },
        ].map(({ key, label, val }) => (
          <div key={key} className="flex items-center justify-between p-3 bg-card border rounded-md">
            <span className="font-medium">{label}</span>
            {typeof val === 'boolean' ? (
              <button onClick={() => handleUpdate(key, !val)} className={`px-3 py-1 rounded text-sm ${val ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {val ? 'Enabled' : 'Disabled'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input type="number" value={val} onChange={e => handleUpdate(key, parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
