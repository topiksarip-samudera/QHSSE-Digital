'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportRunsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/report-runs`, { headers: headers() })
      .then((r) => r.json())
      .then((data) => {
        setRuns(data?.data?.data || data?.data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Back to Reports</Link>
        <h1 className="text-2xl font-bold">Report Runs</h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : runs.length === 0 ? (
        <p className="text-gray-500">No report runs found.</p>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Format</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Triggered By</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Started</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">File Path</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      r.status === 'completed' ? 'bg-green-100 text-green-700' :
                      r.status === 'failed' ? 'bg-red-100 text-red-700' :
                      r.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{r.format?.toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm capitalize">{r.triggeredBy}</td>
                  <td className="px-4 py-3 text-sm">{r.startedAt ? new Date(r.startedAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">{r.filePath || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
