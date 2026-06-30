'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

export default function AssetQrPage() {
  const [assets, setAssets] = useState<any[]>([]); const [loadingAssets, setLoadingAssets] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(''); const [qrData, setQrData] = useState<any>(null); const [qrLoading, setQrLoading] = useState(false);
  const [qrCode, setQrCode] = useState(''); const [verifyResult, setVerifyResult] = useState<any>(null); const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => { (async () => { try { const r = await assetApi.getAssets({ limit:200 }); setAssets(r.data.data.data||r.data.data||[]); } catch(e){} finally { setLoadingAssets(false); } })(); }, []);

  const generateQr = async () => { if (!selectedAsset) return; setQrLoading(true); try { const r = await assetApi.generateQr(selectedAsset); setQrData(r.data.data||r.data); } catch(e:any){ alert(e.response?.data?.message||'Error generating QR'); } finally { setQrLoading(false); } };

  const verifyQrCode = async () => { if (!qrCode.trim()) return; setVerifyLoading(true); try { const r = await assetApi.verifyQr(qrCode.trim()); setVerifyResult(r.data.data||r.data); } catch(e:any){ setVerifyResult({ error: e.response?.data?.message||'Verification failed' }); } finally { setVerifyLoading(false); } };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">QR Asset Management</h1><p className="text-gray-600 mt-1">Generate and verify asset QR codes</p></div>

      {/* Generate QR */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate QR Code</h2>
        {loadingAssets?<div className="text-sm text-gray-500">Loading assets...</div>:assets.length===0?<div className="text-sm text-gray-500">No assets available.</div>:(
          <div className="flex gap-3 items-end"><div className="flex-1"><label className="block text-sm font-medium mb-1">Select Asset</label><select value={selectedAsset} onChange={(e)=>setSelectedAsset(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">-- Choose asset --</option>{assets.map((a:any)=>(<option key={a.id} value={a.id}>{a.assetNumber} - {a.name}</option>))}</select></div><button onClick={generateQr} disabled={!selectedAsset||qrLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">{qrLoading?'Generating...':'Generate QR'}</button></div>
        )}
        {qrData && <div className="mt-4 p-4 bg-gray-50 rounded-lg"><pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-60">{JSON.stringify(qrData, null, 2)}</pre></div>}
      </div>

      {/* Verify QR */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verify QR Code</h2>
        <div className="flex gap-3 items-end"><div className="flex-1"><label className="block text-sm font-medium mb-1">QR Code / Asset Code</label><input type="text" value={qrCode} onChange={(e)=>setQrCode(e.target.value)} placeholder="Enter QR code..." className="w-full px-3 py-2 border rounded-lg" onKeyDown={(e)=>{ if(e.key==='Enter') verifyQrCode(); }} /></div><button onClick={verifyQrCode} disabled={!qrCode.trim()||verifyLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50">{verifyLoading?'Verifying...':'Verify'}</button></div>
        {verifyResult && <div className="mt-4 p-4 rounded-lg" style={{backgroundColor:verifyResult.error?'#fef2f2':'#f0fdf4'}}><pre className={`text-xs whitespace-pre-wrap overflow-auto max-h-60 ${verifyResult.error?'text-red-700':'text-green-700'}`}>{JSON.stringify(verifyResult, null, 2)}</pre></div>}
      </div>
    </div>
  );
}
