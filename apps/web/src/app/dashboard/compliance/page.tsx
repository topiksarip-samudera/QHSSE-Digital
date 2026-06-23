'use client'; import { useState, useEffect } from 'react'; import { complianceApi } from '@/lib/api';

export default function CompliancePage() {
  const [score, setScore] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const [s, a, p] = await Promise.all([complianceApi.getScore().catch(()=>({data:{}})), complianceApi.getAccessReviews().catch(()=>({data:[]})), complianceApi.getAcknowledgements().catch(()=>({data:[]})) ]);
      setScore(s.data); setReviews(a.data||[]); setAcknowledgements(p.data||[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Compliance & Control Center</h1>

      {score && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Compliance Score</h2>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-5xl font-bold text-blue-600">{score.totalScore||0}</p><p className="text-xs text-gray-400 mt-1">/ 100</p></div>
            <div className="flex-1 space-y-2">
              {[{label:'Access',val:score.breakdown?.access||0,max:25},{label:'Permissions',val:score.breakdown?.permissions||0,max:25},{label:'Policies',val:score.breakdown?.policies||0,max:50}].map(b=>(<div key={b.label}><div className="flex justify-between text-xs mb-0.5"><span>{b.label}</span><span>{b.val}/{b.max}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width:`${(b.val/b.max)*100}%`}}/></div></div>))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Access Reviews ({reviews.length})</h2>
        {reviews.length===0?<p className="text-sm text-gray-400">No reviews</p>:<ul className="space-y-2">{reviews.slice(0,10).map((r:any)=>(<li key={r.id} className="text-sm flex justify-between"><span>User: {r.userId}</span><span className={`text-xs ${r.status==='approved'?'text-green-600':'text-yellow-600'}`}>{r.status}</span></li>))}</ul>}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Policy Acknowledgements ({acknowledgements.length})</h2>
        {acknowledgements.length===0?<p className="text-sm text-gray-400">No acknowledgements</p>:<ul className="space-y-2">{acknowledgements.slice(0,10).map((a:any)=>(<li key={a.id} className="text-sm flex justify-between"><span>{a.policyName} v{a.version}</span><span className="text-xs text-gray-400">{new Date(a.acknowledgedAt).toLocaleDateString()}</span></li>))}</ul>}
      </div>
    </div>
  );
}
