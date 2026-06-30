'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorIncidentsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [incidents, setIncidents] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchIncidents = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getIncidents(selectedContractor, { page, limit: 20 });
      setIncidents(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchIncidents(); }, [selectedContractor]);

  const severityColors: Record<string, string> = { low: 'bg-green-200 text-green-700', medium: 'bg-yellow-200 text-yellow-700', high: 'bg-orange-200 text-orange-700', critical: 'bg-red-200 text-red-700' };
  const statusColors: Record<string, string> = { open: 'bg-red-200 text-red-700', investigating: 'bg-yellow-200 text-yellow-700', closed: 'bg-green-200 text-green-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Incidents</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const incidentType = prompt('Incident Type:'); if (!incidentType) return;
          const title = prompt('Title:'); if (!title) return;
          const severity = prompt('Severity (low/medium/high/critical):', 'low');
          contractorApi.createIncident(selectedContractor, { incidentType, title, severity }).then(() => fetchIncidents());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Report Incident
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {incidents.map((i: any) => (
            <div key={i.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-muted-foreground">Type: {i.incidentType} | Date: {new Date(i.incidentDate).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[i.severity] || 'bg-gray-100'}`}>{i.severity}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[i.status] || 'bg-gray-100'}`}>{i.status}</span>
                <button onClick={() => contractorApi.deleteIncident(i.id).then(() => fetchIncidents())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {incidents.length === 0 && <div className="text-muted-foreground">No incidents found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
