'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function EmergencySettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get('/emergency/settings').then(r => setSettings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/emergency/settings', settings);
      alert('Settings saved');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading settings...</div>;
  if (!settings) return <div className="p-8">Failed to load settings.</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Emergency Settings</h1>
      <div className="max-w-2xl space-y-4">
        <LabeledSwitch label="Enable Crisis Notification" checked={settings.enableCrisisNotification} onChange={v => setSettings({ ...settings, enableCrisisNotification: v })} />
        <LabeledInput label="Default Escalation (minutes)" type="number" value={settings.defaultEscalationMinutes} onChange={v => setSettings({ ...settings, defaultEscalationMinutes: Number(v) })} />
        <LabeledInput label="Drill Reminder (days before)" type="number" value={settings.drillReminderDays} onChange={v => setSettings({ ...settings, drillReminderDays: Number(v) })} />
        <LabeledInput label="Equipment Inspection (days)" type="number" value={settings.equipmentInspectionDays} onChange={v => setSettings({ ...settings, equipmentInspectionDays: Number(v) })} />
        <LabeledInput label="Plan Review (months)" type="number" value={settings.planReviewMonths} onChange={v => setSettings({ ...settings, planReviewMonths: Number(v) })} />
        <LabeledSwitch label="Auto Score Calculation" checked={settings.autoScoreCalculation} onChange={v => setSettings({ ...settings, autoScoreCalculation: v })} />
        <button onClick={handleSave} disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function LabeledInput({ label, type = 'text', value, onChange }: { label: string; type?: string; value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm bg-background" />
    </div>
  );
}

function LabeledSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
