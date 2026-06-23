'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalendarSettingsPage() {
  const [defaultReminder, setDefaultReminder] = useState(1440);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/calendar" className="hover:text-blue-600">Calendar</Link><span>/</span><span className="text-gray-900">Settings</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Calendar Settings</h1></div><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div><h2 className="text-lg font-semibold mb-3">Default Reminder</h2><div className="flex items-center gap-4"><input type="range" min={60} max={10080} step={60} value={defaultReminder} onChange={(e) => setDefaultReminder(Number(e.target.value))} className="flex-1" /><span className="text-sm font-medium w-32 text-right">{Math.round(defaultReminder / 60)}h {defaultReminder % 60}m</span></div></div>
        <div><h2 className="text-lg font-semibold mb-3">Schedule Types</h2><div className="grid grid-cols-2 gap-2 text-sm text-gray-600">{['Audit','Inspection','Training','Drill','Maintenance','Other'].map(t=><label key={t} className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded" />{t}</label>)}</div></div>
      </div>
    </div>
  );
}
