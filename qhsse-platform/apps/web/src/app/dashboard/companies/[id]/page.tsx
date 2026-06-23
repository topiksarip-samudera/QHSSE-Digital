'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { companiesApi, CompanyData } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyRes, statsRes] = await Promise.all([
          companiesApi.get(companyId),
          companiesApi.getStats(companyId),
        ]);
        setCompany(companyRes.data.data);
        setStats(statsRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [companyId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to set this company to "${newStatus}"?`)) return;
    try {
      await companiesApi.updateStatus(companyId, newStatus);
      setCompany((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) return;
    try {
      await companiesApi.delete(companyId);
      router.push('/dashboard/companies');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete company');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading company...</span>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">{error || 'Company not found'}</p>
        <Link href="/dashboard/companies" className="mt-3 inline-block text-sm text-red-600 underline">
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="mb-2 text-sm text-muted-foreground">
          <Link href="/dashboard/companies" className="hover:underline">Companies</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{company.name}</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="mt-1 flex items-center gap-3">
              <code className="rounded bg-muted px-2 py-0.5 text-sm">{company.code}</code>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[company.status] || 'bg-gray-100'}`}>
                {company.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/companies/${companyId}/edit`}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Edit
            </Link>
            <Link
              href={`/dashboard/companies/${companyId}/settings`}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Settings
            </Link>
            {company.status === 'active' && (
              <button
                onClick={() => handleStatusChange('suspended')}
                className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Suspend
              </button>
            )}
            {(company.status === 'suspended' || company.status === 'inactive') && (
              <button
                onClick={() => handleStatusChange('active')}
                className="rounded-md border border-green-200 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
              >
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid gap-4 md:grid-cols-5">
          {[
            { label: 'Sites', value: stats.sites, icon: '🏗️' },
            { label: 'Departments', value: stats.departments, icon: '🏛️' },
            { label: 'Users', value: stats.users, icon: '👥' },
            { label: 'Projects', value: stats.projects, icon: '📁' },
            { label: 'Active Actions', value: stats.activeActions, icon: '✅' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Info */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Company Information</h2>
          <dl className="space-y-3">
            {[
              ['Legal Name', company.legalName],
              ['Industry', company.industry],
              ['Size', company.size],
              ['Tenant', company.tenant?.name],
              ['Created', new Date(company.createdAt).toLocaleDateString('id-ID')],
              ['Updated', new Date(company.updatedAt).toLocaleDateString('id-ID')],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Contact & Location */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Contact & Location</h2>
          <dl className="space-y-3">
            {[
              ['Address', [company.address, company.city, company.state, company.country].filter(Boolean).join(', ')],
              ['Postal Code', company.postalCode],
              ['Phone', company.phone],
              ['Email', company.email],
              ['Website', company.website],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Localization */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Localization</h2>
          <dl className="space-y-3">
            {[
              ['Timezone', company.timezone],
              ['Language', company.language === 'id' ? 'Bahasa Indonesia' : 'English'],
              ['Date Format', company.dateFormat],
              ['Currency', company.currency],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Organization Summary */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Organization Summary</h2>
          <div className="space-y-3">
            {company._count && Object.entries(company._count).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium">{String(value ?? 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-lg border border-red-200 bg-card p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-red-600">Danger Zone</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Deleting a company will archive all associated data. This action can only be performed by a super admin.
        </p>
        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete Company
        </button>
      </div>
    </div>
  );
}
