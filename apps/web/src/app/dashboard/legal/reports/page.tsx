'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

export default function LegalReportsPage() {
  const [score, setScore] = useState<any>(null); const [gaps, setGaps] = useState<any[]>([]);
  const [audit, setAudit] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [s, g, a] = await Promise.all([legalApi.getComplianceScore(), legalApi.getGapReport(), legalApi.getAuditReadiness()]);
      setScore(s.data.data||{}); setGaps(g.data.data||[]); setAudit(a.data.data||{});
      setError('');
    } catch(e:any){ setError(e.response?.data?.message||'Failed to load reports'); }
    finally { setLoading(false); }
  }, []);
  useEffect(()=>{fetchAll()},[fetchAll]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading reports...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}<button onClick={fetchAll} className="ml-3 text-sm text-blue-600 underline">Retry</button></div>;

  const scorePercent = score?.overallScore!==undefined ? score.overallScore : score?.score ?? 0;
  const scoreColor = scorePercent>=80 ? 'text-green-600' : scorePercent>=50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Legal Reports</h1>

      {/* Compliance Score Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Compliance Score</h2>
        {!score ? <p className="text-gray-400 text-sm">No score data available.</p> : (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
              <span className={`text-2xl font-bold ${scoreColor}`}>{scorePercent}%</span>
            </div>
            <div className="space-y-2 flex-1">
              {Object.entries(score).filter(([k])=>k!=='overallScore'&&k!=='score').map(([k,v])=>(
                <div key={k} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{k.replace(/([A-Z])/g,' $1').replace(/_/g,' ')}</span>
                  <span className="text-sm font-medium text-gray-800">{typeof v==='number'?`${v}%`:String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gap Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Gap Report</h2>
        {gaps.length===0 ? <p className="text-gray-400 text-sm">No gaps identified.</p> : (
          <div className="space-y-3">{gaps.map((g:any,i:number)=>(
            <div key={g.id||i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{g.title||g.name||g.description||`Gap #${i+1}`}</p>
                <p className="text-xs text-gray-500">{g.status&&<span className="capitalize">{g.status}</span>}{g.severity&&<span className="ml-2">Severity: {g.severity}</span>}</p>
              </div>
              {g.dueDate&&<span className="text-xs text-gray-400">{new Date(g.dueDate).toLocaleDateString()}</span>}
            </div>
          ))}</div>
        )}
      </div>

      {/* Audit Readiness */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Audit Readiness</h2>
        {!audit ? <p className="text-gray-400 text-sm">No audit readiness data available.</p> : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${(audit.ready||audit.isReady)?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                <span className="text-xl font-bold">{(audit.ready||audit.isReady)?'YES':'NO'}</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {Object.entries(audit).filter(([k])=>k!=='ready'&&k!=='isReady').map(([k,v])=>(
                <div key={k} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{k.replace(/([A-Z])/g,' $1').replace(/_/g,' ')}</span>
                  <span className="text-sm font-medium text-gray-800">{typeof v==='object'?JSON.stringify(v):String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
