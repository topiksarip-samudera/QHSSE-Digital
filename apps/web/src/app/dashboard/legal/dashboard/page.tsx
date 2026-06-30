'use client'; import { useState, useEffect, useCallback } from 'react'; import { legalApi } from '@/lib/api';

const KPI_LABELS: Record<string,string> = { regulations:'Regulations', standards:'Standards', requirements:'Requirements', obligations:'Obligations', assessments:'Assessments', gaps:'Gaps', openGaps:'Open Gaps', overdueGaps:'Overdue Gaps', evidence:'Evidence', applicableItems:'Applicable Items' };
const KPI_COLORS = ['bg-blue-50 border-blue-200 text-blue-800','bg-green-50 border-green-200 text-green-800','bg-purple-50 border-purple-200 text-purple-800','bg-amber-50 border-amber-200 text-amber-800','bg-cyan-50 border-cyan-200 text-cyan-800','bg-rose-50 border-rose-200 text-rose-800','bg-orange-50 border-orange-200 text-orange-800','bg-red-50 border-red-200 text-red-800','bg-teal-50 border-teal-200 text-teal-800','bg-indigo-50 border-indigo-200 text-indigo-800'];

export default function LegalDashboardPage() {
  const [kpis, setKpis] = useState<Record<string,number>|null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const fetch = useCallback(async () => { try { const r = await legalApi.getDashboard(); setKpis(r.data.data||{}); } catch(e:any){ setError(e.response?.data?.message||'Failed to load dashboard'); } finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}<button onClick={fetch} className="ml-3 text-sm text-blue-600 underline">Retry</button></div>;
  if (!kpis || Object.keys(kpis).length===0) return <div className="text-center py-12 text-gray-400">No dashboard data available.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Legal & Compliance Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(kpis).map(([key,value],i)=>(
          <div key={key} className={`p-4 rounded-lg border ${KPI_COLORS[i%KPI_COLORS.length]}`}>
            <p className="text-sm font-medium opacity-80">{KPI_LABELS[key]||key}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
