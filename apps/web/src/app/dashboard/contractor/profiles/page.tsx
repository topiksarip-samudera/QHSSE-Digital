'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api';
import Link from 'next/link';

export default function ContractorProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProfiles = async (page = 1) => {
    setLoading(true);
    try {
      const q: any = { page, limit: 20 };
      if (search) q.search = search;
      if (statusFilter) q.status = statusFilter;
      const r = await contractorApi.getProfiles(q);
      setProfiles(r.data.data);
      setMeta(r.data.meta);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProfiles(); }, [search, statusFilter]);

  const statusColors: Record<string, string> = {
    registered: 'bg-gray-200 text-gray-700',
    prequalified: 'bg-blue-200 text-blue-700',
    approved: 'bg-green-200 text-green-700',
    suspended: 'bg-yellow-200 text-yellow-700',
    blacklisted: 'bg-red-200 text-red-700',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contractor Profiles</h1>
        <button onClick={() => {
          const name = prompt('Contractor Name:'); if (!name) return;
          const code = prompt('Contractor Code:'); if (!code) return;
          contractorApi.createProfile({ name, contractorCode: code }).then(() => fetchProfiles());
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          + Add Contractor
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="px-3 py-2 border rounded-md text-sm flex-1 max-w-xs" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
          <option value="">All Status</option>
          <option value="registered">Registered</option>
          <option value="prequalified">Prequalified</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </div>

      {loading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {profiles.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.contractorCode} - {p.contactPerson || 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[p.status] || 'bg-gray-100'}`}>{p.status}</span>
                <select defaultValue="" onChange={async (e) => {
                  if (!e.target.value) return;
                  if (e.target.value === 'suspended') {
                    const reason = prompt('Suspension reason:');
                    if (reason) await contractorApi.createSuspension(p.id, { reason });
                  } else {
                    await contractorApi.updateProfileStatus(p.id, { status: e.target.value });
                  }
                  fetchProfiles();
                }} className="px-2 py-1 border rounded text-xs">
                  <option value="">Action...</option>
                  <option value="approved">Approve</option>
                  <option value="suspended">Suspend</option>
                  <option value="blacklisted">Blacklist</option>
                </select>
                <button onClick={() => contractorApi.deleteProfile(p.id).then(() => fetchProfiles())} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
            <span>Total: {meta.total || 0}</span>
            <div className="flex gap-2">
              {Array.from({ length: meta.totalPages || 1 }, (_, i) => (
                <button key={i} onClick={() => fetchProfiles(i + 1)} className={`px-2 py-1 rounded ${i + 1 === meta.page ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
