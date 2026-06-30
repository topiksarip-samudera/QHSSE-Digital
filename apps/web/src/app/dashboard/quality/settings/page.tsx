'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';

export default function QualitySettingsPage() {
  const [settings, setSettings] = useState<any>(null); const [loading, setLoading] = useState(true);
  const [requireRca, setRequireRca] = useState(true); const [dueDays, setDueDays] = useState(14);
  const [requireDisp, setRequireDisp] = useState(true); const [requireCapaVerif, setRequireCapaVerif] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => { try { const r = await qualityApi.getSettings(); const d = r.data.data; setSettings(d); setRequireRca(d.requireRootCauseMajorNcr); setDueDays(d.defaultNcrDueDays); setRequireDisp(d.requireDisposition); setRequireCapaVerif(d.requireCapaVerification); } catch (e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const save = async () => { setSaving(true); try { await qualityApi.updateSettings({ requireRootCauseMajorNcr: requireRca, defaultNcrDueDays: dueDays, requireDisposition: requireDisp, requireCapaVerification: requireCapaVerif }); alert('Settings saved'); } catch (e: any) { alert(e.response?.data?.message || 'Error saving'); } finally { setSaving(false); } };

  const seed = async () => { try { const r = await qualityApi.seedDefaults(); alert(`Seeded ${r.data.data.seeded} items`); } catch (e: any) { alert(e.response?.data?.message || 'Error seeding'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Quality Management Settings</h1><p className="text-gray-600 mt-1">Configure quality management parameters</p></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Default NCR Due Days</label><input type="number" value={dueDays} onChange={(e)=>setDueDays(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={requireRca} onChange={(e)=>setRequireRca(e.target.checked)} id="rr" className="rounded" /><label htmlFor="rr" className="text-sm text-gray-700">Require Root Cause for Major NCR</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={requireDisp} onChange={(e)=>setRequireDisp(e.target.checked)} id="rd" className="rounded" /><label htmlFor="rd" className="text-sm text-gray-700">Require Disposition</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={requireCapaVerif} onChange={(e)=>setRequireCapaVerif(e.target.checked)} id="rcv" className="rounded" /><label htmlFor="rcv" className="text-sm text-gray-700">Require CAPA Verification</label></div>
        <div className="flex gap-3"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">{saving?'Saving...':'Save Settings'}</button><button onClick={seed} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Seed Master Data</button></div>
      </div>
    </div>
  );
}
