'use client'; import { useState } from 'react'; import { trainingApi } from '@/lib/api';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [days, setDays] = useState(90);

  const reports = [
    { key: 'expiring', title: 'Expiring Certificates', desc: 'Certificates expiring within the selected days', icon: 'bg-amber-50 border-amber-200', iconBadge: 'text-amber-700' },
    { key: 'compliance', title: 'Compliance Report', desc: 'Overall training compliance across positions and matrices', icon: 'bg-indigo-50 border-indigo-200', iconBadge: 'text-indigo-700' },
    { key: 'attendance', title: 'Attendance Report', desc: 'Session attendance tracking and participation rates', icon: 'bg-emerald-50 border-emerald-200', iconBadge: 'text-emerald-700' },
  ];

  const fetchReport = async (key: string) => {
    setActiveReport(key); setLoading(true); setError(''); setReportData(null);
    try {
      let r;
      if (key === 'expiring') r = await trainingApi.getExpiringReport(days);
      else if (key === 'compliance') r = await trainingApi.getComplianceReport();
      else if (key === 'attendance') r = await trainingApi.getAttendanceReport();
      setReportData(r.data.data || r.data);
    } catch { setError('Failed to load report'); } finally { setLoading(false); }
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : '-';

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Training Reports</h1><p className="text-gray-600 mt-1">View and generate training & competency reports</p></div>

      {!activeReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <button key={r.key} onClick={() => fetchReport(r.key)} className={`border rounded-lg p-5 text-left hover:shadow-md transition-shadow ${r.icon}`}>
              <p className={`font-semibold text-lg ${r.iconBadge}`}>{r.title}</p>
              <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      )}

      {activeReport && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => { setActiveReport(null); setReportData(null); }} className="text-sm text-blue-600 hover:underline">&larr; Back to reports</button>
            {activeReport === 'expiring' && (
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-600">Days:</label>
                <select value={days} onChange={e => { setDays(Number(e.target.value)); fetchReport('expiring'); }} className="px-2 py-1 border rounded text-sm">
                  <option value={30}>30</option><option value={60}>60</option><option value={90}>90</option><option value={180}>180</option>
                </select>
              </div>
            )}
          </div>

          {loading ? <div className="text-center py-12 text-gray-500">Loading report...</div> : error ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-500">{error}</p><button onClick={() => fetchReport(activeReport)} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button></div> : reportData ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {activeReport === 'compliance' && reportData ? (
                <div className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Compliance Overview</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center"><p className="text-sm text-gray-500">Overall Rate</p><p className="text-2xl font-bold text-gray-900">{reportData.overallRate != null ? `${reportData.overallRate}%` : '-'}</p></div>
                    <div className="bg-green-50 rounded-lg p-4 text-center"><p className="text-sm text-green-600">Compliant</p><p className="text-2xl font-bold text-green-700">{reportData.compliant ?? '-'}</p></div>
                    <div className="bg-red-50 rounded-lg p-4 text-center"><p className="text-sm text-red-600">Non-Compliant</p><p className="text-2xl font-bold text-red-700">{reportData.nonCompliant ?? '-'}</p></div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center"><p className="text-sm text-blue-600">Total</p><p className="text-2xl font-bold text-blue-700">{reportData.total ?? '-'}</p></div>
                  </div>
                </div>
              ) : Array.isArray(reportData) ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {activeReport === 'expiring' && <><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holder</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th></>}
                      {activeReport === 'attendance' && <><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendee</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.map((item: any, i: number) => (
                      <tr key={item.id || i} className="hover:bg-gray-50">
                        {activeReport === 'expiring' && <><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name || item.certificateName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.holder || item.userName || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.issuedDate || item.issueDate)}</td><td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.expiryDate || item.expiresAt)}</td><td className="px-4 py-3 text-sm"><span className={`px-2 py-0.5 rounded text-xs font-medium ${item.daysLeft <= 30 ? 'bg-red-100 text-red-800' : item.daysLeft <= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{item.daysLeft ?? '-'}</span></td></>}
                        {activeReport === 'attendance' && <><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.sessionTitle || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{item.userName || item.attendee || '-'}</td><td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.date || item.attendanceDate)}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.status === 'present' ? 'bg-green-100 text-green-800' : item.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{item.status || '-'}</span></td></>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6"><p className="text-gray-500">Report data unavailable in table format.</p></div>
              )}
            </div>
          ) : !loading && !error && <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No report data available</p></div>}
        </div>
      )}
    </div>
  );
}
