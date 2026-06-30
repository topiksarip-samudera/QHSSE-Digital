'use client'; import { useState, useEffect, useCallback } from 'react'; import { environmentApi } from '@/lib/api';

const SCHEDULE_EMPTY = { name: '', frequency: '', parameter: '', location: '', responsibleId: '', startDate: '', endDate: '', description: '' };
const RESULT_EMPTY = { scheduleId: '', value: '', unit: '', measuredDate: '', notes: '' };

export default function MonitoringPage() {
  const [tab, setTab] = useState<'schedules' | 'results'>('schedules');
  // Schedules state
  const [schedules, setSchedules] = useState<any[]>([]); const [sLoading, setSLoading] = useState(true); const [sError, setSError] = useState('');
  const [sSearch, setSSearch] = useState(''); const [sPage, setSPage] = useState(1); const [sTotal, setSTotal] = useState(1);
  const [sForm, setSForm] = useState<any>({ ...SCHEDULE_EMPTY }); const [showSForm, setShowSForm] = useState(false); const [editSId, setEditSId] = useState<string | null>(null);
  // Results state
  const [results, setResults] = useState<any[]>([]); const [rLoading, setRLoading] = useState(true); const [rError, setRError] = useState('');
  const [rSearch, setRSearch] = useState(''); const [rPage, setRPage] = useState(1); const [rTotal, setRTotal] = useState(1);
  const [rForm, setRForm] = useState<any>({ ...RESULT_EMPTY }); const [showRForm, setShowRForm] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setSLoading(true); setSError('');
    try { const r = await environmentApi.getMonitoringSchedules({ page: sPage, limit: 20, search: sSearch || undefined }); setSchedules(r.data.data || []); setSTotal(r.data.meta?.totalPages || 1); } catch (e: any) { setSError(e?.response?.data?.message || e?.message || 'Failed to load schedules'); } finally { setSLoading(false); }
  }, [sPage, sSearch]);

  const fetchResults = useCallback(async () => {
    setRLoading(true); setRError('');
    try { const r = await environmentApi.getMonitoringResults({ page: rPage, limit: 20, search: rSearch || undefined }); setResults(r.data.data || []); setRTotal(r.data.meta?.totalPages || 1); } catch (e: any) { setRError(e?.response?.data?.message || e?.message || 'Failed to load results'); } finally { setRLoading(false); }
  }, [rPage, rSearch]);

  useEffect(() => { if (tab === 'schedules') fetchSchedules(); else fetchResults(); }, [tab, fetchSchedules, fetchResults]);

  const handleSSave = async (e: React.FormEvent) => { e.preventDefault(); try { if (editSId) { await environmentApi.updateMonitoringSchedule(editSId, sForm); } else { await environmentApi.createMonitoringSchedule(sForm); } setSForm({ ...SCHEDULE_EMPTY }); setShowSForm(false); setEditSId(null); fetchSchedules(); } catch (e) { console.error(e); } };
  const handleSEdit = (item: any) => { setSForm({ name: item.name || '', frequency: item.frequency || '', parameter: item.parameter || '', location: item.location || '', responsibleId: item.responsibleId || '', startDate: item.startDate ? item.startDate.slice(0, 10) : '', endDate: item.endDate ? item.endDate.slice(0, 10) : '', description: item.description || '' }); setEditSId(item.id); setShowSForm(true); };

  const handleRSave = async (e: React.FormEvent) => { e.preventDefault(); try { await environmentApi.createMonitoringResult(rForm); setRForm({ ...RESULT_EMPTY }); setShowRForm(false); fetchResults(); } catch (e) { console.error(e); } };

  const inp = "px-3 py-2 border rounded-lg text-sm w-full";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Environmental Monitoring</h1><p className="text-gray-600 mt-1">Manage monitoring schedules and results</p></div>
      <div className="flex gap-1 border-b">
        <button onClick={() => setTab('schedules')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === 'schedules' ? 'bg-white text-blue-600 border border-b-transparent -mb-px' : 'text-gray-600 hover:text-gray-900'}`}>Schedules</button>
        <button onClick={() => setTab('results')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === 'results' ? 'bg-white text-blue-600 border border-b-transparent -mb-px' : 'text-gray-600 hover:text-gray-900'}`}>Results</button>
      </div>

      {/* SCHEDULES TAB */}
      {tab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex gap-3 items-center"><input type="text" value={sSearch} onChange={(e) => { setSSearch(e.target.value); setSPage(1); }} placeholder="Search schedules..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div><button onClick={() => { setShowSForm(true); setEditSId(null); setSForm({ ...SCHEDULE_EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Add Schedule</button></div>
          {showSForm && (
            <form onSubmit={handleSSave} className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">{editSId ? 'Edit Schedule' : 'Add Schedule'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" required value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Frequency</label><input type="text" value={sForm.frequency} onChange={(e) => setSForm({ ...sForm, frequency: e.target.value })} placeholder="e.g. daily, weekly, monthly" className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Parameter</label><input type="text" value={sForm.parameter} onChange={(e) => setSForm({ ...sForm, parameter: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={sForm.location} onChange={(e) => setSForm({ ...sForm, location: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Responsible ID</label><input type="text" value={sForm.responsibleId} onChange={(e) => setSForm({ ...sForm, responsibleId: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={sForm.startDate} onChange={(e) => setSForm({ ...sForm, startDate: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" value={sForm.endDate} onChange={(e) => setSForm({ ...sForm, endDate: e.target.value })} className={inp} /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} className={inp} rows={2} /></div>
              </div>
              <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{editSId ? 'Update' : 'Create'}</button><button type="button" onClick={() => { setSForm({ ...SCHEDULE_EMPTY }); setShowSForm(false); setEditSId(null); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
            </form>
          )}
          {sLoading ? <div className="text-center py-12 text-gray-500">Loading...</div> : sError ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{sError}</p><button onClick={fetchSchedules} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div> : schedules.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No schedules found</p><button onClick={() => { setShowSForm(true); setEditSId(null); setSForm({ ...SCHEDULE_EMPTY }); }} className="text-blue-600 hover:underline text-sm mt-1">Create your first schedule</button></div> : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-200">{schedules.map((item: any) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.parameter || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.frequency || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.location || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm"><button onClick={() => handleSEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button></td></tr>))}</tbody>
              </table>
              {sTotal > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setSPage(p => Math.max(1, p - 1))} disabled={sPage === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {sPage} of {sTotal}</span><button onClick={() => setSPage(p => Math.min(sTotal, p + 1))} disabled={sPage === sTotal} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
            </div>
          )}
        </div>
      )}

      {/* RESULTS TAB */}
      {tab === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex gap-3 items-center"><input type="text" value={rSearch} onChange={(e) => { setRSearch(e.target.value); setRPage(1); }} placeholder="Search results..." className="px-3 py-2 border rounded-lg text-sm w-64" /></div><button onClick={() => { setShowRForm(true); setRForm({ ...RESULT_EMPTY }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ Record Result</button></div>
          {showRForm && (
            <form onSubmit={handleRSave} className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Record Monitoring Result</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Schedule ID</label><input type="text" required value={rForm.scheduleId} onChange={(e) => setRForm({ ...rForm, scheduleId: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Measured Date</label><input type="date" required value={rForm.measuredDate} onChange={(e) => setRForm({ ...rForm, measuredDate: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Value</label><input type="text" required value={rForm.value} onChange={(e) => setRForm({ ...rForm, value: e.target.value })} className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Unit</label><input type="text" value={rForm.unit} onChange={(e) => setRForm({ ...rForm, unit: e.target.value })} placeholder="e.g. mg/L, dB, pH" className={inp} /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea value={rForm.notes} onChange={(e) => setRForm({ ...rForm, notes: e.target.value })} className={inp} rows={2} /></div>
              </div>
              <div className="flex gap-2 pt-2 border-t"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Submit Result</button><button type="button" onClick={() => { setRForm({ ...RESULT_EMPTY }); setShowRForm(false); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
            </form>
          )}
          {rLoading ? <div className="text-center py-12 text-gray-500">Loading...</div> : rError ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-600 text-lg mb-3">{rError}</p><button onClick={fetchResults} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Retry</button></div> : results.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No results found</p><button onClick={() => { setShowRForm(true); setRForm({ ...RESULT_EMPTY }); }} className="text-blue-600 hover:underline text-sm mt-1">Record your first result</button></div> : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Measured Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th></tr></thead>
                <tbody className="divide-y divide-gray-200">{results.map((item: any) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.scheduleId || '-'}</td><td className="px-4 py-3 text-sm text-gray-900">{item.value != null ? item.value : '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.unit || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.measuredDate ? new Date(item.measuredDate).toLocaleDateString() : '-'}</td><td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{item.notes || '-'}</td></tr>))}</tbody>
              </table>
              {rTotal > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setRPage(p => Math.max(1, p - 1))} disabled={rPage === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {rPage} of {rTotal}</span><button onClick={() => setRPage(p => Math.min(rTotal, p + 1))} disabled={rPage === rTotal} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
