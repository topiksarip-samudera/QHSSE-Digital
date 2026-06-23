'use client'; import { useState, useEffect } from 'react'; import { incidentApi } from '@/lib/api';

const DEFAULT_MATRIX = [{ level: 'low', label: 'Low', color: '#22c55e', slaHours: 72 }, { level: 'medium', label: 'Medium', color: '#eab308', slaHours: 48 }, { level: 'high', label: 'High', color: '#f97316', slaHours: 24 }, { level: 'critical', label: 'Critical', color: '#ef4444', slaHours: 4 }];

export default function IncidentSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => { try { const r = await incidentApi.getSettings(); setSettings(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const handleSave = async () => { try { await incidentApi.updateSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Incident Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={settings?.requireWorkflow || false} onChange={(e) => setSettings({ ...settings, requireWorkflow: e.target.checked })} className="rounded text-blue-600" /><div><p className="text-sm font-medium">Require Workflow Approval</p><p className="text-xs text-gray-500">All incident reports must go through workflow review</p></div></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={settings?.requireAttachment || false} onChange={(e) => setSettings({ ...settings, requireAttachment: e.target.checked })} className="rounded text-blue-600" /><div><p className="text-sm font-medium">Require Attachment</p><p className="text-xs text-gray-500">Minimum one evidence attachment required per incident</p></div></label>
        <div><label className="block text-sm font-medium mb-1">Max Report Days</label><input type="number" value={settings?.maxReportDays || 30} onChange={(e) => setSettings({ ...settings, maxReportDays: Number(e.target.value) })} className="w-24 px-3 py-2 border rounded-lg text-sm" /></div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Severity Matrix</h2>
          <div className="space-y-2">{(settings?.severityMatrix || DEFAULT_MATRIX).map((s: any, i: number) => (<div key={i} className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-sm font-medium w-20">{s.label}</span><input type="number" value={s.slaHours} onChange={(e) => { const matrix = [...(settings?.severityMatrix || DEFAULT_MATRIX)]; matrix[i].slaHours = Number(e.target.value); setSettings({ ...settings, severityMatrix: matrix }); }} className="w-20 px-2 py-1 border rounded text-sm" /><span className="text-xs text-gray-400">hours SLA</span></div>))}</div>
        </div>

        <div className="flex gap-3 pt-4 border-t"><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">{saved ? '✓ Saved' : 'Save Settings'}</button></div>
      </div>
    </div>
  );
}
