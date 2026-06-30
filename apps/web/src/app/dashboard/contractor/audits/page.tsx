'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorAuditsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [audits, setAudits] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchAudits = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getAudits(selectedContractor, { page, limit: 20 });
      setAudits(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAudits(); }, [selectedContractor]);

  const resultColors: Record<string, string> = { pass: 'bg-green-200 text-green-700', conditional: 'bg-yellow-200 text-yellow-700', fail: 'bg-red-200 text-red-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Audits & Inspections</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const type = prompt('Type (audit/inspection):', 'audit'); if (!type) return;
          const result = prompt('Result (pass/conditional/fail):', 'pass');
          contractorApi.createAudit(selectedContractor, { auditInspectionType: type, result }).then(() => fetchAudits());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + New Audit/Inspection
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {audits.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium capitalize">{a.auditInspectionType} - {new Date(a.date).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">Findings: {a.findingsCount} | Action Required: {a.actionRequired ? 'Yes' : 'No'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${resultColors[a.result] || 'bg-gray-100'}`}>{a.result}</span>
                <button onClick={() => contractorApi.deleteAudit(a.id).then(() => fetchAudits())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {audits.length === 0 && <div className="text-muted-foreground">No audits/inspections found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
