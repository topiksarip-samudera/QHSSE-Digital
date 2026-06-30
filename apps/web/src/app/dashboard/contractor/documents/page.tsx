'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';

export default function ContractorDocumentsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi.getProfiles({ limit: 200 }).then(r => setProfiles(r.data.data)).catch(() => {});
  }, []);

  const fetchDocuments = async (page = 1) => {
    if (!selectedContractor) return;
    setLoading(true);
    try {
      const r = await contractorApi.getDocuments(selectedContractor, { page, limit: 20 });
      setDocuments(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchDocuments(); }, [selectedContractor]);

  const statusColors: Record<string, string> = { active: 'bg-green-200 text-green-700', expired: 'bg-red-200 text-red-700' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Documents</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedContractor} onChange={e => setSelectedContractor(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs">
          <option value="">Select Contractor</option>
          {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.contractorCode})</option>)}
        </select>
        <button onClick={() => {
          if (!selectedContractor) return alert('Select a contractor first');
          const docType = prompt('Document Type:'); if (!docType) return;
          const docName = prompt('Document Name:'); if (!docName) return;
          contractorApi.createDocument(selectedContractor, { documentType: docType, documentName: docName }).then(() => fetchDocuments());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Add Document
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {documents.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{d.documentName}</div>
                <div className="text-sm text-muted-foreground">Type: {d.documentType} | Expiry: {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[d.status] || 'bg-gray-100'}`}>{d.status}</span>
                <button onClick={() => contractorApi.deleteDocument(d.id).then(() => fetchDocuments())} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {documents.length === 0 && <div className="text-muted-foreground">No documents found. Select a contractor above.</div>}
        </div>
      )}
    </div>
  );
}
