'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuditLogSettingsPage() {
  const [retentionDays, setRetentionDays] = useState(90);
  const [logSensitiveData, setLogSensitiveData] = useState(true);
  const [logOldValues, setLogOldValues] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/audit-log" className="hover:text-blue-600">Audit Log</Link>
        <span>/</span>
        <span className="text-gray-900">Settings</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log Settings</h1>
          <p className="text-gray-600 mt-1">Configure audit log behavior and retention</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      {/* Retention */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Retention Period</h2>
        <p className="text-sm text-gray-500 mb-3">Auto-delete audit logs older than the specified period</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={7}
            max={365}
            step={7}
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-20 text-right">{retentionDays} days</span>
        </div>
      </div>

      {/* What to log */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Logged Events</h2>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Data Changes</h3>
          {[
            { key: 'create', label: 'Create operations', enabled: true },
            { key: 'update', label: 'Update operations', enabled: true },
            { key: 'delete', label: 'Delete/Archive operations', enabled: true },
            { key: 'restore', label: 'Restore operations', enabled: true },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={item.enabled} readOnly className="rounded text-blue-600" />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Access Events</h3>
          {[
            { key: 'login', label: 'Login / Logout', enabled: true },
            { key: 'view_sensitive', label: 'View sensitive data', enabled: true },
            { key: 'download', label: 'File downloads', enabled: true },
            { key: 'export', label: 'Data exports', enabled: true },
            { key: 'admin_override', label: 'Admin overrides', enabled: true },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={item.enabled} readOnly className="rounded text-blue-600" />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Configuration Changes</h3>
          {[
            { key: 'settings', label: 'Settings changes', enabled: true },
            { key: 'permission', label: 'Permission changes', enabled: true },
            { key: 'workflow', label: 'Workflow changes', enabled: true },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={item.enabled} readOnly className="rounded text-blue-600" />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Advanced</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={logOldValues}
            onChange={(e) => setLogOldValues(e.target.checked)}
            className="rounded text-blue-600"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Capture old value on update</p>
            <p className="text-xs text-gray-500">Stores a snapshot of data before each update operation</p>
          </div>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={logSensitiveData}
            onChange={(e) => setLogSensitiveData(e.target.checked)}
            className="rounded text-blue-600"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Log sensitive data views</p>
            <p className="text-xs text-gray-500">Records when users access sensitive information</p>
          </div>
        </label>
      </div>
    </div>
  );
}
