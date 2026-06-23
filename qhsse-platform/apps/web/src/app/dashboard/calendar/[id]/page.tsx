'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { calendarApi, ScheduleData } from '@/lib/api';
import Link from 'next/link';

export default function CalendarDetailPage() {
  const params = useParams(); const id = params.id as string;
  const [schedule, setSchedule] = useState<ScheduleData | null>(null); const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); try { const r = await calendarApi.getSchedule(id); setSchedule(r.data); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => { setGenLoading(true); try { await calendarApi.generateOccurrences(id); fetchData(); } catch (e) { console.error(e); } finally { setGenLoading(false); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!schedule) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/calendar" className="hover:text-blue-600">Calendar</Link><span>/</span><span className="text-gray-900">{schedule.name}</span></div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">{schedule.name}</h1><div className="flex items-center gap-2 mt-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{schedule.status}</span><span className="text-xs text-gray-400">{schedule.type}</span></div></div>
        <div className="flex gap-2">
          {schedule.recurrence && <button onClick={handleGenerate} disabled={genLoading} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">{genLoading ? '...' : 'Generate Occurrences'}</button>}
          <Link href={`/dashboard/calendar/${id}/edit`} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
        <div><dt className="text-sm text-gray-500">Start Date</dt><dd className="text-sm font-medium">{new Date(schedule.startDate).toLocaleDateString()}</dd></div>
        <div><dt className="text-sm text-gray-500">End Date</dt><dd className="text-sm">{schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : '-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Priority</dt><dd className="text-sm">{schedule.priority}</dd></div>
        <div><dt className="text-sm text-gray-500">Recurrence</dt><dd className="text-sm">{schedule.recurrence ? `${schedule.recurrence.frequency} every ${schedule.recurrence.interval}` : 'None'}</dd></div>
        <div className="col-span-2"><dt className="text-sm text-gray-500">Description</dt><dd className="text-sm mt-1">{schedule.description || '-'}</dd></div>
      </div>
      {schedule.reminders && schedule.reminders.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-2">Reminders</h2><ul className="space-y-1">{schedule.reminders.map((r: any) => (<li key={r.id} className="text-sm text-gray-600">{r.minutesBefore} minutes before</li>))}</ul></div>
      )}
      {schedule.occurrences && schedule.occurrences.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold mb-3">Occurrences ({schedule.occurrences.length})</h2><ul className="space-y-1">{schedule.occurrences.map((o: any) => (<li key={o.id} className="text-sm flex justify-between"><span>{new Date(o.dueDate).toLocaleDateString()}</span><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${o.status === 'active' ? 'bg-green-100' : o.status === 'closed' ? 'bg-gray-100' : 'bg-blue-100'}`}>{o.status}</span></li>))}</ul></div>
      )}
    </div>
  );
}
