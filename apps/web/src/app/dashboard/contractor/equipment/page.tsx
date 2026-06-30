'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorEquipmentPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchEquipment = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getEquipment(selectedContractor, { page, limit: 20 });
      setEquipment(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchEquipment(); }, [selectedContractor]);

  const statusColors: Record<string, string> = { compliant: 'bg-green-200 text-green-700', overdue: 'bg-red-200 text-red-700', flagged: 'bg-yellow-200 text-yellow-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Equipment</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const name = prompt('Equipment Name:'); if (!name) return;
          const type = prompt('Equipment Type:'); if (!type) return;
          contractorApi.createEquipment(selectedContractor, { equipmentName: name, equipmentType: type }).then(() => fetchEquipment());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Add Equipment
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {equipment.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{e.equipmentName}</div>
                <div className="text-sm text-muted-foreground">Type: {e.equipmentType} | Inspection Due: {e.inspectionDue ? new Date(e.inspectionDue).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[e.status] || 'bg-gray-100'}`}>{e.status}</span>
                <button onClick={() => contractorApi.deleteEquipment(e.id).then(() => fetchEquipment())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {equipment.length === 0 && <div className="text-muted-foreground">No equipment found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
