'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ActionSettingsPage() {
  const [requireEvidence, setRequireEvidence] = useState(true);
  const [autoCloseDays, setAutoCloseDays] = useState(30);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/action-tracking" className="hover:text-blue-600">Action Tracking</Link>
        <span>/</span>
        <span className="text-gray-900">Settings</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action Tracking Settings</h1>
          <p className="text-gray-600 mt-1">Configure action workflow and defaults</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save Settings'}</button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Verification Rules</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={requireEvidence} onChange={(e) => setRequireEvidence(e.target.checked)} className="rounded text-blue-600" />
            <div><p className="text-sm font-medium text-gray-700">Require evidence before close</p><p className="text-xs text-gray-500">Actions must have at least one evidence attachment before verification</p></div>
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Auto-Close</h2>
          <div className="flex items-center gap-4">
            <input type="range" min={7} max={90} step={7} value={autoCloseDays} onChange={(e) => setAutoCloseDays(Number(e.target.value))} className="flex-1" />
            <span className="text-sm font-medium w-20 text-right">{autoCloseDays} days</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Auto-close verified actions after this period of inactivity</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={notifyOverdue} onChange={(e) => setNotifyOverdue(e.target.checked)} className="rounded text-blue-600" />
            <div><p className="text-sm font-medium text-gray-700">Notify on overdue</p><p className="text-xs text-gray-500">Send notifications when action passes its due date</p></div>
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Status Flow</h2>
          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
            <span className="px-2 py-1 bg-gray-100 rounded">Draft</span><span>→</span>
            <span className="px-2 py-1 bg-blue-100 rounded">Submitted</span><span>→</span>
            <span className="px-2 py-1 bg-yellow-100 rounded">In Review</span><span>→</span>
            <span className="px-2 py-1 bg-green-100 rounded">Verified/Closed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <span className="px-2 py-1 bg-red-100 rounded">Rejected</span><span>→ back to draft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
