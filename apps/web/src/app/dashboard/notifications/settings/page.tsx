'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationApi, NotificationPreferenceData } from '@/lib/api';
import Link from 'next/link';

const MODULES = [
  { code: 'incident-basic', label: 'Incident Management' },
  { code: 'hazard-basic', label: 'Hazard Management' },
  { code: 'risk-basic', label: 'Risk Management' },
  { code: 'action-basic', label: 'Action Tracking' },
  { code: 'audit-basic', label: 'Audit Management' },
  { code: 'compliance-basic', label: 'Compliance' },
  { code: 'workflow-basic', label: 'Workflow Engine' },
];

const EVENT_TYPES = [
  { code: 'created', label: 'Record Created' },
  { code: 'updated', label: 'Record Updated' },
  { code: 'assigned', label: 'Assigned to Me' },
  { code: 'overdue', label: 'Overdue / SLA Breach' },
  { code: 'approved', label: 'Approved' },
  { code: 'rejected', label: 'Rejected' },
  { code: 'reminder', label: 'Reminder' },
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getPreferences();
      setPreferences(res.data.data || []);
    } catch (e) {
      console.error('Failed to load preferences', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getPref = (moduleCode: string, eventType: string) => {
    return preferences.find((p) => p.moduleCode === moduleCode && p.eventType === eventType);
  };

  const handleToggle = async (moduleCode: string, eventType: string, field: 'inAppEnabled' | 'emailEnabled') => {
    setSaving(true);
    const current = getPref(moduleCode, eventType);
    const currentVal = current ? current[field] : true;
    try {
      await notificationApi.updatePreference(moduleCode, eventType, {
        [field]: !currentVal,
      });
      await load();
    } catch (e) {
      console.error('Failed to update preference', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/notifications" className="text-sm text-primary hover:underline mb-1 inline-block">
          ← Back to Notifications
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-sm text-muted-foreground/80 mt-1">
          Choose which notifications you want to receive and how.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground/60">Loading settings...</div>
      ) : (
        <div className="space-y-6">
          {MODULES.map((mod) => (
            <div key={mod.code} className="bg-card border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <h2 className="text-sm font-semibold text-foreground">{mod.label}</h2>
                <p className="text-xs text-muted-foreground/80">{mod.code}</p>
              </div>
              <div className="divide-y">
                {EVENT_TYPES.map((evt) => {
                  const pref = getPref(mod.code, evt.code);
                  const inApp = pref ? pref.inAppEnabled : true;
                  const email = pref ? pref.emailEnabled : true;
                  return (
                    <div key={evt.code} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground/80">{evt.label}</p>
                        <p className="text-xs text-muted-foreground/60">{evt.code}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={inApp}
                            disabled={saving}
                            onChange={() => handleToggle(mod.code, evt.code, 'inAppEnabled')}
                            className="rounded"
                          />
                          In-App
                        </label>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={email}
                            disabled={saving}
                            onChange={() => handleToggle(mod.code, evt.code, 'emailEnabled')}
                            className="rounded"
                          />
                          Email
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
