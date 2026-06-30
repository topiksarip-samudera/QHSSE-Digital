'use client';

import { useState, useEffect, Suspense } from 'react';
import { apiClient } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

function EmergencyResponsesContent() {
  const searchParams = useSearchParams();
  const incidentIdParam = searchParams.get('incidentId');
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentIdParam) { setLoading(false); return; }
    apiClient.get(`/emergency/incidents/${incidentIdParam}/responses`).then(r => setResponses(r.data.items || [])).catch(() => {}).finally(() => setLoading(false));
  }, [incidentIdParam]);

  if (loading) return <div className="p-8 text-muted-foreground">Loading responses...</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Emergency Responses</h1>
      {!incidentIdParam ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          <p>Navigate to an incident and view its responses from the Incidents page.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Action</th>
                <th className="text-left px-4 py-3 font-medium">By</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r: any) => (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">{r.actionTaken}</td>
                  <td className="px-4 py-3 text-xs">{r.actionBy || '-'}</td>
                  <td className="px-4 py-3 text-xs">{new Date(r.actionAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{r.result || '-'}</td>
                </tr>
              ))}
              {responses.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No responses for this incident</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function EmergencyResponsesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <EmergencyResponsesContent />
    </Suspense>
  );
}
