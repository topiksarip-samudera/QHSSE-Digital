'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function MfaSettingsPage() {
  const [requireMfa, setRequireMfa] = useState(true);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">MFA Settings</h1>
      <p className="text-gray-600">Multi-Factor Authentication configuration</p>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={requireMfa} onChange={(e) => setRequireMfa(e.target.checked)} className="rounded text-blue-600" /><div><p className="text-sm font-medium">Require MFA for all users</p><p className="text-xs text-gray-500">Force all users to set up MFA on next login</p></div></label>
        <div>
          <h2 className="text-lg font-semibold mb-3">Allowed Methods</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked readOnly className="rounded" />TOTP (Authenticator App)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled className="rounded" />Email OTP (Coming soon)</label>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Recovery</h2>
          <p className="text-sm text-gray-500">Each user receives 8 one-time recovery codes during MFA setup. Admins can reset MFA for locked-out users.</p>
        </div>
        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved ? '✓ Saved' : 'Save Settings'}</button></div>
      </div>
    </div>
  );
}
