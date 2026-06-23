'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function WebhookSettingsPage() {
  const [retryCount, setRetryCount] = useState(3); const [timeoutSec, setTimeoutSec] = useState(10);
  const [saved, setSaved] = useState(false); const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/webhooks" className="hover:text-blue-600">Webhooks</Link><span>/</span><span className="text-gray-900">Settings</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Webhook Settings</h1></div><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div><h2 className="text-lg font-semibold mb-3">Max Retries</h2><div className="flex items-center gap-4"><input type="range" min={1} max={10} value={retryCount} onChange={(e) => setRetryCount(Number(e.target.value))} className="flex-1" /><span className="text-sm font-medium w-12 text-right">{retryCount}</span></div></div>
        <div><h2 className="text-lg font-semibold mb-3">Timeout (seconds)</h2><div className="flex items-center gap-4"><input type="range" min={1} max={30} value={timeoutSec} onChange={(e) => setTimeoutSec(Number(e.target.value))} className="flex-1" /><span className="text-sm font-medium w-16 text-right">{timeoutSec}s</span></div></div>
      </div>
    </div>
  );
}
