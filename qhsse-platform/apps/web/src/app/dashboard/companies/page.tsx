'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { companiesApi, CompanyData, CompanyQuery } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<CompanyQuery>({ page: 1, pageSize: 20, search: '', status: '' });

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await companiesApi.list(query);
      setCompanies(res.data.data || []);
      setMeta(res.data.meta || { page: 1, pageSize: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Manage companies and tenant organizations
          </p>
        </div>
        <Link
          href="/dashboard/companies/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + New Company
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search companies..."
            value={query.search || ''}
            onChange={(e) => setQuery((prev) => ({ ...prev, search: e.target.value }))}
            className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select
            value={query.status || ''}
            onChange={(e) => setQuery((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={query.size || ''}
            onChange={(e) => setQuery((prev) => ({ ...prev, size: e.target.value, page: 1 }))}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <button
            type="submit"
            className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchCompanies}
            className="mt-2 text-red-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 text-muted-foreground">Loading companies...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && companies.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🏢</p>
          <h3 className="text-lg font-medium">No companies found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {query.search
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first company'}
          </p>
          {!query.search && (
            <Link
              href="/dashboard/companies/new"
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + Create Company
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && companies.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Industry</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sites</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <Link
                          href={`/dashboard/companies/${company.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {company.name}
                        </Link>
                        {company.city && (
                          <p className="text-xs text-muted-foreground">{company.city}, {company.country}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{company.code}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{company.industry || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[company.status] || 'bg-gray-100 text-gray-800'}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{company._count?.sites ?? 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">{company._count?.users ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/companies/${company.id}`}
                          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/companies/${company.id}/edit`}
                          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/companies/${company.id}/settings`}
                          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          Settings
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(meta.page - 1) * meta.pageSize + 1} to{' '}
                {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} companies
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="rounded border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded border px-3 py-1.5 text-sm ${
                        pageNum === meta.page ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="rounded border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
