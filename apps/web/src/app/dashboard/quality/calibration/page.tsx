'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const resultColors: Record<string,string> = { pass:'bg-green-100 text-green-800', fail:'bg-red-100 text-red-800' };

export default function CalibrationPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ equipmentName:'', calibrationDate:'', calibrationDue:'', result:'pass' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getCalibrations(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createCalibration({...form, calibrationDate: form.calibrationDate||new Date().toISOString(), calibrationDue: form.calibrationDue||new Date().toISOString()}); setShowForm(false); setForm({ equipmentName:'', calibrationDate:'', calibrationDue:'', result:'pass' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Calibration Equipment</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Equipment'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Equipment Name</label><input value={form.equipmentName} onChange={e=>setForm({...form,equipmentName:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Calibration Date</label><input type="datetime-local" value={form.calibrationDate} onChange={e=>setForm({...form,calibrationDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Calibration Due</label><input type="datetime-local" value={form.calibrationDue} onChange={e=>setForm({...form,calibrationDue:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Result</label><select value={form.result} onChange={e=>setForm({...form,result:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="pass">Pass</option><option value="fail">Fail</option></select></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Equipment</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Serial</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Calibrated</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Due</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Result</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.equipmentName}</td><td className="px-4 py-3 text-sm text-gray-500">{d.serialNumber||'-'}</td><td className="px-4 py-3 text-sm">{new Date(d.calibrationDate).toLocaleDateString()}</td><td className="px-4 py-3 text-sm">{new Date(d.calibrationDue).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${resultColors[d.result]||''}`}>{d.result}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
