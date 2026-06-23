'use client'; import { useState, useEffect, useCallback } from 'react'; import { useParams, useRouter } from 'next/navigation'; import { riskReportApi } from '@/lib/api'; import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = { draft: 'bg-gray-100', submitted: 'bg-blue-100 text-blue-800', approved: 'bg-green-100', active: 'bg-emerald-100', closed: 'bg-green-200', cancelled: 'bg-red-100' };
const LEVEL_COLORS: Record<string, string> = { L: 'bg-green-100 text-green-800', M: 'bg-yellow-100 text-yellow-800', H: 'bg-orange-100 text-orange-800', E: 'bg-red-100 text-red-800' };

export default function RiskDetailPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [risk, setRisk] = useState<any>(null); const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => { setLoading(true); try { const r = await riskReportApi.getRisk(id); setRisk(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } }, [id]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async () => { try { await riskReportApi.submitRisk(id); fetchData(); } catch (e) { console.error(e); } };
  const handleDelete = async () => { if (!confirm('Delete?')) return; try { await riskReportApi.deleteRisk(id); router.push('/dashboard/risk'); } catch (e) { console.error(e); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!risk) return <div className="text-center py-12 text-red-500">Not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/risk" className="hover:text-blue-600">Risk Register</Link><span>/</span><span className="text-gray-900 truncate">{risk.title}</span></div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">{risk.title}</h1><div className="flex items-center gap-2 mt-1"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[risk.status]||'bg-gray-100'}`}>{risk.status}</span>{risk.initialRiskLevel&&<span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLORS[risk.initialRiskLevel]||''}`}>{risk.initialRiskLevel}</span>}</div></div>
        <div className="flex gap-2">{risk.status==='draft'&&<><button onClick={handleSubmit} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Submit</button><Link href={`/dashboard/risk/${id}/edit`} className="px-3 py-1.5 border rounded text-sm">Edit</Link><button onClick={handleDelete} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm">Delete</button></>}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
        <div><dt className="text-sm text-gray-500">Risk Number</dt><dd className="text-sm font-mono">{risk.riskNumber||'Draft'}</dd></div>
        <div><dt className="text-sm text-gray-500">Owner</dt><dd className="text-sm">{risk.riskOwnerId}</dd></div>
        <div><dt className="text-sm text-gray-500">Severity</dt><dd className="text-sm font-bold">{risk.initialSeverity||'-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Likelihood</dt><dd className="text-sm font-bold">{risk.initialLikelihood||'-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Risk Score</dt><dd className="text-lg font-bold">{risk.initialRiskScore||'-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Risk Level</dt><dd>{risk.initialRiskLevel?<span className={`inline-flex px-2 py-0.5 rounded text-sm font-bold ${LEVEL_COLORS[risk.initialRiskLevel]||''}`}>{risk.initialRiskLevel}</span>:'-'}</dd></div>
        <div className="col-span-2"><dt className="text-sm text-gray-500">Description</dt><dd className="text-sm mt-1">{risk.description||'-'}</dd></div>
      </div>
    </div>
  );
}
