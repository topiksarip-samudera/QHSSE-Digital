'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FormPageProps {
  title: string;
  backHref: string;
  api: {
    get?: (id: string) => Promise<any>;
    create?: (data: Record<string, any>) => Promise<any>;
    update?: (id: string, data: Record<string, any>) => Promise<any>;
  };
  fields: Field[];
  id?: string;
  defaultCompanyId?: string;
}

const inputClass = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20";

export default function OrgFormPage({ title, backHref, api, fields, id, defaultCompanyId }: FormPageProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && api.get) {
      setLoading(true);
      api.get(id).then((res) => {
        const d = res.data.data;
        const formData: Record<string, any> = {};
        fields.forEach((f) => { formData[f.name] = d[f.name] ?? ''; });
        setForm(formData);
      }).catch((err) => {
        setError(err.response?.data?.error?.message || 'Failed to load data');
      }).finally(() => setLoading(false));
    }
  }, [id, api, fields]);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (!id && defaultCompanyId) payload.companyId = defaultCompanyId;
      Object.keys(payload).forEach((k) => { if (payload[k] === '') payload[k] = undefined; });
      if (id && api.update) {
        await api.update(id, payload);
      } else if (api.create) {
        await api.create(payload);
      }
      router.push(backHref);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
      </div>

      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={form[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className={inputClass}
              />
            ) : field.type === 'select' ? (
              <select
                value={form[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className={inputClass}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                type="number"
                step="any"
                value={form[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value ? parseFloat(e.target.value) : '')}
                placeholder={field.placeholder}
                required={field.required}
                className={inputClass}
              />
            ) : (
              <input
                type="text"
                value={form[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={inputClass}
              />
            )}
          </div>
        ))}

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
          <button type="button" onClick={() => router.push(backHref)}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
