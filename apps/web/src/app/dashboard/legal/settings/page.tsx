'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

export default function LegalSettingsPage() {
  const [settings, setSettings] = useState<any>(null); const [loading, setLoading] = useState(true);
  const [dueDays, setDueDays] = useState(90); const [reqEvidence, setReqEvidence] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true); const [escalationDays, setEscalationDays] = useState(14);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => { try { const r = await legalApi.getSettings(); const d = r.data.data; setSettings(d); setDueDays(d.defaultComplianceDueDays); setReqEvidence(d.requireEvidence); setAutoEscalate(d.autoEscalateOverdue); setEscalationDays(d.escalationDays); } catch (e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const save = async () => { setSaving(true); try { await legalApi.updateSettings({ defaultComplianceDueDays: dueDays, requireEvidence: reqEvidence, autoEscalateOverdue: autoEscalate, escalationDays }); alert('Settings saved'); } catch (e: any) { alert(e.response?.data?.message || 'Error saving'); } finally { setSaving(false); } };

  const seed = async () => { try { const r = await legalApi.seedDefaults(); alert(`Seeded ${r.data.data.seeded} items`); } catch (e: any) { alert(e.response?.data?.message || 'Error seeding'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Legal Compliance Settings</h1><p className="text-gray-600 mt-1">Configure compliance parameters</p></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Compliance Due Days</label><input type="number" value={dueDays} onChange={(e)=>setDueDays(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={reqEvidence} onChange={(e)=>setReqEvidence(e.target.checked)} id="re" className="rounded" /><label htmlFor="re" className="text-sm text-gray-700">Require Evidence for Compliance</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={autoEscalate} onChange={(e)=>setAutoEscalate(e.target.checked)} id="ae" className="rounded" /><label htmlFor="ae" className="text-sm text-gray-700">Auto-Escalate Overdue Obligations</label></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Escalation Days (after due)</label><input type="number" value={escalationDays} onChange={(e)=>setEscalationDays(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="flex gap-3"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">{saving?'Saving...':'Save Settings'}</button><button onClick={seed} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Seed Master Data</button></div>
      </div>
    </div>
  );
}
