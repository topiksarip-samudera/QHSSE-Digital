'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorWorkersPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [competencies, setCompetencies] = useState<any[]>([]);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchWorkers = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getWorkers(selectedContractor, { page, limit: 20 });
      setWorkers(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  const fetchCompetencies = async (workerId: string) => {
    try {
      const r = await contractorApi.getWorkerCompetencies(workerId);
      setCompetencies(r.data.data);
    } catch {}
  };

  useEffect(() => { fetchWorkers(); }, [selectedContractor]);

  const statusColors: Record<string, string> = { active: 'bg-green-200 text-green-700', suspended: 'bg-yellow-200 text-yellow-700', blacklisted: 'bg-red-200 text-red-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Workers</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const fullName = prompt('Full Name:'); if (!fullName) return;
          const workerId = prompt('Worker ID:'); if (!workerId) return;
          contractorApi.createWorker(selectedContractor, { fullName, workerId }).then(() => fetchWorkers());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Add Worker
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {workers.map((w: any) => (
            <div key={w.id}>
              <div className="flex items-center justify-between p-4 bg-card border rounded-md">
                <div>
                  <div className="font-medium">{w.fullName} ({w.workerId})</div>
                  <div className="text-sm text-muted-foreground">Role: {w.role || 'N/A'} | Score: {w.competencyScore} | Training: {w.trainingCompleted ? '✅' : '❌'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[w.status] || 'bg-gray-100'}`}>{w.status}</span>
                  <button onClick={() => { setSelectedWorker(w.id); fetchCompetencies(w.id); }} className="px-2 py-1 bg-muted rounded text-xs">Competencies</button>
                  <button onClick={() => {
                    const compType = prompt('Competency Type (e.g., Welding, Electrical):'); if (!compType) return;
                    const certName = prompt('Certification Name:'); if (!certName) return;
                    contractorApi.createWorkerCompetency(w.id, { competencyType: compType, certificationName: certName }).then(() => fetchCompetencies(w.id));
                  }} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">+ Cert</button>
                  <button onClick={() => contractorApi.deleteWorker(w.id).then(() => fetchWorkers())} className="text-red-500 text-sm">Delete</button>
                </div>
              </div>
              {selectedWorker === w.id && competencies.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {competencies.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span>{c.competencyType}: {c.certificationName} ({c.status})</span>
                      <button onClick={() => contractorApi.deleteWorkerCompetency(c.id).then(() => fetchCompetencies(w.id))} className="text-red-500 text-xs">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {workers.length === 0 && <div className="text-muted-foreground">No workers found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
