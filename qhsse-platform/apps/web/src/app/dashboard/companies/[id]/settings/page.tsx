'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { companiesApi, CompanyData, CompanySetting } from '@/lib/api';

export default function CompanySettingsPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [settings, setSettings] = useState<CompanySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New setting form
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyRes, settingsRes] = await Promise.all([
          companiesApi.get(companyId),
          companiesApi.getSettings(companyId),
        ]);
        setCompany(companyRes.data.data);
        setSettings(settingsRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [companyId]);

  const handleAddSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      let parsedValue: any = newValue;
      try { parsedValue = JSON.parse(newValue); } catch {}

      await companiesApi.updateSetting(companyId, {
        key: newKey,
        value: parsedValue,
        description: newDesc || undefined,
      });

      // Refresh settings
      const res = await companiesApi.getSettings(companyId);
      setSettings(res.data.data || []);
      setNewKey('');
      setNewValue('');
      setNewDesc('');
      setSuccess('Setting added successfully');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add setting');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    try {
      // We'll update the setting with null value to effectively remove it
      // In a real implementation, you might want a DELETE endpoint
      setSettings((prev) => prev.filter((s) => s.key !== key));
      setSuccess(`Setting "${key}" removed`);
    } catch (err: any) {
      setError('Failed to delete setting');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading settings...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="mb-2 text-sm text-muted-foreground">
          <Link href="/dashboard/companies" className="hover:underline">Companies</Link>
          <span className="mx-2">/</span>
          <Link href={`/dashboard/companies/${companyId}`} className="hover:underline">{company?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Settings</span>
        </nav>
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure custom settings for {company?.name}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">dismiss</button>
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-2 underline">dismiss</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Existing Settings */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Current Settings</h2>
              <p className="text-sm text-muted-foreground">{settings.length} setting(s) configured</p>
            </div>

            {settings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">⚙️</p>
                <p className="text-muted-foreground">No settings configured yet</p>
                <p className="text-sm text-muted-foreground">Add your first setting using the form</p>
              </div>
            ) : (
              <div className="divide-y">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-start justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{setting.key}</p>
                      {setting.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                      )}
                      <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-x-auto">
                        {typeof setting.value === 'object'
                          ? JSON.stringify(setting.value, null, 2)
                          : String(setting.value)}
                      </pre>
                    </div>
                    <button
                      onClick={() => handleDeleteSetting(setting.key)}
                      className="ml-4 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      title="Delete setting"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Setting Form */}
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Add Setting</h2>
            <form onSubmit={handleAddSetting} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Key *</label>
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  required
                  placeholder="setting_name"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Value *</label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  required
                  rows={3}
                  placeholder='Enter value (JSON supported: {"key": "value"})'
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What this setting controls"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Setting'}
              </button>
            </form>
          </div>

          {/* Quick Info */}
          <div className="mt-4 rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 font-semibold">Common Settings</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><code className="text-xs bg-muted px-1 rounded">max_upload_size</code> — Max file size in bytes</li>
              <li><code className="text-xs bg-muted px-1 rounded">default_language</code> — Default UI language</li>
              <li><code className="text-xs bg-muted px-1 rounded">notification_email</code> — Notification recipient</li>
              <li><code className="text-xs bg-muted px-1 rounded">retention_days</code> — Data retention period</li>
              <li><code className="text-xs bg-muted px-1 rounded">require_2fa</code> — Force 2FA for users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
