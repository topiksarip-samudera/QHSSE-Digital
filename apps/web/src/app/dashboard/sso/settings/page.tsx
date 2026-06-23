'use client'; import { useState } from 'react'; import Link from 'next/link';

export default function SsoSettingsPage() {
  const [domainRestriction, setDomainRestriction] = useState('');
  const [autoProvision, setAutoProvision] = useState(true);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/sso" className="hover:text-blue-600">SSO</Link><span>/</span><span className="text-gray-900">Settings</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">SSO Settings</h1></div><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div><label className="block text-sm font-medium mb-1">Domain Restriction</label><input type="text" value={domainRestriction} onChange={(e) => setDomainRestriction(e.target.value)} placeholder="e.g. @company.com" className="w-full px-3 py-2 border rounded-lg text-sm" /><p className="text-xs text-gray-400 mt-1">Only allow SSO login from these email domains</p></div>
        <label className="flex items-center gap-3"><input type="checkbox" checked={autoProvision} onChange={(e) => setAutoProvision(e.target.checked)} className="rounded text-blue-600" /><div><p className="text-sm font-medium">Auto-provision users</p><p className="text-xs text-gray-500">Automatically create user accounts on first SSO login</p></div></label>
      </div>
    </div>
  );
}
