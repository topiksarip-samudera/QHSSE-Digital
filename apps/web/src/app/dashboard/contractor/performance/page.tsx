'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorPerformancePage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [records, setRecords] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
    contractorApi.getScore().then(r => setScore(r.data.data)).catch(() => {});
  }, []);

  const fetchPerformance = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getPerformance(selectedContractor, { page, limit: 20 });
      setRecords(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchPerformance(); }, [selectedContractor]);

  const ratingColors: Record<string, string> = { excellent: 'bg-green-500 text-white', good: 'bg-green-200 text-green-700', satisfactory: 'bg-blue-200 text-blue-700', poor: 'bg-yellow-200 text-yellow-700', unacceptable: 'bg-red-200 text-red-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Performance</h1>

      {score && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Contractors', value: score.totalContractors },
            { label: 'Approved', value: score.approvedCount },
            { label: 'Suspended', value: score.suspendedCount },
            { label: 'High Risk', value: score.highRiskCount },
            { label: 'Prequal Pass Rate', value: `${score.prequalPassRate.toFixed(1)}%` },
            { label: 'Overall Score', value: score.overallScore },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 bg-card border rounded-md text-center">
              <div className="text-lg font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
          <button onClick={() => contractorApi.recalculateScore().then(r => setScore(r.data.data))} className="col-span-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
            Recalculate Score
          </button>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const rating = prompt('Rating (excellent/good/satisfactory/poor/unacceptable):', 'satisfactory'); if (!rating) return;
          const period = prompt('Period (monthly/quarterly/annually):', 'quarterly'); if (!period) return;
          const scoreVal = prompt('Score (0-100):', '75');
          contractorApi.createPerformance(selectedContractor, { rating, ratingPeriod: period, score: scoreVal ? parseFloat(scoreVal) : 75 }).then(() => fetchPerformance());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Rate Performance
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {records.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">Score: {r.score} - {r.rating}</div>
                <div className="text-sm text-muted-foreground">Period: {r.ratingPeriod} | Rated: {new Date(r.ratedAt).toLocaleDateString()}</div>
                {r.comments && <div className="text-sm italic mt-1">{r.comments}</div>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${ratingColors[r.rating] || 'bg-gray-100'}`}>{r.rating}</span>
                <button onClick={() => contractorApi.deletePerformance(r.id).then(() => fetchPerformance())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {records.length === 0 && <div className="text-muted-foreground">No performance records. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
