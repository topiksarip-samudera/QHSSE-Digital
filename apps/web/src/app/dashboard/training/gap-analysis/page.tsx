'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

const GAP_STATUS: Record<string, string> = { critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-blue-100 text-blue-800', compliant: 'bg-green-100 text-green-800' };

export default function GapAnalysisPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  useEffect(() => { trainingApi.getGapAnalysis().then(r => { setData(r.data.data || r.data); }).catch(() => setError('Failed to load gap analysis')).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading gap analysis...</div>;
  if (error) return <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-500">{error}</p><button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button></div>;

  const gaps = Array.isArray(data?.gaps) ? data.gaps : Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Gap Analysis</h1><p className="text-gray-600 mt-1">Competency gaps between matrix requirements and assessments</p></div>

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"><p className="text-sm text-red-600 font-medium">Critical</p><p className="text-2xl font-bold text-red-700">{data.criticalCount ?? data.critical ?? 0}</p></div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center"><p className="text-sm text-orange-600 font-medium">High</p><p className="text-2xl font-bold text-orange-700">{data.highCount ?? data.high ?? 0}</p></div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center"><p className="text-sm text-yellow-600 font-medium">Medium</p><p className="text-2xl font-bold text-yellow-700">{data.mediumCount ?? data.medium ?? 0}</p></div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"><p className="text-sm text-green-600 font-medium">Compliant</p><p className="text-2xl font-bold text-green-700">{data.compliantCount ?? data.compliant ?? 0}</p></div>
        </div>
      )}

      {gaps.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No gaps found</p><p className="text-sm text-gray-400 mt-1">All competencies are aligned with matrix requirements.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competency</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position/Role</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Level</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessed Level</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gap</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {gaps.map((g: any, i: number) => (
                <tr key={g.id || i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.competency || g.competencyName || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{g.role || g.position || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{g.requiredLevel ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{g.assessedLevel ?? '-'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{g.gap != null ? g.gap : g.missing ? 'Missing' : '-'}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${GAP_STATUS[g.status] || GAP_STATUS[g.severity] || 'bg-gray-100 text-gray-800'}`}>{g.status || g.severity || '-'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
