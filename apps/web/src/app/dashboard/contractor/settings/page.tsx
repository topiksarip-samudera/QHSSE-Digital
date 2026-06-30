'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getSettings().then(r => { setSettings(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (key: string, value: any) => {
    await contractorApi.updateSettings({ [key]: value });
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!settings) return <div className="p-6 text-destructive">Failed to load settings</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Contractor Management Settings</h1>
      <div className="space-y-4">
        {[
          { key: 'requirePrequalification', label: 'Require Prequalification', val: settings.requirePrequalification },
          { key: 'autoFlagHighRisk', label: 'Auto Flag High Risk', val: settings.autoFlagHighRisk },
          { key: 'defaultRatingPeriodMonths', label: 'Default Rating Period (Months)', val: settings.defaultRatingPeriodMonths },
          { key: 'maxActiveWorkers', label: 'Max Active Workers', val: settings.maxActiveWorkers },
          { key: 'documentRenewalDays', label: 'Document Renewal Reminder (Days)', val: settings.documentRenewalDays },
        ].map(({ key, label, val }) => (
          <div key={key} className="flex items-center justify-between p-3 bg-card border rounded-md">
            <span className="font-medium">{label}</span>
            {typeof val === 'boolean' ? (
              <button onClick={() => handleUpdate(key, !val)} className={`px-3 py-1 rounded text-sm ${val ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {val ? 'Enabled' : 'Disabled'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input type="number" value={val} onChange={e => handleUpdate(key, parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 border rounded text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
