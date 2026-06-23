'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { calendarApi, ScheduleData } from '@/lib/api';
import Link from 'next/link';

const TYPE_ICONS: Record<string, string> = { audit: '📋', inspection: '🔍', training: '🎓', drill: '🚨', maintenance: '🔧', other: '📌' };
const TYPE_COLORS: Record<string, string> = { audit: 'bg-blue-100 text-blue-800', inspection: 'bg-green-100 text-green-800', training: 'bg-purple-100 text-purple-800', drill: 'bg-orange-100 text-orange-800', maintenance: 'bg-gray-100 text-gray-800', other: 'bg-gray-100 text-gray-800' };

export default function CalendarListPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await calendarApi.getSchedules({ page, limit: 20, type: typeFilter || undefined }); setSchedules(r.data.data || []); setTotalPages(r.data.meta?.totalPages || 1); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [page, typeFilter]);
  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Calendar & Schedules</h1><p className="text-gray-600 mt-1">Manage recurring schedules for audits, inspections, training, and drills</p></div>
        <Link href="/dashboard/calendar/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Schedule</Link>
      </div>
      <div className="flex gap-3 items-center">
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Types</option><option value="audit">Audit</option><option value="inspection">Inspection</option><option value="training">Training</option><option value="drill">Drill</option><option value="maintenance">Maintenance</option>
        </select>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : schedules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No schedules</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recurrence</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occurrences</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/calendar/${s.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">{s.name}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[s.type] || ''}`}>{TYPE_ICONS[s.type]} {s.type}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{s.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(s.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.recurrence ? `${s.recurrence.frequency} (every ${s.recurrence.interval})` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.occurrences?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"><div className="flex gap-2"><button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button><span className="text-sm text-gray-600">Page {page} of {totalPages}</span><button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button></div></div>)}
        </div>
      )}
    </div>
  );
}
