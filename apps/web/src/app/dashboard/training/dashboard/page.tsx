'use client'; import { useState, useEffect } from 'react'; import Link from 'next/link'; import { trainingApi } from '@/lib/api';

export default function TrainingDashboardPage() {
  const [stats, setStats] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  useEffect(() => { trainingApi.getDashboardStats().then(r => { setStats(r.data.data || r.data); }).catch(() => setError('Failed to load dashboard stats')).finally(() => setLoading(false)); }, []);

  const cards = stats ? [
    { label: 'Total Matrices', value: stats.totalMatrices ?? '-', href: '/dashboard/training/matrices', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Training Plans', value: stats.totalPlans ?? '-', href: '/dashboard/training/plans', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Sessions', value: stats.totalSessions ?? '-', href: '/dashboard/training/sessions', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    { label: 'Completed Sessions', value: stats.completedSessions ?? '-', href: '/dashboard/training/sessions', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Total Certificates', value: stats.totalCertificates ?? '-', href: '/dashboard/training/certificates', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { label: 'Active Certificates', value: stats.activeCertificates ?? '-', href: '/dashboard/training/certificates', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { label: 'Expired Certificates', value: stats.expiredCertificates ?? '-', href: '/dashboard/training/certificates', color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Total Competencies', value: stats.totalCompetencies ?? '-', href: '/dashboard/training/competency', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Compliance Rate', value: stats.complianceRate != null ? `${stats.complianceRate}%` : '-', href: '/dashboard/training/reports', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ] : [];

  if (loading) return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-500">{error}</p><button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Training & Competency Dashboard</h1><p className="text-gray-600 mt-1">KPI overview of training and competency metrics</p></div>
      {stats && cards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className={`border rounded-lg p-5 hover:shadow-md transition-shadow ${c.color}`}>
              <p className="text-sm font-medium opacity-80">{c.label}</p>
              <p className="text-3xl font-bold mt-1">{c.value}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No dashboard data available</p></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/training/sessions" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow text-center"><p className="font-semibold text-gray-900">Session Management</p><p className="text-sm text-gray-500 mt-1">Create and manage training sessions</p></Link>
        <Link href="/dashboard/training/gap-analysis" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow text-center"><p className="font-semibold text-gray-900">Gap Analysis</p><p className="text-sm text-gray-500 mt-1">View competency gaps and needs</p></Link>
        <Link href="/dashboard/training/reports" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow text-center"><p className="font-semibold text-gray-900">Reports</p><p className="text-sm text-gray-500 mt-1">Expiry, compliance and attendance reports</p></Link>
      </div>
    </div>
  );
}
