'use client'; import { useState, useEffect, useCallback } from 'react'; import { assetApi } from '@/lib/api';

const EXPORT_TYPES = [
  { key: 'asset-register', label: 'Asset Register', icon: '📋' },
  { key: 'certificates', label: 'Certificates', icon: '📜' },
  { key: 'inspections', label: 'Inspections', icon: '🔍' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'critical-equipment', label: 'Critical Equipment', icon: '⚠' },
];

export default function AssetReportsPage() {
  const [kpi, setKpi] = useState<any>(null); const [kpiLoading, setKpiLoading] = useState(true);
  const [exportResult, setExportResult] = useState<any>(null); const [exportType, setExportType] = useState(''); const [expLoading, setExpLoading] = useState(false);

  useEffect(() => { (async () => { try { const r = await assetApi.getKpi(); setKpi(r.data.data||r.data); } catch(e){} finally { setKpiLoading(false); } })(); }, []);

  const handleExport = async (type: string) => { setExpLoading(true); setExportType(type); setExportResult(null); try { const r = await assetApi.exportAssets(type); setExportResult(r.data); } catch(e:any){ setExportResult({ error: e.response?.data?.message||'Export failed' }); } finally { setExpLoading(false); } };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Asset Reports</h1><p className="text-gray-600 mt-1">Export asset data and view key performance indicators</p></div>

      {/* KPI Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Performance Indicators</h2>
        {kpiLoading?<div className="text-sm text-gray-500">Loading KPIs...</div>:!kpi?<div className="text-sm text-gray-500">No KPI data available.</div>:(
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(kpi).map(([key, value]:any)=>(<div key={key} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"><p className="text-xs text-gray-500 uppercase tracking-wide">{key.replace(/([A-Z])/g,' $1').trim()}</p><p className="text-2xl font-bold text-gray-900 mt-1">{typeof value==='number'?value.toLocaleString():String(value)}</p></div>))}
          </div>
        )}
      </div>

      {/* Export Buttons */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Export Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXPORT_TYPES.map((t)=>(
            <button key={t.key} onClick={()=>handleExport(t.key)} disabled={expLoading} className="px-4 py-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 transition-colors">
              <span className="mr-1">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export Result */}
      {expLoading && <div className="text-center py-4 text-sm text-gray-500">Exporting {exportType}...</div>}
      {exportResult && <div className="bg-white rounded-lg shadow p-4"><h3 className="text-sm font-semibold text-gray-900 mb-2">Export Result — {exportType}</h3><pre className={`text-xs whitespace-pre-wrap overflow-auto max-h-96 p-3 rounded ${exportResult.error?'bg-red-50 text-red-700':'bg-gray-50 text-gray-700'}`}>{JSON.stringify(exportResult, null, 2)}</pre></div>}
    </div>
  );
}
