'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { companiesApi, CompanyData } from '@/lib/api';

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    legalName: '',
    industry: '',
    size: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'Asia/Jakarta',
    language: 'id',
    dateFormat: 'DD/MM/YYYY',
    currency: 'IDR',
  });

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await companiesApi.get(companyId);
        const c = res.data.data;
        setForm({
          name: c.name || '',
          code: c.code || '',
          legalName: c.legalName || '',
          industry: c.industry || '',
          size: c.size || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          country: c.country || '',
          postalCode: c.postalCode || '',
          phone: c.phone || '',
          email: c.email || '',
          website: c.website || '',
          timezone: c.timezone || 'Asia/Jakarta',
          language: c.language || 'id',
          dateFormat: c.dateFormat || 'DD/MM/YYYY',
          currency: c.currency || 'IDR',
        });
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload];
        }
      });
      await companiesApi.update(companyId, payload);
      router.push(`/dashboard/companies/${companyId}`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update company');
    } finally {
      setSaving(false);
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="mb-2 text-sm text-muted-foreground">
          <Link href="/dashboard/companies" className="hover:underline">Companies</Link>
          <span className="mx-2">/</span>
          <Link href={`/dashboard/companies/${companyId}`} className="hover:underline">{form.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Edit</span>
        </nav>
        <h1 className="text-2xl font-bold">Edit Company</h1>
        <p className="text-sm text-muted-foreground">Update company information</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Company Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Company Code *</label>
                <input name="code" value={form.code} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Legal Name</label>
                <input name="legalName" value={form.legalName} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Industry</label>
                <input name="industry" value={form.industry} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Company Size</label>
                <select name="size" value={form.size} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div><label className="mb-1 block text-sm font-medium">City</label><input name="city" value={form.city} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
              <div><label className="mb-1 block text-sm font-medium">State/Province</label><input name="state" value={form.state} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
              <div><label className="mb-1 block text-sm font-medium">Country</label><input name="country" value={form.country} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
              <div><label className="mb-1 block text-sm font-medium">Postal Code</label><input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Contact</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
              <div><label className="mb-1 block text-sm font-medium">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
              <div className="md:col-span-2"><label className="mb-1 block text-sm font-medium">Website</label><input name="website" value={form.website} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
            </div>
          </div>

          {/* Localization */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Localization</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Timezone</label>
                <select name="timezone" value={form.timezone} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Language</label>
                <select name="language" value={form.language} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Date Format</label>
                <select name="dateFormat" value={form.dateFormat} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="IDR">IDR — Rupiah</option>
                  <option value="USD">USD — Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href={`/dashboard/companies/${companyId}`} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
