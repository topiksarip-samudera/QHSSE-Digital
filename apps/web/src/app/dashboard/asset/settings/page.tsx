'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetSettingsPage() {
  const [settings, setSettings] = useState<any>(null); const [loading, setLoading] = useState(true);
  const [enableCriticality, setEnableCriticality] = useState(true); const [enableCertExpiry, setEnableCertExpiry] = useState(true);
  const [inspFreq, setInspFreq] = useState('monthly'); const [maintFreq, setMaintFreq] = useState('monthly');
  const [enableQr, setEnableQr] = useState(true); const [enableLoto, setEnableLoto] = useState(true);
  const [requireTransApproval, setRequireTransApproval] = useState(true);
  const [requireDispApproval, setRequireDispApproval] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => { try { const r = await assetApi.getSettings(); const d = r.data.data; setSettings(d); setEnableCriticality(d.enableCriticality); setEnableCertExpiry(d.enableCertificateExpiry); setInspFreq(d.defaultInspectionFreq); setMaintFreq(d.defaultMaintenanceFreq); setEnableQr(d.enableQrCode); setEnableLoto(d.enableLoto); setRequireTransApproval(d.requireTransferApproval); setRequireDispApproval(d.requireDisposalApproval); } catch (e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const save = async () => { setSaving(true); try { await assetApi.updateSettings({ enableCriticality, enableCertificateExpiry: enableCertExpiry, defaultInspectionFreq: inspFreq, defaultMaintenanceFreq: maintFreq, enableQrCode: enableQr, enableLoto, requireTransferApproval: requireTransApproval, requireDisposalApproval: requireDispApproval }); alert('Settings saved'); } catch (e: any) { alert(e.response?.data?.message || 'Error saving'); } finally { setSaving(false); } };
  const seed = async () => { try { const r = await assetApi.seedDefaults(); alert(`Seeded ${r.data.data.seeded} items`); } catch (e: any) { alert(e.response?.data?.message || 'Error seeding'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Asset & Equipment Settings</h1><p className="text-gray-600 mt-1">Configure asset management parameters</p></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Inspection Frequency</label><select value={inspFreq} onChange={(e)=>setInspFreq(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Maintenance Frequency</label><select value={maintFreq} onChange={(e)=>setMaintFreq(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option></select></div>
        </div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={enableCriticality} onChange={(e)=>setEnableCriticality(e.target.checked)} id="ec" className="rounded" /><label htmlFor="ec" className="text-sm text-gray-700">Enable Criticality Classification</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={enableCertExpiry} onChange={(e)=>setEnableCertExpiry(e.target.checked)} id="ece" className="rounded" /><label htmlFor="ece" className="text-sm text-gray-700">Enable Certificate Expiry Management</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={enableQr} onChange={(e)=>setEnableQr(e.target.checked)} id="eqr" className="rounded" /><label htmlFor="eqr" className="text-sm text-gray-700">Enable QR Code Generation</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={enableLoto} onChange={(e)=>setEnableLoto(e.target.checked)} id="el" className="rounded" /><label htmlFor="el" className="text-sm text-gray-700">Enable LOTO Management</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={requireTransApproval} onChange={(e)=>setRequireTransApproval(e.target.checked)} id="rta" className="rounded" /><label htmlFor="rta" className="text-sm text-gray-700">Require Transfer Approval</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={requireDispApproval} onChange={(e)=>setRequireDispApproval(e.target.checked)} id="rda" className="rounded" /><label htmlFor="rda" className="text-sm text-gray-700">Require Disposal Approval</label></div>
        <div className="flex gap-3"><button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">{saving?'Saving...':'Save Settings'}</button><button onClick={seed} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Seed Master Data</button></div>
      </div>
    </div>
  );
}
